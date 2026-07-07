<?php

namespace App\Http\Controllers\Backend;

use App\Models\CmsManual;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class CmsManualController extends Controller
{
    use HasCrudActions;

    public $model = CmsManual::class;

    public function index()
    {
        try {
            $this->checkAuthorize();

            if (request()->wantsJson()) {
                return $this->table();
            }

            $manuals = $this->model::query()
                ->active()
                ->sortByPosition()
                ->get()
                ->map(function ($item) {
                    return $this->transform($item);
                });

            return Inertia::render($this->folder() . '/Index', [
                'breadcrumbs' => [
                    [
                        'url' => route($this->getResource() . '.index'),
                        'name' => 'models.table_list.' . $this->getTable(),
                    ]
                ],
                'manuals' => $manuals,
                'schema' => $this->getSchema()
            ]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}
