<?php

namespace App\Providers;

use App\Models\Sitemap\Sitemap;
use Illuminate\Support\ServiceProvider;

class SitemapServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views/', 'sitemap');
    }

    public function register()
    {
        $this->app->singleton('Sitemap', function () {
            return new Sitemap;
        });
    }
}
