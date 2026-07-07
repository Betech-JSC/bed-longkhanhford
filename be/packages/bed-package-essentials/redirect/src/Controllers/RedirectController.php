<?php

namespace JamstackVietnam\Redirect\Controllers;

use App\Http\Controllers\Controller;
use JamstackVietnam\Redirect\Models\Redirect;
use JamstackVietnam\Core\Traits\HasCrudActions;
use Inertia\Inertia;
use Illuminate\Support\Str;

class RedirectController extends Controller
{
    use HasCrudActions;

    public $model = Redirect::class;

    private function folder()
    {
        return "@Core/" . Str::studly($this->getTable());
    }

    public function index()
    {
        $this->checkAuthorize();

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
            'setting_bar' => setting_bar(),
            'reload_octane' => (bool) config('octane')
        ]);
    }

    public function form($id = null)
    {
        $this->checkAuthorize();

        $item = $this->model();

        $emptyFields = $this->getEmptyFields();

        $breadcrumbs = [[
            'url' => route($this->getResource() . '.index'),
            'name' => 'models.table_list.' . $this->getTable(),
        ]];

        if (!empty($id)) {
            $item = $this->loadRelations($item);

            if (!is_null($item->getMacro('withTrashed'))) {
                $item = $item->withTrashed();
            }

            $item = $item->findOrFail($id);
            $item = $this->setAppends($item);
            $item = $this->afterForm($item);

            if (!is_array($item)) {
                $item = $item->toArray();
            }

            $item = array_merge($emptyFields, $item);
        } else {
            $item = $this->afterForm($emptyFields);
        }

        if (request()->wantsJson()) {
            return response()->json($item);
        }

        return Inertia::render($this->folder() . '/Form', [
            'item' => $item,
            'breadcrumbs' => $breadcrumbs,
            'schema' => $this->getSchema(),
            'setting_bar' => setting_bar()
        ]);
    }
}
