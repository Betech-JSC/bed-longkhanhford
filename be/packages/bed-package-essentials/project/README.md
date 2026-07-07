### Nested project for Laravel

- [Installation](#installation)
- [Usage](#usage)

### Installation

Install the package via Composer:

```
composer require jamstackvietnam/project
```

Publish the migration file with:

```
php artisan vendor:publish --provider="JamstackVietnam\Project\ServiceProvider" --tag="migrations"
```

After the migration has been published you can create the `projects` table by running:

```
php artisan migrate
```
