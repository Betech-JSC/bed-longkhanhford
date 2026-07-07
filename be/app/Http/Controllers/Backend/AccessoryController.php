<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Vehicle\Accessory;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class AccessoryController extends Controller
{
    use HasCrudActions;

    public $model = Accessory::class;

    public $with = [
        'form' => ['translations', 'categories', 'brand', 'vehicles'],
    ];

    /**
     * Admin list: load translations to display title by locale.
     */
    public function index()
    {
        try {
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
                'schema' => $this->getSchema()
            ]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    private function beforeIndex($query)
    {
        return $query
            ->with(['translations', 'categories', 'brand'])
            ->orderBy('id', 'DESC');
    }

    private function beforeStore($request, $rules)
    {
        if ($request->has('brochure_file')) {
            $val = $request->input('brochure_file');
            if (is_string($val)) {
                $decoded = json_decode($val, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $request->merge(['brochure_file' => $decoded]);
                }
            }
        }
        return $rules;
    }
}
