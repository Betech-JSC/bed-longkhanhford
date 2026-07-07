<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Frontend\PostController;
use App\Http\Controllers\Frontend\AgencyController;
use App\Http\Controllers\Frontend\HistoryController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\ContactController;
use App\Http\Controllers\Frontend\SitemapController;
use App\Http\Controllers\Frontend\PolicyController;
use App\Http\Controllers\Frontend\ServiceController;
use App\Http\Controllers\Frontend\JobController;
use Inertia\Inertia;

Route::middleware(['meta_seo', 'opening'])->group(function () {
    Route::localized(function () {

        Route::controller(HomeController::class)->group(function () {
            Route::get(Lang::uri('search'), 'search')->name('search');
            Route::get(Lang::uri('search-v2'), 'searchV2')->name('api.search');
            Route::get(Lang::uri('/'), 'index')->name('home');

            Route::get(Lang::uri('/factory'), 'factory')->name('factory.index');
        });

        Route::get(Lang::uri('/contact'), [AgencyController::class, 'index'])->name('contact');

        Route::controller(HistoryController::class)->group(function () {
            Route::get(Lang::uri('about-us'), 'index')->name('histories.index');
            Route::get(Lang::uri('histories') . '/{slug}', 'show')->name('histories.show');
        });

        Route::controller(PostController::class)->group(function () {
            Route::get(Lang::uri('posts'), 'index')->name('posts');
        });

        Route::controller(JobController::class)->group(function () {
            Route::get(Lang::uri('jobs'), 'index')->name('jobs');
            Route::get(Lang::uri('jobs') . '/{slug}', 'show')->name('jobs.show');
        });

        Route::controller(ServiceController::class)->group(function () {
            Route::get(Lang::uri('services'), 'index')->name('services');
            Route::get(Lang::uri('services') . '/{slug}', 'show')->name('services.show');
        });

        Route::post(Lang::uri('contacts'), [ContactController::class, 'store'])->name('contact.store');

        Route::controller(PolicyController::class)->group(function () {
            Route::get(Lang::uri('policies'), 'index')->name('policies.index');
            Route::get(Lang::uri('policies') . '/{slug}', 'show')->name('policies.show');
        });

        Route::get('{slug}', [PostController::class, 'show'])->name('posts.show');
    });
});

Route::dynamicRedirect();
