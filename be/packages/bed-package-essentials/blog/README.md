### Nested blog for Laravel

- [Installation](#installation)
- [Usage](#usage)

### Installation

Install the package via Composer:

```
composer require jamstackvietnam/blog
```

Publish the migration file with:

```
php artisan vendor:publish --provider="JamstackVietnam\Blog\ServiceProvider" --tag="migrations"
```

After the migration has been published you can create db tables by running:

```
php artisan migrate
```

### Usage


`routes/frontend.php`
```php
use JamstackVietnam\Blog\Controllers\PostController;

Route::controller(PostController::class)->group(function () {
    Route::get(Lang::uri('/news'), 'index')->name('posts.index');
    Route::get(Lang::uri('news') . '/{slug}', 'category')->name('posts.category');
    Route::get('/{slug}-b-{id}', 'show')
        ->where('slug', '.*?')
        ->where('id', '\d+')
        ->name('posts.show');
});
```
