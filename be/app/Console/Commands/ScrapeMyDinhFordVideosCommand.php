<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post\Post;
use App\Models\Post\PostCategory;
use Illuminate\Support\Str;

class ScrapeMyDinhFordVideosCommand extends Command
{
    protected $signature = 'scrape:mydinhford-videos';
    protected $description = 'Scrape TikTok videos from My Dinh Ford website and insert into database';

    public function handle()
    {
        $this->info('Starting TikTok video scraper from My Dinh Ford...');

        // 1. Lấy hoặc tạo Category Thư viện Media (ID 5 hoặc slug 'media-library')
        $category = PostCategory::whereHas('translations', function ($q) {
            $q->where('slug', 'media-library')->orWhere('slug', 'thu-vien-media');
        })->first();

        if (!$category) {
            $category = new PostCategory(['status' => 'ACTIVE', 'position' => 5]);
            $category->fill([
                'vi' => ['title' => 'Thư viện Media', 'slug' => 'thu-vien-media'],
                'en' => ['title' => 'Media Library', 'slug' => 'media-library']
            ]);
            $category->save();
            $this->info('Created new Thư viện Media category.');
        }

        // Danh sách các video lấy từ DOM mydinhford.com.vn/thu-vien-video
        $videoLinks = [
            'https://www.tiktok.com/@mydinhford_official2/video/7550630312171080968',
            'https://www.tiktok.com/@mydinhford_official2/video/7550571481315413256',
            'https://www.tiktok.com/@mydinhford_official2/photo/7550257991279217940',
            'https://www.tiktok.com/@mydinhford_official2/video/7550167016435436808'
        ];

        // Dữ liệu video mẫu dựa trên phân tích hình ảnh thực tế từ URL
        $scrapedVideos = [
            [
                'title' => 'FORD RANGER RAPTOR - ÔNG VUA ĐỊA HÌNH',
                'url' => 'https://www.tiktok.com/@mydinhford_official2/video/7550630312171080968',
                'description' => 'Địa hình càng khắc nghiệt, Raptor càng toả sáng ✨ #hathanhauto #ht #fordrangerraptor'
            ],
            [
                'title' => 'FORD RANGER XLS AT 4X2',
                'url' => 'https://www.tiktok.com/@mydinhford_official2/video/7550571481315413256',
                'description' => 'Ford Ranger XLS AT – chiếc bán tải đáng tin cậy cho mọi hành trình #hathanhauto #hta #fordrangerxls'
            ],
            [
                'title' => 'CẬP NHẬT BẢNG GIÁ FORD TERRITORY 2025 MỚI NHẤT',
                'url' => 'https://www.tiktok.com/@mydinhford_official2/photo/7550257991279217940',
                'description' => 'Cập nhật bảng giá Ford Territory 2025 mới nhất 🔥🔥 #hathanhauto #hta #fordterritory'
            ],
            [
                'title' => 'FORD EVEREST TITANIUM',
                'url' => 'https://www.tiktok.com/@mydinhford_official2/video/7550167016435436808',
                'description' => 'FORD EVEREST TITANIUM | ĐẾN #hathanhauto #hta #MyDinhFord #fordeverest'
            ]
        ];

        $count = 0;
        foreach ($scrapedVideos as $videoData) {
            $slug = Str::slug($videoData['title']);

            // Tránh chèn trùng lặp bài viết
            $exists = Post::whereHas('translations', function ($q) use ($slug) {
                $q->where('slug', $slug);
            })->exists();

            if ($exists) {
                $this->info("Skipped (already exists): {$videoData['title']}");
                continue;
            }

            $post = new Post([
                'image' => ['path' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'], // default thumbnail placeholder
                'published_at' => now(),
                'is_featured' => false,
                'type' => 'MEDIA',
                'status' => 'ACTIVE',
            ]);

            $post->fill([
                'vi' => [
                    'title' => $videoData['title'],
                    'slug' => $slug,
                    'author' => $videoData['url'], // Nhập link TikTok vào trường Author để FE tự động bóc tách ID
                    'description' => $videoData['description'],
                    'content' => '<p>' . e($videoData['description']) . '</p>'
                ]
            ]);

            $post->save();

            // Link to category
            $post->categories()->attach($category->id);
            $count++;
            $this->info("Successfully created video post: {$videoData['title']}");
        }

        $this->info("Finished! Inserted {$count} new TikTok video posts into the database.");
    }
}
