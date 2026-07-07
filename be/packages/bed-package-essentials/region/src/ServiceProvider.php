<?php

namespace JamstackVietnam\Region;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\File;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class ServiceProvider extends BaseServiceProvider
{
    /**
     * @var Router
     */
    protected $router;

    /**
     * Create a new service provider instance.
     *
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        parent::__construct($app);
    }

    /**
     * Bootstrap the application services.
     *
     * @param Router $router
     * @return void
     */
    public function boot(Router $router)
    {
        $this->router = $router;

        $this->publishMigrations();
        $this->publishSeeders();
    }

    /**
     * @return void
     */
    protected function publishMigrations()
    {
        if (empty(File::glob(database_path('migrations/*_create_regions_table.php')))
        ) {
            $timestamp = date('Y_m_d_His', time());

            $region = database_path("migrations/{$timestamp}_create_regions_table.php");

            $this->publishes([
                __DIR__.'/../database/migrations/create_regions_table.php.stub' => $region,
            ], 'migrations');
        }
    }

    /**
     * @return void
     */
    protected function publishSeeders()
    {
        if (empty(File::glob(database_path('seeders/RegionSeeder.php')))
        ) {
            $region = database_path("seeders/RegionSeeder.php");

            $this->publishes([
                __DIR__.'/../database/seeders/RegionSeeder.php.stub' => $region,
            ], 'seeders');
        }
    }
}
