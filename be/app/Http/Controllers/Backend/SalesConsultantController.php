<?php

namespace App\Http\Controllers\Backend;

use App\Models\Vehicle\SalesConsultant;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class SalesConsultantController extends Controller
{
    use HasCrudActions;

    public $model = SalesConsultant::class;
}
