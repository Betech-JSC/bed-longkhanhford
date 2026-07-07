<?php

namespace JamstackVietnam\MetaPage\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use JamstackVietnam\Sitemap\Sitemap;
use JamstackVietnam\MetaPage\Models\MetaPage;
use JamstackVietnam\Core\Traits\HasCrudActions;

class MetaPageController extends Controller
{
    use HasCrudActions;

    public $model = MetaPage::class;

    private function folder()
    {
        return "@Core/" . Str::studly($this->getTable());
    }

    public function index()
    {
        $this->checkAuthorize(__FUNCTION__);

        if (request()->wantsJson()) {
            return $this->table();
        }

        return Inertia::render($this->folder() . '/Index', [
            'breadcrumbs' => [
                [
                    'url' => route($this->getResource() . '.index'),
                    'name' => 'models.table_list.' . $this->getTable(),
                ]
            ],
            'schema' => $this->getSchema(),
            'can_created' => config('meta-page.can_created'),
            'setting_bar' => setting_bar()
        ]);
    }

    public function afterForm($item)
    {
        $item['can_created'] = config('meta-page.can_created');
        return $item;
    }

    public function beforeIndex($query)
    {
        if (!config('meta-page.can_created')) {
            $storedRoutes = MetaPage::pluck('url');
            $routes = collect(Sitemap::create()->addStaticRoutes()->tags)
                ->transform(fn ($item) => str_replace(env('APP_URL'), '', $item['url']) ?: '/')
                ->prepend('/');

            $diff = $routes->diff($storedRoutes);

            if ($diff->count()) {
                MetaPage::insert($diff->transform(fn ($item) => ['url' => $item])->toArray());
            }
        }

        return $query->orderBy('url', 'ASC');
    }

    private function transform($item)
    {
        return [
            ...$item->toArray(),
            'url' => env('APP_URL') . $item['url']
        ];
    }
}
