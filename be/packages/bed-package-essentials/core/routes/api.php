<?php

use Illuminate\Support\Facades\Route;

if (!str_contains(config('app.api_url'), config('app.url'))) {
    Route::domain(to_domain(config('app.api_url')))->get('/', function () {
        abort(404);
    });

    Route::domain(to_domain(config('app.api_url')))
        ->middleware('api')
        ->group(base_path('routes/api.php'));
} else {
    Route::prefix('api')
        ->middleware('api')
        ->group(base_path('routes/api.php'));
}
