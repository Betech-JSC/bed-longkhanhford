<?php

namespace App\Http\Middleware;

use Closure;
use JamstackVietnam\MetaPage\Models\MetaPage;
use Illuminate\Contracts\View\Factory as ViewFactory;

class MetaSeo
{
    protected $viewFactory;

    public function __construct(ViewFactory $viewFactory)
    {
        $this->viewFactory = $viewFactory;
    }
    public function handle($request, Closure $next)
    {
        $relativeUrl = $request->path() != '/' ? '/' . $request->path() : $request->path();

        $metaPage = cache_response(
            $relativeUrl,
            function () use ($relativeUrl) {
                return MetaPage::where('url', $relativeUrl ?: '/')->first();
            },
            'meta_pages',
        );

        if ($metaPage) {
            $this->viewFactory->share('seo', $metaPage);
        }

        return $next($request);
    }
}
