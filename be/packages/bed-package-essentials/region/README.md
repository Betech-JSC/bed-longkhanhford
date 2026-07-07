### Nested region for Laravel

- [Installation](#installation)
- [Usage](#usage)

### Installation

Install the package via Composer:

```
composer require jamstackvietnam/region
```

Publish the migration file with:

```
php artisan vendor:publish --provider="JamstackVietnam\Region\ServiceProvider" --tag="migrations"
```


Publish the seeder file with:

```
php artisan vendor:publish --provider="JamstackVietnam\Region\ServiceProvider" --tag="seeders"
```

After the migration has been published you can create the `regions` table by running:

```
php artisan migrate
```

After create the `regions` table by running:

```
php artisan db:Seed --class=RegionSeeder
```
