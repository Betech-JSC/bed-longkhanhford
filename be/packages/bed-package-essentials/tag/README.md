### Nested tag for Laravel

- [Installation](#installation)
- [Usage](#usage)

### Installation

Install the package via Composer:

```
composer require jamstackvietnam/tag
```

Publish the migration file with:

```
php artisan vendor:publish --provider="Jamstackvietnam\Tag\ServiceProvider" --tag="migrations"
```

After the migration has been published you can create the `tags` table by running:

```
php artisan migrate
```
