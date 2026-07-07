<?php

namespace Jamstackvietnam\Job;

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
        if (empty(File::glob(database_path('migrations/*_create_jobs_table.php')))
            && empty(File::glob(database_path('migrations/*_create_job_translations_table.php')))
            && empty(File::glob(database_path('migrations/*_create_related_jobs_table.php')))
            && empty(File::glob(database_path('migrations/*_create_job_ref_tags_table.php')))
        ) {
            $timestamp = date('Y_m_d_His', time());
            $job = database_path("migrations/{$timestamp}01_create_jobs_table.php");
            $jobTranslation = database_path("migrations/{$timestamp}02_create_job_translations_table.php");
            $related = database_path("migrations/{$timestamp}03_create_related_jobs_table.php");
            $jobRefTag = database_path("migrations/{$timestamp}04_create_related_jobs_table.php");

            $this->publishes([
                __DIR__.'/../database/migrations/create_jobs_table.php.stub' => $job,
                __DIR__.'/../database/migrations/create_job_translations_table.php.stub' => $jobTranslation,
                __DIR__.'/../database/migrations/create_related_jobs_table.php.stub' => $related,
                __DIR__.'/../database/migrations/create_job_ref_tags_table.php.stub' => $jobRefTag,
            ], 'migrations');
        }

        if (empty(File::glob(database_path('migrations/*_create_job_options_table.php')))
            && empty(File::glob(database_path('migrations/*_create_job_option_translations_table.php')))
            && empty(File::glob(database_path('migrations/*_create_job_ref_options_table.php')))
        ) {
            $timestamp = date('Y_m_d_His', time());
            $option = database_path("migrations/{$timestamp}04_create_job_options_table.php");
            $optionTranslation = database_path("migrations/{$timestamp}05_create_job_option_translations_table.php");
            $jobRefOption = database_path("migrations/{$timestamp}06_create_job_ref_options_table.php");

            $this->publishes([
                __DIR__.'/../database/migrations/create_job_options_table.php.stub' => $option,
                __DIR__.'/../database/migrations/create_job_option_translations_table.php.stub' => $optionTranslation,
                __DIR__.'/../database/migrations/create_job_ref_options_table.php.stub' => $jobRefOption,
            ], 'option_migrations');
        }
    }
}
