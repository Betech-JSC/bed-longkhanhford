### Nested option for Laravel

- [Installation](#installation)
- [Usage](#usage)

### Installation

Install the package via Composer:

```
composer require jamstackvietnam/option
```

Publish the migration file with:

```
php artisan vendor:publish --provider="JamstackVietnam\Option\ServiceProvider" --tag="migrations"
```

After the migration has been published you can create the `options` table by running:

```
php artisan migrate
```
