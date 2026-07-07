<?php

namespace App\Http\Middleware;

use Inertia\Inertia;
use App\Models\Config;
use Closure;
use JamstackVietnam\MetaPage\Models\MetaPage;

class Opening
{
    public function handle($request, Closure $next)
    {
        if (!Config::available()) {
            $metaData = MetaPage::where('url', '/closed')->first()?->transform();
            return Inertia::render('Closed')
                ->withViewData(['seo' => $metaData]);
        }

        return $next($request);
    }
}
