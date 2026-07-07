<?php

namespace App\Http\Controllers\Backend;

use App\Models\CustomerHandover;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class CustomerHandoverController extends Controller
{
    use HasCrudActions;

    public $model = CustomerHandover::class;
}
