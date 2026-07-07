<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\Vehicle\VehicleCategory;
use JamstackVietnam\Core\Traits\ApiResponse;

class VehicleCategoryController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/vehicles/categories
     */
    public function index(): JsonResponse
    {
        $categories = VehicleCategory::query()
            ->where('status', VehicleCategory::STATUS_ACTIVE)
            ->sortByPosition()
            ->withCount(['vehicles' => function ($query) {
                $query->where('status', 'ACTIVE');
            }])
            ->get()
            ->map(fn($c) => [
                'id'             => $c->id,
                'title'          => $c->title,
                'slug'           => $c->slug,
                'image_url'      => isset($c->image['path']) ? static_url($c->image['path']) : null, 
                'vehicles_count' => $c->vehicles_count,
            ]);

        return $this->success($categories);
    }
}
