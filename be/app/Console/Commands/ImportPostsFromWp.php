<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post\Post;
use App\Models\Post\PostCategory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ImportPostsFromWp extends Command
{
    protected $signature = 'import:wp-posts
        {--limit=0 : Giới hạn số bài viết import (0 = tất cả)}
        {--dry-run : Chạy thử nghiệm, không ghi dữ liệu vào DB}
        {--skip-images : Bỏ qua việc tải ảnh}';

    protected $description = 'Import bài viết (Blog & Khuyến mãi) từ WordPress cũ (dongnaiford.com.vn) sang hệ thống Laravel mới';

    private string $wpBaseUrl = 'https://dongnaiford.com.vn';
    private int $perPage = 20;
    private array $wpCategoryMap = [];   // WP category ID => Laravel PostCategory ID
    private array $downloadedImages = []; // URL => local path (cache tránh tải trùng)
    private int $importedCount = 0;
    private int $skippedCount = 0;
    private int $errorCount = 0;

    public function handle()
    {
        $limit = (int) $this->option('limit');
        $dryRun = $this->option('dry-run');
        $skipImages = $this->option('skip-images');

        $this->info('');
        $this->info('╔══════════════════════════════════════════════════════════════╗');
        $this->info('║   IMPORT BÀI VIẾT TỪ WORDPRESS CŨ → LARAVEL MỚI           ║');
        $this->info('║   Nguồn: https://dongnaiford.com.vn                        ║');
        $this->info('╚══════════════════════════════════════════════════════════════╝');
        $this->info('');

        if ($dryRun) {
            $this->warn('⚠️  CHẾ ĐỘ DRY-RUN: Không ghi dữ liệu vào cơ sở dữ liệu.');
        }

        // Bước 1: Đồng bộ danh mục (Categories)
        $this->info('📂 Bước 1/4: Đồng bộ danh mục từ WordPress...');
        $this->syncCategories($dryRun);

        // Bước 2: Thu thập & import bài viết
        $this->info('');
        $this->info('📝 Bước 2/4: Thu thập bài viết từ WordPress API...');
        $this->importPosts($limit, $dryRun, $skipImages);

        // Bước 3: Báo cáo kết quả
        $this->info('');
        $this->info('═══════════════════════════════════════════════════════');
        $this->info('📊 BÁO CÁO KẾT QUẢ:');
        $this->info("   ✅ Đã import thành công: {$this->importedCount} bài viết");
        $this->info("   ⏭️  Đã bỏ qua (trùng slug): {$this->skippedCount} bài viết");
        $this->info("   ❌ Lỗi: {$this->errorCount} bài viết");
        $this->info('═══════════════════════════════════════════════════════');

        return Command::SUCCESS;
    }

    /**
     * Đồng bộ danh mục (Categories) từ WordPress sang Laravel
     */
    private function syncCategories(bool $dryRun): void
    {
        try {
            $response = Http::timeout(30)->get("{$this->wpBaseUrl}/wp-json/wp/v2/categories", [
                'per_page' => 100,
            ]);

            if (!$response->successful()) {
                $this->error('   ❌ Không thể lấy danh mục từ WordPress API.');
                return;
            }

            $wpCategories = $response->json();
            $this->info("   Tìm thấy " . count($wpCategories) . " danh mục trên WordPress.");

            foreach ($wpCategories as $wpCat) {
                $slug = $wpCat['slug'];
                $name = html_entity_decode($wpCat['name'], ENT_QUOTES, 'UTF-8');

                // Tìm xem đã tồn tại trong Laravel chưa
                $existingCategory = PostCategory::whereHas('translations', function ($q) use ($slug) {
                    $q->where('slug', $slug);
                })->first();

                if ($existingCategory) {
                    $this->wpCategoryMap[$wpCat['id']] = $existingCategory->id;
                    $this->line("   ✔ Danh mục đã tồn tại: {$name} (slug: {$slug})");
                } else {
                    if (!$dryRun) {
                        $category = new PostCategory([
                            'status' => 'ACTIVE',
                            'position' => $wpCat['count'] > 0 ? 1 : 99,
                        ]);
                        $category->fill([
                            'vi' => ['title' => $name, 'slug' => $slug],
                        ]);
                        $category->save();
                        $this->wpCategoryMap[$wpCat['id']] = $category->id;
                        $this->info("   ✅ Tạo mới danh mục: {$name} (slug: {$slug})");
                    } else {
                        $this->info("   [DRY-RUN] Sẽ tạo danh mục: {$name} (slug: {$slug})");
                    }
                }
            }
        } catch (\Exception $e) {
            $this->error("   ❌ Lỗi đồng bộ danh mục: " . $e->getMessage());
        }
    }

    /**
     * Import bài viết từ WordPress REST API
     */
    private function importPosts(int $limit, bool $dryRun, bool $skipImages): void
    {
        $page = 1;
        $totalImported = 0;

        while (true) {
            $this->line("   📄 Đang tải trang {$page}...");

            try {
                $response = Http::timeout(60)->get("{$this->wpBaseUrl}/wp-json/wp/v2/posts", [
                    'per_page' => $this->perPage,
                    'page' => $page,
                    'status' => 'publish',
                    '_embed' => 1,
                    'orderby' => 'date',
                    'order' => 'desc',
                ]);

                if (!$response->successful()) {
                    // WordPress trả 400 khi page vượt quá tổng số trang
                    if ($response->status() === 400) {
                        $this->info("   Đã tải hết toàn bộ bài viết.");
                        break;
                    }
                    $this->error("   ❌ Lỗi API WordPress (HTTP {$response->status()})");
                    break;
                }

                $posts = $response->json();

                if (empty($posts)) {
                    $this->info("   Đã tải hết toàn bộ bài viết.");
                    break;
                }

                foreach ($posts as $wpPost) {
                    if ($limit > 0 && $totalImported >= $limit) {
                        $this->info("   ⏹️  Đã đạt giới hạn import: {$limit} bài viết.");
                        return;
                    }

                    $this->processSinglePost($wpPost, $dryRun, $skipImages);
                    $totalImported++;
                }

                $page++;

                // Nghỉ 500ms giữa các request để tránh quá tải server WP
                usleep(500000);

            } catch (\Exception $e) {
                $this->error("   ❌ Lỗi tải trang {$page}: " . $e->getMessage());
                $this->errorCount++;
                break;
            }
        }
    }

    /**
     * Xử lý và import một bài viết đơn lẻ
     */
    private function processSinglePost(array $wpPost, bool $dryRun, bool $skipImages): void
    {
        $slug = $wpPost['slug'] ?? '';
        $title = html_entity_decode($wpPost['title']['rendered'] ?? '', ENT_QUOTES, 'UTF-8');
        $title = strip_tags($title);

        // Kiểm tra trùng slug
        $exists = Post::whereHas('translations', function ($q) use ($slug) {
            $q->where('slug', $slug);
        })->exists();

        if ($exists) {
            $this->line("   ⏭️  Bỏ qua (trùng slug): {$title}");
            $this->skippedCount++;
            return;
        }

        // --- Trích xuất dữ liệu ---
        $content = $wpPost['content']['rendered'] ?? '';
        $excerpt = $wpPost['excerpt']['rendered'] ?? '';
        $publishedAt = isset($wpPost['date']) ? date('Y-m-d', strtotime($wpPost['date'])) : now()->toDateString();

        // Lấy danh mục WordPress
        $wpCategoryIds = $wpPost['categories'] ?? [];

        // --- Xử lý ảnh đại diện (Featured Image) từ _embed ---
        $imageData = null;
        if (!$skipImages) {
            $imageData = $this->extractFeaturedImage($wpPost, $title);
        }

        // --- Xử lý nội dung HTML ---
        $content = $this->processHtmlContent($content, $skipImages);
        $cleanExcerpt = $this->cleanExcerpt($excerpt);

        // --- SEO Meta ---
        $seoTitle = $title;
        $seoDescription = Str::limit($cleanExcerpt, 160);
        $seoSlug = $slug;

        if ($dryRun) {
            $this->info("   [DRY-RUN] Sẽ import: {$title} (slug: {$slug}, ngày: {$publishedAt})");
            $this->importedCount++;
            return;
        }

        // --- Tạo bài viết trong Laravel ---
        try {
            DB::beginTransaction();

            $post = new Post([
                'image' => $imageData,
                'published_at' => $publishedAt,
                'is_featured' => false,
                'is_home' => false,
                'type' => Post::TYPE_POST,
                'status' => Post::STATUS_ACTIVE,
            ]);

            $post->fill([
                'vi' => [
                    'title' => $title,
                    'slug' => $slug,
                    'description' => $cleanExcerpt,
                    'content' => $content,
                    'seo_meta_title' => Str::limit($seoTitle, 60),
                    'seo_slug' => $seoSlug,
                    'seo_meta_description' => $seoDescription,
                ],
            ]);

            $post->save();

            // Gắn danh mục
            $laravelCategoryIds = [];
            foreach ($wpCategoryIds as $wpCatId) {
                if (isset($this->wpCategoryMap[$wpCatId])) {
                    $laravelCategoryIds[] = $this->wpCategoryMap[$wpCatId];
                }
            }
            if (!empty($laravelCategoryIds)) {
                $post->categories()->attach($laravelCategoryIds);
            }

            DB::commit();

            $this->info("   ✅ Import thành công: {$title}");
            $this->importedCount++;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("   ❌ Lỗi import bài viết '{$title}': " . $e->getMessage());
            $this->errorCount++;
        }
    }

    /**
     * Trích xuất ảnh đại diện (Featured Image) từ phản hồi _embed của WP
     */
    private function extractFeaturedImage(array $wpPost, string $altText): ?array
    {
        try {
            $embedded = $wpPost['_embedded'] ?? [];
            $featuredMedia = $embedded['wp:featuredmedia'][0] ?? null;

            if (!$featuredMedia) {
                return null;
            }

            // Ưu tiên ảnh gốc full-size
            $imageUrl = $featuredMedia['source_url']
                ?? $featuredMedia['media_details']['sizes']['full']['source_url']
                ?? $featuredMedia['media_details']['sizes']['large']['source_url']
                ?? null;

            if (!$imageUrl) {
                return null;
            }

            $localPath = $this->downloadImage($imageUrl);

            if ($localPath) {
                return ['path' => $localPath, 'alt' => $altText];
            }
        } catch (\Exception $e) {
            $this->warn("   ⚠️ Không tải được ảnh đại diện: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Tải một file ảnh từ URL về lưu trữ local
     */
    private function downloadImage(string $url): ?string
    {
        // Kiểm tra cache nếu đã tải trước đó
        if (isset($this->downloadedImages[$url])) {
            return $this->downloadedImages[$url];
        }

        try {
            $response = Http::timeout(30)->withOptions([
                'verify' => false,
            ])->get($url);

            if (!$response->successful()) {
                $this->warn("   ⚠️ HTTP {$response->status()} khi tải ảnh: {$url}");
                return null;
            }

            $imageContent = $response->body();

            // Xác định phần mở rộng từ URL
            $parsedUrl = parse_url($url);
            $pathInfo = pathinfo($parsedUrl['path'] ?? '');
            $extension = strtolower($pathInfo['extension'] ?? 'jpg');

            // Chỉ cho phép định dạng ảnh hợp lệ
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
            if (!in_array($extension, $allowedExtensions)) {
                $extension = 'jpg';
            }

            // Tạo tên file duy nhất
            $filename = Str::slug($pathInfo['filename'] ?? Str::random(10)) . '.' . $extension;
            $datePath = date('Y/m');
            $storagePath = "uploads/posts/{$datePath}/{$filename}";

            // Lưu file
            Storage::disk('public')->put($storagePath, $imageContent);

            $this->downloadedImages[$url] = $storagePath;
            return $storagePath;

        } catch (\Exception $e) {
            $this->warn("   ⚠️ Lỗi tải ảnh {$url}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Xử lý nội dung HTML bài viết:
     * - Tải ảnh inline về local (nếu bật)
     * - Viết lại link nội bộ sang định dạng /[slug].html
     */
    private function processHtmlContent(string $content, bool $skipImages): string
    {
        if (empty($content)) {
            return $content;
        }

        // 1. Tải ảnh inline & viết lại src
        if (!$skipImages) {
            $content = $this->rewriteInlineImages($content);
        }

        // 2. Viết lại link nội bộ từ https://dongnaiford.com.vn/[slug].html sang /[slug].html
        $content = $this->rewriteInternalLinks($content);

        // 3. Xoá các srcset (tham chiếu nhiều kích thước ảnh WP) để tránh lỗi ảnh
        $content = preg_replace('/\s+srcset="[^"]*"/', '', $content);
        $content = preg_replace('/\s+sizes="[^"]*"/', '', $content);

        return $content;
    }

    /**
     * Tìm tất cả thẻ <img> có src trỏ đến dongnaiford.com.vn, tải ảnh và viết lại src
     */
    private function rewriteInlineImages(string $content): string
    {
        // Regex tìm các thẻ img có src chứa dongnaiford.com.vn
        $pattern = '/<img([^>]*)\s+src=["\']([^"\']*dongnaiford\.com\.vn[^"\']*)["\']([^>]*)>/i';

        $content = preg_replace_callback($pattern, function ($matches) {
            $beforeSrc = $matches[1];
            $originalUrl = $matches[2];
            $afterSrc = $matches[3];

            $localPath = $this->downloadImage($originalUrl);

            if ($localPath) {
                // Tạo URL public từ static path
                $newUrl = '/static/' . $localPath;
                return '<img' . $beforeSrc . ' src="' . $newUrl . '"' . $afterSrc . '>';
            }

            // Nếu tải thất bại, giữ nguyên URL gốc
            return $matches[0];
        }, $content);

        return $content;
    }

    /**
     * Viết lại các link nội bộ trỏ đến dongnaiford.com.vn thành link tương đối /[slug].html
     */
    private function rewriteInternalLinks(string $content): string
    {
        // Pattern: https://dongnaiford.com.vn/[slug].html
        $pattern = '/href=["\']https?:\/\/dongnaiford\.com\.vn\/([a-zA-Z0-9\-]+)\.html["\']/'  ;

        $content = preg_replace_callback($pattern, function ($matches) {
            $slug = $matches[1];
            return 'href="/' . $slug . '.html"';
        }, $content);

        // Pattern: https://dongnaiford.com.vn/chuyen-muc/[slug] (link danh mục)
        $content = preg_replace(
            '/href=["\']https?:\/\/dongnaiford\.com\.vn\/chuyen-muc\/([a-zA-Z0-9\-]+)["\']/',
            'href="/tin-tuc"',
            $content
        );

        return $content;
    }

    /**
     * Làm sạch excerpt từ WordPress (bỏ thẻ HTML, bỏ [...], trim)
     */
    private function cleanExcerpt(string $excerpt): string
    {
        $clean = strip_tags($excerpt);
        $clean = preg_replace('/\[.*?\]/', '', $clean);
        $clean = html_entity_decode($clean, ENT_QUOTES, 'UTF-8');
        $clean = trim($clean);
        return $clean;
    }
}
