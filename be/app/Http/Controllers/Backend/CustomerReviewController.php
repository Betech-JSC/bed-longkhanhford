<?php

namespace App\Http\Controllers\Backend;

use App\Models\Vehicle\CustomerReview;
use App\Models\Vehicle\Vehicle;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class CustomerReviewController extends Controller
{
    use HasCrudActions;

    public $model = CustomerReview::class;

    private function beforeIndex($query)
    {
        return $query
            ->with('translations')
            ->orderBy('id', 'DESC');
    }

    private function beforeForm($data)
    {
        $data['products'] = Vehicle::withoutGlobalScopes()
            ->where('status', Vehicle::STATUS_ACTIVE)
            ->with('translations')
            ->orderBy('sort_order')
            ->get()
            ->map(fn($p) => ['id' => $p->id, 'title' => $p->title]);

        return $data;
    }
}
