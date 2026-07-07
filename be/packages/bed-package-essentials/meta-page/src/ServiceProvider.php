<?php

namespace JamstackVietnam\MetaPage;

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

        $this->publishes([
            __DIR__.'/../config/meta-page.php' => config_path('meta-page.php')
        ], 'config');
    }

    /**
     * @return void
     */
    protected function publishMigrations()
    {
        if (empty(File::glob(database_path('migrations/*_create_meta_pages_table.php')))) {
            $timestamp = date('Y_m_d_His', time());
            $migration = database_path("migrations/{$timestamp}_create_meta_pages_table.php");

            $this->publishes([
                __DIR__.'/../database/migrations/create_meta_pages_table.php.stub' => $migration,
            ], 'migrations');
        }
    }
}
