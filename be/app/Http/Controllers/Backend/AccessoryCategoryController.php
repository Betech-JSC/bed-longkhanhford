<?php

namespace App\Http\Controllers\Backend;

use App\Models\Vehicle\AccessoryCategory;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class AccessoryCategoryController extends Controller
{
    use HasCrudActions;

    public $model = AccessoryCategory::class;

    public $with = [
        'form' => ['translations'],
    ];

    private function beforeIndex($query)
    {
        return $query
            ->with(['translations'])
            ->orderBy('id', 'DESC');
    }
}
