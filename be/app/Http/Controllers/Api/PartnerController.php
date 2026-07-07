<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\Vehicle\Partner;
use JamstackVietnam\Core\Traits\ApiResponse;

class PartnerController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/vehicles/sponsors
     */
    public function index(): JsonResponse
    {
        $partners = Partner::query()
            ->where('status', Partner::STATUS_ACTIVE)
            ->sortByPosition()
            ->get(['id', 'name', 'logo', 'link'])
            ->map(fn($s) => [
                'id'       => $s->id,
                'name'     => $s->name,
                'logo_url' => $s->logo_url,
                'link'     => $s->link,
            ]);

        return $this->success($partners);
    }
}
