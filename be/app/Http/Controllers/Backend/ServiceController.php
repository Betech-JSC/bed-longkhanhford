<?php

namespace App\Http\Controllers\Backend;

use App\Models\Service;
use Illuminate\Routing\Controller;
use App\Traits\HasCrudActions;

class ServiceController extends Controller
{
    use HasCrudActions;
    public $model = Service::class;
}
