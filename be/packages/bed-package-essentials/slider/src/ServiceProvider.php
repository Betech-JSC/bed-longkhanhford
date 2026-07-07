<?php

namespace JamstackVietnam\Slider;

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
            __DIR__.'/../config/slider.php' => config_path('slider.php')
        ], 'config');
    }

    /**
     * @return void
     */
    protected function publishMigrations()
    {
        if (empty(File::glob(database_path('migrations/*_create_sliders_table.php')))
            && empty(File::glob(database_path('migrations/*_create_slider_translations_table.php')))
        ) {
            $timestamp = date('Y_m_d_Hi', time());
            $slider = database_path("migrations/{$timestamp}01_create_sliders_table.php");
            $sliderTranslation = database_path("migrations/{$timestamp}02_create_slider_translations_table.php");

            $this->publishes([
                __DIR__.'/../database/migrations/create_sliders_table.php.stub' => $slider,
                __DIR__.'/../database/migrations/create_slider_translations_table.php.stub' => $sliderTranslation,
            ], 'migrations');
        }
    }
}
