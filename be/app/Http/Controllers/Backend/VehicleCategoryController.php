<?php

namespace App\Http\Controllers\Backend;

use App\Models\Vehicle\VehicleCategory;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class VehicleCategoryController extends Controller
{
    use HasCrudActions;

    public $model = VehicleCategory::class;
}
