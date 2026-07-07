<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Vehicle\SalesConsultant;
use JamstackVietnam\Core\Traits\ApiResponse;

class SalesConsultantController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/vehicles/consultants
     * Danh sách cố vấn bán hàng/dịch vụ — có thể filter theo department
     */
    public function index(Request $request): JsonResponse
    {
        $locale = current_locale();

        $query = SalesConsultant::query()
            ->where('status', SalesConsultant::STATUS_ACTIVE)
            ->sortByPosition();

        if ($department = $request->query('department')) {
            $query->where('department', $department);
        }

        $consultants = $query
            ->get()
            ->map(fn($t) => $t->toLocalizedSummary($locale));

        return $this->success($consultants);
    }

    /**
     * GET /api/vehicles/consultants/{slug}
     * Chi tiết cố vấn bán hàng
     */
    public function show(string $slug): JsonResponse
    {
        $locale = current_locale();

        $consultant = SalesConsultant::query()
            ->where('status', SalesConsultant::STATUS_ACTIVE)
            ->whereSlug($slug, $locale)
            ->first();

        if (!$consultant) {
            return $this->failure(__('Không tìm thấy cố vấn bán hàng'), 404);
        }

        return $this->success($consultant->toLocalizedDetail($locale));
    }
}
