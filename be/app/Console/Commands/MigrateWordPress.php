<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Post\Post;
use App\Models\Post\PostCategory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MigrateWordPress extends Command
{
    protected $signature = 'migrate:wordpress
        {--clean : Truncate all posts, translations, and categories first}';

    protected $description = 'Migrate posts, categories, images, and SEO meta from imported WordPress wp_* tables';

    public function handle()
    {
        $this->info('Starting WordPress Local SQL Migration...');

        // 1. Auto-detect WordPress table prefix
        $prefix = null;
        $tables = DB::select('SHOW TABLES');
        
        // Find the database name dynamically
        $dbConnection = config('database.default');
        $dbName = config("database.connections.{$dbConnection}.database");
        $keyName = "Tables_in_{$dbName}";

        foreach ($tables as $t) {
            $tableName = $t->$keyName ?? current((array)$t);
            if (preg_match('/^([a-zA-Z0-9_]*)posts$/', $tableName, $matches)) {
                // Ignore Laravel "posts" or plugin-specific posts
                if ($tableName !== 'posts' && !str_contains($tableName, 'aioseo') && !str_contains($tableName, 'calculated_fields') && !str_contains($tableName, 'assistant')) {
                    $prefix = $matches[1];
                    break;
                }
            }
        }

        if ($prefix === null) {
            $this->error("Could not auto-detect WordPress posts table. Make sure a table ending with 'posts' exists (other than Laravel's 'posts').");
            return Command::FAILURE;
        }

        $this->info("Detected WordPress table prefix: '{$prefix}'");

        $wpPostsTable = "{$prefix}posts";
        $wpPostmetaTable = "{$prefix}postmeta";
        $wpTermsTable = "{$prefix}terms";
        $wpTermTaxTable = "{$prefix}term_taxonomy";
        $wpTermRelTable = "{$prefix}term_relationships";

        $requiredTables = [$wpPostsTable, $wpPostmetaTable, $wpTermsTable, $wpTermTaxTable, $wpTermRelTable];
        foreach ($requiredTables as $table) {
            if (!Schema::hasTable($table)) {
                $this->error("Required WordPress table '{$table}' is missing. Please import the SQL backup first.");
                return Command::FAILURE;
            }
        }

        // 2. Clean up tables if --clean option is passed
        if ($this->option('clean')) {
            $this->warn('Truncating posts and categories tables...');
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            DB::table('post_ref_categories')->truncate();
            DB::table('post_translations')->truncate();
            DB::table('posts')->truncate();
            DB::table('post_category_translations')->truncate();
            DB::table('post_categories')->truncate();
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            $this->info('Tables truncated successfully.');
        }

        // 3. Migrate Categories
        $this->info('Migrating Categories...');
        $wpCategories = DB::table($wpTermsTable)
            ->join($wpTermTaxTable, "{$wpTermsTable}.term_id", '=', "{$wpTermTaxTable}.term_id")
            ->where("{$wpTermTaxTable}.taxonomy", 'category')
            ->select("{$wpTermsTable}.term_id", "{$wpTermsTable}.name", "{$wpTermsTable}.slug")
            ->get();

        $categoryMap = []; // old_term_id => new_category_id
        foreach ($wpCategories as $wpCat) {
            $slug = $wpCat->slug;
            $name = html_entity_decode($wpCat->name, ENT_QUOTES, 'UTF-8');

            // Check if already exists in Laravel (in case of no --clean)
            $existing = PostCategory::whereHas('translations', function ($q) use ($slug) {
                $q->where('slug', $slug);
            })->first();

            if ($existing) {
                $categoryMap[$wpCat->term_id] = $existing->id;
                $this->line("   ✔ Category already exists: {$name} -> Mapping to ID {$existing->id}");
            } else {
                $category = new PostCategory([
                    'status' => 'ACTIVE',
                    'position' => 1,
                ]);
                $category->fill([
                    'vi' => [
                        'title' => $name,
                        'slug' => $slug,
                    ]
                ]);
                $category->save();
                $categoryMap[$wpCat->term_id] = $category->id;
                $this->info("   ✅ Created Category: {$name} (ID: {$category->id})");
            }
        }

        // 4. Migrate Posts
        $this->info('Migrating Posts...');
        $wpPosts = DB::table($wpPostsTable)
            ->where('post_type', 'post')
            ->where('post_status', 'publish')
            ->get();

        $imported = 0;
        $updated = 0;
        $skipped = 0;

        foreach ($wpPosts as $wpPost) {
            $oldSlug = $wpPost->post_name;
            
            // Check if post already exists in Laravel (by checking seo_slug or slug)
            $post = Post::whereHas('translations', function ($q) use ($oldSlug) {
                $q->where('seo_slug', $oldSlug)->orWhere('slug', $oldSlug);
            })->first();

            $isUpdate = ($post !== null);

            // Extract content, excerpt, and dates
            $content = $wpPost->post_content;
            $excerpt = strip_tags($wpPost->post_excerpt ?: Str::limit(strip_tags($content), 160));
            $publishedAt = date('Y-m-d H:i:s', strtotime($wpPost->post_date));

            // Clean content: rewrite image paths
            $content = str_replace('/wp-content/uploads/', '/static/uploads/', $content);
            $content = preg_replace('/\s+srcset="[^"]*"/', '', $content);
            $content = preg_replace('/\s+sizes="[^"]*"/', '', $content);

            // Fetch Yoast SEO / Rank Math metadata
            $seoTitle = null;
            $seoDesc = null;
            $seoKeywords = null;
            $seoRobots = null;
            $seoCanonical = null;
            $seoFocusKeyword = null;
            $seoImage = null;

            $yoastNoIndex = null;
            $yoastNoFollow = null;

            $meta = DB::table($wpPostmetaTable)->where('post_id', $wpPost->ID)->get();
            foreach ($meta as $row) {
                if ($row->meta_key === '_yoast_wpseo_title' || $row->meta_key === 'rank_math_title' || $row->meta_key === '_aioseo_title') {
                    $seoTitle = html_entity_decode(strip_tags($row->meta_value), ENT_QUOTES, 'UTF-8');
                }
                if ($row->meta_key === '_yoast_wpseo_metadesc' || $row->meta_key === 'rank_math_description' || $row->meta_key === '_aioseo_description') {
                    $seoDesc = html_entity_decode(strip_tags($row->meta_value), ENT_QUOTES, 'UTF-8');
                }
                if ($row->meta_key === '_yoast_wpseo_focuskw' || $row->meta_key === 'rank_math_focus_keyword') {
                    $seoFocusKeyword = html_entity_decode(strip_tags($row->meta_value), ENT_QUOTES, 'UTF-8');
                }
                if ($row->meta_key === '_yoast_wpseo_canonical' || $row->meta_key === 'rank_math_canonical') {
                    $seoCanonical = html_entity_decode(strip_tags($row->meta_value), ENT_QUOTES, 'UTF-8');
                }
                if ($row->meta_key === '_yoast_wpseo_metakeywords' || $row->meta_key === '_aioseo_keywords') {
                    $seoKeywords = html_entity_decode(strip_tags($row->meta_value), ENT_QUOTES, 'UTF-8');
                }
                if ($row->meta_key === 'rank_math_robots') {
                    $val = $row->meta_value;
                    if (str_starts_with($val, 'a:')) {
                        try {
                            $unserialized = @unserialize($val);
                            if (is_array($unserialized)) {
                                $seoRobots = implode(', ', $unserialized);
                            }
                        } catch (\Exception $e) {}
                    } else {
                        $seoRobots = $val;
                    }
                }
                if ($row->meta_key === '_yoast_wpseo_meta-robots-noindex') {
                    $yoastNoIndex = (int) $row->meta_value;
                }
                if ($row->meta_key === '_yoast_wpseo_meta-robots-nofollow') {
                    $yoastNoFollow = (int) $row->meta_value;
                }
                if ($row->meta_key === 'rank_math_og_content_image') {
                    $val = $row->meta_value;
                    if (str_starts_with($val, 'a:')) {
                        try {
                            $unserialized = @unserialize($val);
                            if (is_array($unserialized) && isset($unserialized['images'][0])) {
                                $attachmentId = (int) $unserialized['images'][0];
                                $attachmentPost = DB::table($wpPostsTable)
                                    ->where('ID', $attachmentId)
                                    ->where('post_type', 'attachment')
                                    ->first();
                                if ($attachmentPost) {
                                    $guid = $attachmentPost->guid;
                                    $pathParts = explode('/wp-content/uploads/', $guid);
                                    $relativePath = isset($pathParts[1]) ? 'uploads/posts/' . $pathParts[1] : null;
                                    if ($relativePath) {
                                        $seoImage = $relativePath;
                                    }
                                }
                            }
                        } catch (\Exception $e) {}
                    }
                }
                if ($row->meta_key === '_yoast_wpseo_opengraph-image' || $row->meta_key === '_yoast_wpseo_twitter-image') {
                    $url = $row->meta_value;
                    $pathParts = explode('/wp-content/uploads/', $url);
                    $relativePath = isset($pathParts[1]) ? 'uploads/posts/' . $pathParts[1] : null;
                    if ($relativePath) {
                        $seoImage = $relativePath;
                    }
                }
            }

            // Consolidate Yoast Robots
            if ($yoastNoIndex !== null || $yoastNoFollow !== null) {
                $robotsList = [];
                $robotsList[] = ($yoastNoIndex === 1) ? 'noindex' : 'index';
                $robotsList[] = ($yoastNoFollow === 1) ? 'nofollow' : 'follow';
                $seoRobots = implode(', ', $robotsList);
            }

            // Try to resolve featured image (thumbnail)
            $imageData = null;
            $thumbnailId = DB::table($wpPostmetaTable)
                ->where('post_id', $wpPost->ID)
                ->where('meta_key', '_thumbnail_id')
                ->value('meta_value');

            if ($thumbnailId) {
                $thumbnailPost = DB::table($wpPostsTable)
                    ->where('ID', $thumbnailId)
                    ->where('post_type', 'attachment')
                    ->first();

                if ($thumbnailPost) {
                    // Extract relative path from guid (e.g. http://domain.com/wp-content/uploads/2022/10/image.jpg)
                    $guid = $thumbnailPost->guid;
                    $pathParts = explode('/wp-content/uploads/', $guid);
                    $relativePath = isset($pathParts[1]) ? 'uploads/' . $pathParts[1] : null;

                    if ($relativePath) {
                        $imageData = [
                            'path' => $relativePath,
                            'alt' => $wpPost->post_title,
                        ];
                    }
                }
            }

            // Generate clean canonical slug
            $title = html_entity_decode(strip_tags($wpPost->post_title), ENT_QUOTES, 'UTF-8');
            $newSlug = Str::slug($title);

            // Create or update Laravel Post
            try {
                DB::transaction(function () use (
                    $post,
                    $isUpdate,
                    $wpPost,
                    $title,
                    $newSlug,
                    $oldSlug,
                    $excerpt,
                    $content,
                    $publishedAt,
                    $imageData,
                    $seoTitle,
                    $seoDesc,
                    $seoKeywords,
                    $seoRobots,
                    $seoCanonical,
                    $seoFocusKeyword,
                    $seoImage,
                    $categoryMap,
                    $wpTermRelTable,
                    $wpTermTaxTable,
                    &$imported,
                    &$updated
                ) {
                    if (!$isUpdate) {
                        $post = new Post([
                            'image' => $imageData,
                            'published_at' => $publishedAt,
                            'is_featured' => false,
                            'is_home' => false,
                            'type' => Post::TYPE_POST,
                            'status' => Post::STATUS_ACTIVE,
                        ]);
                    } else {
                        if (!$post->image && $imageData) {
                            $post->image = $imageData;
                        } elseif ($post->image) {
                            $image = $post->image;
                            if (isset($image['path']) && str_starts_with($image['path'], 'uploads/') && !str_starts_with($image['path'], 'uploads/posts/')) {
                                $image['path'] = str_replace('uploads/', 'uploads/posts/', $image['path']);
                                $post->image = $image;
                            }
                        }
                    }

                    $viTrans = $isUpdate ? $post->translate('vi') : null;

                    $post->fill([
                        'vi' => [
                            'title' => $viTrans ? ($viTrans->title ?: $title) : $title,
                            'slug' => $viTrans ? ($viTrans->slug ?: $newSlug) : $newSlug,
                            'description' => $viTrans ? ($viTrans->description ?: $excerpt) : $excerpt,
                            'content' => $viTrans ? ($viTrans->content ?: $content) : $content,
                            'seo_meta_title' => Str::limit($seoTitle ?: ($viTrans ? $viTrans->title : $title), 60),
                            'seo_slug' => $oldSlug,
                            'seo_meta_description' => Str::limit($seoDesc ?: ($viTrans ? $viTrans->description : $excerpt), 160),
                            'seo_meta_keywords' => $seoKeywords,
                            'seo_meta_robots' => $seoRobots,
                            'seo_canonical' => $seoCanonical,
                            'seo_focus_keyword' => $seoFocusKeyword,
                            'seo_image' => $seoImage,
                        ]
                    ]);

                    $post->save();

                    if (!$isUpdate) {
                        // Attach Categories
                        $termTaxIds = DB::table($wpTermRelTable)
                            ->where('object_id', $wpPost->ID)
                            ->pluck('term_taxonomy_id');

                        $terms = DB::table($wpTermTaxTable)
                            ->whereIn('term_taxonomy_id', $termTaxIds)
                            ->where('taxonomy', 'category')
                            ->pluck('term_id');

                        $laravelCatIds = [];
                        foreach ($terms as $termId) {
                            if (isset($categoryMap[$termId])) {
                                $laravelCatIds[] = $categoryMap[$termId];
                            }
                        }

                        if (!empty($laravelCatIds)) {
                            $post->categories()->sync($laravelCatIds);
                        }

                        $imported++;
                    } else {
                        $updated++;
                    }
                });
                
                if ($isUpdate) {
                    $this->info("   ✅ Updated SEO meta for post: {$title}");
                } else {
                    $this->info("   ✅ Imported new post: {$title}");
                }

            } catch (\Exception $e) {
                $this->error("   ❌ Lỗi import bài viết '{$title}': " . $e->getMessage());
            }
        }

        $this->info("");
        $this->info("═══════════════════════════════════════════════════════");
        $this->info("Migration completed! Imported new: {$imported}, Updated existing: {$updated}, Skipped: {$skipped}");
        $this->info("To clean up WordPress tables, run:");
        $this->warn("DROP TABLE {$prefix}posts, {$prefix}postmeta, {$prefix}terms, {$prefix}term_taxonomy, {$prefix}term_relationships, {$prefix}commentmeta, {$prefix}comments, {$prefix}links, {$prefix}options, {$prefix}termmeta, {$prefix}users, {$prefix}usermeta;");
        $this->info("═══════════════════════════════════════════════════════");

        return Command::SUCCESS;
    }
}
