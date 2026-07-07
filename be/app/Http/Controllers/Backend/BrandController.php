<?php

namespace App\Http\Controllers\Backend;

use App\Models\Brand\Brand;
use Illuminate\Routing\Controller;
use App\Traits\HasCrudActions;

class BrandController extends Controller
{
    use HasCrudActions;
    public $model = Brand::class;

    private function getTable()
    {
        return 'Products/Brands';
    }
}
