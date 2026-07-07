### Nested agency for Laravel

- [Installation](#installation)
- [Usage](#usage)

### Installation

Install the package via Composer:

```
composer require jamstackvietnam/agency
```

Publish the migration file with:

```
php artisan vendor:publish --provider="JamstackVietnam\Agency\ServiceProvider" --tag="migrations"
```

After the migration has been published you can create the `agencies` table by running:

```
php artisan migrate
```
