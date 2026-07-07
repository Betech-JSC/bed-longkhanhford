<?php

namespace App\Http\Controllers\Frontend;

use App\Models\Post\Post;
use App\Models\Post\PostCategory;
use App\Models\Vehicle\Banner;
use Inertia\Inertia;
use Illuminate\Routing\Controller;


class PostController extends Controller
{
    public $model = Post::class;

    public function index()
    {
        try {
            $type = request()->query('type', Post::TYPE_POST);
            $perPage = $type === Post::TYPE_MEDIA ? 3 : 9;
            $posts = Post::query()
                ->where('type', $type)
                ->active()
                ->filter(request()->all())
                ->orderBy('published_at', 'desc')
                ->orderBy('id', 'desc')
                ->paginate($perPage)
                ->onEachSide(0)
                ->through(function ($item) {
                    return $item->transform();
                })
                ->withQueryString();

            $categories = PostCategory::query()
                ->active()
                ->get()
                ->map(fn($item) => $item->transform());

            $topPosts = Post::query()
                ->where('type', Post::TYPE_POST)
                ->active()
                ->orderBy('published_at', 'desc')
                ->orderBy('id', 'desc')
                ->take(4)
                ->get()
                ->map(fn($item) => $item->transform());

            $banners = Banner::query()
                ->where('status', Banner::STATUS_ACTIVE)
                ->whereJsonContains('location', Banner::LOCATION_NEWS)
                ->sortByPosition()
                ->get()
                ->map(fn($b) => [
                    'id'              => $b->id,
                    'title'           => $b->title,
                    'subtitle'        => $b->subtitle,
                    'image_url'       => $b->image_url,
                    'image_mobile_url'=> $b->image_mobile_url,
                    'video_url'       => $b->video_url,
                    'button_text'     => $b->button_text,
                    'button_link'     => $b->button_link,
                ]);

            $data = [
                'categories' => $categories,
                'top_posts'  => $topPosts,
                'posts'      => $posts,
                'banners'    => $banners,
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return Inertia::render('Posts/Index', $data);
        } catch (\Throwable $th) {
            \Log::error('PostController@index: ' . $th->getMessage());
            abort(500);
        }
    }

    public function show($slug)
    {
        try {
            $post = $this->model::query()
                ->where('type', Post::TYPE_POST)
                ->active()
                ->where(function($query) use ($slug) {
                    $query->whereHas('translations', function ($q) use ($slug) {
                        $encodedSlug = rawurlencode($slug);
                        $q->where('slug', $slug)
                          ->orWhere('slug', $encodedSlug)
                          ->orWhere('slug', strtolower($encodedSlug))
                          ->orWhere('seo_slug', $slug)
                          ->orWhere('seo_slug', $encodedSlug)
                          ->orWhere('seo_slug', strtolower($encodedSlug));
                    });
                })
                ->first();

            if (!$post) {
                $activePostIds = $this->model::query()
                    ->where('type', Post::TYPE_POST)
                    ->active()
                    ->pluck('id');

                $translation = \DB::table('post_translations')
                    ->whereIn('post_id', $activePostIds)
                    ->where('locale', current_locale())
                    ->where(function($q) use ($slug) {
                        $encodedSlug = rawurlencode($slug);
                        $q->where('slug', 'like', $slug . '%')
                          ->orWhere('slug', 'like', $encodedSlug . '%')
                          ->orWhere('slug', 'like', strtolower($encodedSlug) . '%')
                          ->orWhere('seo_slug', 'like', $slug . '%')
                          ->orWhere('seo_slug', 'like', $encodedSlug . '%')
                          ->orWhere('seo_slug', 'like', strtolower($encodedSlug) . '%');
                    })
                    ->first();

                if ($translation) {
                    $post = $this->model::query()->find($translation->post_id);
                    if ($post) {
                        $targetSlug = $post->slug;

                        if (request()->wantsJson() || request()->is('api/*')) {
                            return response()->json([
                                'redirect_to' => $targetSlug,
                            ]);
                        }
                        $routeName = current_locale() . '.posts.show';
                        if (\Illuminate\Support\Facades\Route::has($routeName)) {
                            return redirect()->route($routeName, ['slug' => $targetSlug], 301);
                        }
                    }
                }

                abort(404);
            }

            // Nếu slug yêu cầu khác với slug chính thức của bài viết (ví dụ: truy cập qua seo_slug cũ)
            $decodedPostSlug = rawurldecode($post->slug);
            if ($slug !== $post->slug && $slug !== $decodedPostSlug) {
                if (request()->wantsJson() || request()->is('api/*')) {
                    return response()->json([
                        'redirect_to' => $post->slug,
                    ]);
                }
                $routeName = current_locale() . '.posts.show';
                if (\Illuminate\Support\Facades\Route::has($routeName)) {
                    return redirect()->route($routeName, ['slug' => $post->slug], 301);
                }
            }

            $post->increment('view_count');

            $relatedPosts = $post->related();

            $data = [
                'post'          => $post->transformDetails(),
                'related_posts' => $relatedPosts,
                'seo'           => $post->transformSeo(),
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return Inertia::render('Posts/Show', $data)
                ->withViewData(['seo' => $post->transformSeo()]);
        } catch (\Throwable $th) {
            \Log::error('PostController@show: ' . $th->getMessage(), ['slug' => $slug]);
            abort(404);
        }
    }


    public function relatedPosts($postId)
    {
        $post = Post::query()
            ->where('type', Post::TYPE_POST)
            ->setEagerLoads([])
            ->with('relatedPosts', 'categories')
            ->find($postId);

        $items = $post->relatedPosts()
            ->active()
            ->get()
            ->map(fn($item) => $item->transform());

        if ($items->count() == 0) {
            $category = $post->categories
                ->where('status', PostCategory::STATUS_ACTIVE)
                ->values()
                ->first();

            $items = Post::query()
                ->where('type', Post::TYPE_POST)
                ->active()
                ->whereHas('categories', function ($query) use ($category) {
                    $query->where('post_categories.id', $category?->id);
                })
                ->orderByPosition()
                ->orderBy('id', 'desc')
                ->take(8)
                ->get()
                ->map(fn($item) => $item->transform());
        }

        return response()->json([
            'success' => true,
            'data' => $items,
            'message' => 'OK',
        ], 200);
    }
}