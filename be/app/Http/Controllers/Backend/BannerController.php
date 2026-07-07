<?php

namespace App\Http\Controllers\Backend;

use App\Models\Vehicle\Banner;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class BannerController extends Controller
{
    use HasCrudActions;

    public $model = Banner::class;
}
