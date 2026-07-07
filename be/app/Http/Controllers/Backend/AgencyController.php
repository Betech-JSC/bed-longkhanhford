<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use JamstackVietnam\Agency\Models\Agency;
use App\Traits\HasCrudActions;

class AgencyController extends Controller
{
    use HasCrudActions;
    public $model = Agency::class;
}
