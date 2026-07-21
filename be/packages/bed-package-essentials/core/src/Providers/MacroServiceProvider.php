<?php

namespace JamstackVietnam\Core\Providers;

use Illuminate\Support\Str;
use Illuminate\Routing\Router;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use JamstackVietnam\Redirect\Models\Redirect;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\ServiceProvider as BaseServiceProvider;

class MacroServiceProvider extends BaseServiceProvider
{
    public function boot()
    {
        $this->registerMacroBlueprint();
        $this->registerMacroRoute();
        $this->registerMacroCollection();
    }

    private function registerMacroBlueprint()
    {
        Blueprint::macro('addTimestamps', function () {
            $this->unsignedBigInteger('created_by')->nullable()->index();
            $this->unsignedBigInteger('updated_by')->nullable()->index();
            $this->unsignedBigInteger('deleted_by')->nullable()->index();

            $this->timestamps();
            $this->softDeletes();
        });

        Blueprint::macro('addInjectCode', function () {
            $this->text('inject_head')->nullable();
            $this->text('inject_body_start')->nullable();
            $this->text('inject_body_end')->nullable();
        });

        Blueprint::macro('addSeo', function () {
            $this->string('seo_meta_title')->nullable();
            $this->string('seo_slug')->nullable();
            $this->text('seo_meta_description')->nullable();
            $this->string('seo_meta_keywords')->nullable();
            $this->string('seo_meta_robots')->nullable();
            $this->string('seo_canonical')->nullable();
            $this->string('seo_image')->nullable();
            $this->text('seo_schemas')->nullable();
        });

        Blueprint::macro('addStatus', function ($default = 'ACTIVE') {
            $this->string('status')->default($default);
        });
    }

    private function registerMacroRoute()
    {
        Router::macro('module', function ($controller, array $options = []) {
            $actions = ['index', 'form', 'store', 'destroy', 'restore', 'duplicate'];

            if (isset($options['only'])) {
                $actions = array_intersect($actions, (array) $options['only']);
            }

            if (isset($options['except'])) {
                $actions = array_diff($actions, (array) $options['except']);
            }

            $resource = Str::plural(Str::kebab((str_replace('Controller', '', class_basename($controller)))));

            if (in_array('index', $actions)) {
                Route::get($resource, "$controller@index")->name("$resource.index");
            }

            if (in_array('form', $actions)) {
                Route::get("$resource/form/{id?}", [$controller, 'form'])->name("$resource.form");
            }

            if (in_array('store', $actions)) {
                Route::post("$resource/store/{id?}", "$controller@store")->name("$resource.store");
            }

            if (in_array('destroy', $actions)) {
                Route::post("$resource/destroy/{id}", "$controller@destroy")->name("$resource.destroy");
            }

            if (in_array('restore', $actions)) {
                Route::post("$resource/restore/{id}", [$controller, 'restore'])->name("$resource.restore");
            }

            if (in_array('duplicate', $actions)) {
                Route::post("$resource/duplicate/{id}", [$controller, 'duplicate'])->name("$resource.duplicate");
            }

            if (isset($options['appends'])) {
                foreach ($options['appends'] as $action) {
                    Route::any("$resource/$action", "$controller@$action")->name("$resource.$action");
                }
            }
        });

        Router::macro('dynamicRedirect', function () {
            try {
                if (Schema::hasTable('redirects')) {
                    Route::name('dynamic-redirect')->group(function () {
                        $redirects = Redirect::active()->get();
                        foreach ($redirects as $redirect) {
                            Route::redirect(
                                $redirect->old_url,
                                $redirect->new_url,
                                $redirect->status_code
                            );
                        }
                    });
                }
            } catch (\Throwable $e) {
                // Fail silently when database is not ready (e.g. during docker build)
            }
        });
    }

    private function registerMacroCollection()
    {
        Collection::macro('paginate', function ($perPage = 20, $total = null, $page = null, $pageName = 'page') {
            $page = $page ?: LengthAwarePaginator::resolveCurrentPage($pageName);

            return new LengthAwarePaginator(
                $this->forPage($page, $perPage),
                $total ?: $this->count(),
                $perPage,
                $page,
                [
                    'path' => LengthAwarePaginator::resolveCurrentPath(),
                    'pageName' => $pageName,
                ]
            );
        });
    }
}
