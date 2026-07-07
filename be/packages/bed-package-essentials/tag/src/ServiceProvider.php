<?php

namespace Jamstackvietnam\Tag;

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
        if (empty(File::glob(database_path('migrations/*_create_tags_table.php')))
            && empty(File::glob(database_path('migrations/*_tag_translations_table.php')))
        ) {
            $timestamp = date('Y_m_d_His', time());
            $tag = database_path("migrations/{$timestamp}01_create_tags_table.php");
            $tagTranslation = database_path("migrations/{$timestamp}02_create_tag_translations_table.php");

            $this->publishes([
                __DIR__.'/../database/migrations/create_tags_table.php.stub' => $tag,
                __DIR__.'/../database/migrations/create_tag_translations_table.php.stub' => $tagTranslation,
            ], 'migrations');
        }
    }
}
