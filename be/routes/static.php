<?php

use Illuminate\Support\Facades\Route;
use JamstackVietnam\Core\Controllers\FileController;

// if (!str_contains(config('app.static_url'), config('app.url')) && config('app.url') !== config('app.frontend_url')) {
if (!str_contains(config('app.static_url'), config('app.url'))) {
    Route::domain(to_domain(config('app.static_url')))->get('/', function () {
        abort(404);
    });

    Route::get('static/{path?}', [FileController::class, 'show'])
        ->where('path', '(.*)');

    Route::domain(config('app.static_url'))
        ->get('{path?}', [FileController::class, 'show'])
        ->where('path', '(.*)')
        ->name('files.show');
} else {
    Route::get('static/{path?}', [FileController::class, 'show'])
        ->where('path', '(.*)')
        ->name('files.show');
}
