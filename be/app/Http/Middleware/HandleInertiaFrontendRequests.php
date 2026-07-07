<?php

namespace App\Http\Middleware;

use App\Models\Vehicle\VehicleCategory;
use Illuminate\Support\Facades\App;
use Inertia\Middleware;
use Illuminate\Http\Request;
use JamstackVietnam\MetaPage\Models\MetaPage;

class HandleInertiaFrontendRequests extends Middleware
{
    protected $rootView = 'frontend::app';
    protected const FEATURED_POSITION_POST_CATEGORIES = 1;
    protected const MENU_POSITION_POST_CATEGORIES = 2;

    public function share(Request $request)
    {
        $locale = current_locale();
        app()->setLocale($locale);

        try {
            $lotusCategories = VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)
                ->whereLocaleActive()
                ->with(['vehicles' => function ($query) {
                    $query->where('status', 'ACTIVE')->orderBy('sort_order')->with('categories');
                }])
                ->orderBy('sort_order')
                ->get()
                ->map(function ($category) use ($locale) {
                    $arr = $category->toArray();
                    $translation = $category->getTranslation($locale);
                    $arr['title'] = $translation?->title ?? $category->title;
                    $arr['slug'] = $translation?->slug ?? $category->slug;
                    // Map 'vehicles' relation to 'products' key for frontend compatibility
                    $arr['products'] = collect($arr['vehicles'] ?? [])->map(function($v) use ($locale) {
                        return [
                            'id' => $v['id'],
                            'title' => $v['title'],
                            'slug' => $v['slug'],
                            'base_price' => $v['base_price'],
                            'image' => $v['image'],
                            'image_url' => isset($v['image']['path']) ? static_url($v['image']['path']) : null,
                        ];
                    })->toArray();
                    return $arr;
                })
                ->toArray();

            $relativeUrl = str_replace(env('APP_URL'), '',  url()->current());
            $metaPage = cache_response(
                $relativeUrl,
                function () use ($relativeUrl) {
                    return MetaPage::where('url', $relativeUrl ?: '/')->first();
                },
                'meta_pages',
            );


            $global = settings()
                ->group('general')
                ->all();

            if ($request->wantsJson()) {
                return parent::share($request);
            }

            $share = array_merge(parent::share($request), [
                'global' => $global,
                'locale' => [
                    'current' => current_locale(),
                    'default' => config('app.locale'),
                    'list' => config('app.locales'),
                ],
                'route' => [
                    'url' => $request->url(),
                    'path' => $request->path(),
                    'name' => $request->route() ? $request->route()->getName() : null,
                    'query' => $request->query(),
                ],
                'data' => [
                    'lotus_categories' => $lotusCategories,
                ]
            ]);

            if ($metaPage) {
                $share['seo'] = $metaPage;
            }

            return $share;
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}
