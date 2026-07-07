### Nested redirects for Laravel

- [Installation](#installation)
- [Usage](#usage)

### Installation

Install the package via Composer:

```
composer require jamstackvietnam/redirects
```

Publish the migration file with:

```
php artisan vendor:publish --provider="JamstackVietnam\Redirect\ServiceProvider" --tag="migrations"
```

After the migration has been published you can create the `redirects` table by running:

```
php artisan migrate
```

### Usage


`routes/frontend.php`
```php
Route::dynamicRedirect();
```
