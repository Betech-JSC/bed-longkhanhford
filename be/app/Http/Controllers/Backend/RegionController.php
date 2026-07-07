<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Region;
use App\Traits\HasCrudActions;

class RegionController extends Controller
{
    use HasCrudActions;
    public $model = Region::class;

    private function beforeIndex($query)
    {
        if (!request()->has('search')) {
            return $query->sortByProvincy();
        }
    }
}
