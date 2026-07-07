<?php

namespace App\Http\Controllers\Backend;

use App\Models\Vehicle\Award;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class AwardController extends Controller
{
    use HasCrudActions;

    public $model = Award::class;
}
