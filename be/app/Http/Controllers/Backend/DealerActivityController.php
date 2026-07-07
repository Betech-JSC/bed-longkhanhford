<?php

namespace App\Http\Controllers\Backend;

use App\Models\Vehicle\DealerActivity;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class DealerActivityController extends Controller
{
    use HasCrudActions;

    public $model = DealerActivity::class;
}
