### Nested policy for Laravel

- [Installation](#installation)
- [Usage](#usage)

### Installation

Install the package via Composer:

```
composer require jamstackvietnam/policy
```

Publish the migration file with:

```
php artisan vendor:publish --provider="Jamstackvietnam\Policy\ServiceProvider" --tag="migrations"
```

After the migration has been published you can create the `policies` table by running:

```
php artisan migrate
```

### Usage


`routes/frontend.php`
```php
use JamstackVietnam\Policy\Controllers\PolicyController;

Route::controller(PolicyController::class)->group(function () {
    Route::get(Lang::uri('policies'), 'index')->name('policies.index');
    Route::get(Lang::uri('policies') . '/{slug}', 'show')->name('policies.show');
});
```
