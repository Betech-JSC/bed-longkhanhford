<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\MaintenanceSchedule;
use JamstackVietnam\Core\Traits\ApiResponse;

class MaintenanceScheduleController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/maintenance-schedules
     */
    public function index(): JsonResponse
    {
        $schedules = MaintenanceSchedule::query()
            ->where('status', MaintenanceSchedule::STATUS_ACTIVE)
            ->sortByPosition()
            ->get()
            ->map(fn($item) => [
                'id'        => $item->id,
                'name'      => $item->title,
                'image'     => $item->image_url,
                'links'     => $item->links ?? [],
            ]);

        return $this->success($schedules);
    }
}
