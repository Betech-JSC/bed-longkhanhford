<?php

namespace JamstackVietnam\Agency;

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
    }

    /**
     * @return void
     */
    protected function publishMigrations()
    {
        if (empty(File::glob(database_path('migrations/*_create_agencies_table.php')))
            && empty(File::glob(database_path('migrations/*_agency_translations_table.php')))
        ) {
            $timestamp = date('Y_m_d_His', time());
            $agency = database_path("migrations/{$timestamp}01_create_agencies_table.php");
            $agencyTranslation = database_path("migrations/{$timestamp}02_create_agency_translations_table.php");

            $this->publishes([
                __DIR__.'/../database/migrations/create_agencies_table.php.stub' => $agency,
                __DIR__.'/../database/migrations/create_agency_translations_table.php.stub' => $agencyTranslation,
            ], 'migrations');
        }

        if (empty(File::glob(database_path('migrations/*_add_region_to_agencies_table.php.php')))
        ) {
            $timestamp = date('Y_m_d_His', time());
            $updateAgency = database_path("migrations/{$timestamp}03_add_region_to_agencies_table.php");

            $this->publishes([
                __DIR__.'/../database/migrations/add_region_to_agencies_table.php.stub' => $updateAgency,
            ], 'migrations');
        }
    }
}
