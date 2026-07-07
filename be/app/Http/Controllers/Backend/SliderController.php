<?php

namespace App\Http\Controllers\Backend;

use App\Models\Slider\Slider;
use Illuminate\Routing\Controller;
use App\Traits\HasCrudActions;

class SliderController extends Controller
{
    use HasCrudActions;
    public $model = Slider::class;

    private function beforeIndex($query)
    {
        if (request()->has('filters.position') && request()->input('filters.position') != 'ALL') {
            $query->where('position_display', request()->input('filters.position'));
        }
        return $query;
    }
}
