### Nested job for Laravel

- [Installation](#installation)
- [Usage](#usage)

### Installation

Install the package via Composer:

```
composer require jamstackvietnam/job
```

Publish the migration file with:

```
php artisan vendor:publish --provider="Jamstackvietnam\Job\ServiceProvider" --tag="migrations"
```

```
php artisan vendor:publish --provider="Jamstackvietnam\Job\ServiceProvider" --tag="option_migrations"
```

After the migration has been published you can create the `jobs` table by running:

```
php artisan migrate
```
