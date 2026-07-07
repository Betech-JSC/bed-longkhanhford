<?php

namespace Jamstackvietnam\Policy;

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
        if (empty(File::glob(database_path('migrations/*_create_policies_table.php')))
            && empty(File::glob(database_path('migrations/*_policy_translations_table.php')))
        ) {
            $timestamp = date('Y_m_d_His', time());
            $policy = database_path("migrations/{$timestamp}_create_policies_table.php");
            $policyTranslation = database_path("migrations/{$timestamp}_create_policy_translations_table.php");

            $this->publishes([
                __DIR__.'/../database/migrations/create_policies_table.php.stub' => $policy,
                __DIR__.'/../database/migrations/create_policy_translations_table.php.stub' => $policyTranslation,
            ], 'migrations');
        }
    }
}
