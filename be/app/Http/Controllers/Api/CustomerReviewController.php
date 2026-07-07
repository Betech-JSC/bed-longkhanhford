<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Vehicle\CustomerReview;
use JamstackVietnam\Core\Traits\ApiResponse;

class CustomerReviewController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/vehicles/reviews
     * GET /api/vehicles/reviews?vehicle_id=1
     */
    public function index(Request $request): JsonResponse
    {
        $query = CustomerReview::query()
            ->where('status', CustomerReview::STATUS_ACTIVE)
            ->sortByPosition();

        if ($vehicleId = $request->query('vehicle_id')) {
            $query->where('vehicle_id', $vehicleId);
        }

        $reviews = $query->get()->map(fn($r) => $r->transform());

        return $this->success($reviews);
    }
}
