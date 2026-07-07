<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Policy\Policy;
use App\Traits\HasCrudActions;

class PolicyController extends Controller
{
    use HasCrudActions;
    public $model = Policy::class;
}
