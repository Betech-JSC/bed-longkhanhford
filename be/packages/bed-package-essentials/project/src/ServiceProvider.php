<?php

namespace JamstackVietnam\Project;

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
        if (
            empty(File::glob(database_path('migrations/*_create_projects_table.php')))
            && empty(File::glob(database_path('migrations/*_create_project_translations_table.php')))
            && empty(File::glob(database_path('migrations/*_create_project_categories_table.php')))
            && empty(File::glob(database_path('migrations/*_create_project_category_translations_table.php')))
            && empty(File::glob(database_path('migrations/*_create_related_projects_table.php')))
            && empty(File::glob(database_path('migrations/*_create_project_ref_categories_table.php')))
        ) {
            $timestamp = date('Y_m_d_His', time());
            $project = database_path("migrations/project/{$timestamp}01_create_projects_table.php");
            $projectTranslation = database_path("migrations/project/{$timestamp}02_create_project_translations_table.php");
            $projectCategory = database_path("migrations/project/{$timestamp}03_create_project_categories_table.php");
            $projectCategoryTranslation = database_path("migrations/project/{$timestamp}04_create_project_category_translations_table.php");
            $relatedProject = database_path("migrations/project/{$timestamp}05_create_related_projects_table.php");
            $projectRefCategory = database_path("migrations/project/{$timestamp}06_create_project_ref_categories_table.php");

            $this->publishes([
                __DIR__.'/../database/migrations/create_projects_table.php.stub' => $project,
                __DIR__.'/../database/migrations/create_project_translations_table.php.stub' => $projectTranslation,
                __DIR__.'/../database/migrations/create_project_categories_table.php.stub' => $projectCategory,
                __DIR__.'/../database/migrations/create_project_category_translations_table.php.stub' => $projectCategoryTranslation,
                __DIR__.'/../database/migrations/create_related_projects_table.php.stub' => $relatedProject,
                __DIR__.'/../database/migrations/create_project_ref_categories_table.php.stub' => $projectRefCategory,
            ], 'migrations');
        }
    }
}
