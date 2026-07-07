<?php

namespace JamstackVietnam\Core\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $mainPath = database_path('migrations');
        $paths = array_merge([$mainPath], glob($mainPath . '/*' , GLOB_ONLYDIR));

        $this->loadMigrationsFrom($paths);
    }
}
