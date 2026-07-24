<?php

namespace App\Traits;

use \Spiritix\LadaCache\Database\LadaCacheTrait;

trait ResponseCache
{
    use LadaCacheTrait;

    public static function bootResponseCache()
    {
        static::saved(function ($model) {
            if (config('cache.default') === 'redis') {
                clear_cache($model->cacheKey($model));
            }
            \Illuminate\Support\Facades\Cache::flush();
        });

        static::deleted(function ($model) {
            if (config('cache.default') === 'redis') {
                clear_cache($model->cacheKey($model));
            }
            \Illuminate\Support\Facades\Cache::flush();
        });
    }

    private function cacheKey($model)
    {
        return [$model->getTable()];
        // return ['cache_response', $model->getTable()];
    }
}
