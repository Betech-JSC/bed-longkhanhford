<?php

namespace App\Http\Controllers\Backend;

use App\Models\Vehicle\Partner;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class PartnerController extends Controller
{
    use HasCrudActions;

    public $model = Partner::class;
}
