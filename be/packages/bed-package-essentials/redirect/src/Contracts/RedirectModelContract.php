<?php

namespace JamstackVietnam\Redirect\Contracts;

interface RedirectModelContract
{
    /**
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $url
     * @return mixed
     */
    public function scopeWhereOldUrl($query, string $url);

    /**
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $url
     * @return mixed
     */
    public function scopeWhereNewUrl($query, string $url);

    /**
     * @return array
     */
    public static function getStatuses(): array;

    /**
     * @param RedirectModelContract $model
     * @param string $finalUrl
     * @return void
     */
    public function syncOldRedirects(self $model, string $finalUrl): void;

    /**
     * @param string $path
     * @return RedirectModelContract|null
     */
    public static function findValidOrNull($path): ?self;
}
