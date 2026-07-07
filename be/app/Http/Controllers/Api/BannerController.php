<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Vehicle\Banner;
use JamstackVietnam\Core\Traits\ApiResponse;

class BannerController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/vehicles/banners
     * GET /api/vehicles/banners?location=homepage
     */
    public function index(Request $request): JsonResponse
    {
        $query = Banner::query()
            ->where('status', Banner::STATUS_ACTIVE)
            ->sortByPosition();

        if ($location = $request->query('location')) {
            $query->whereJsonContains('location', $location);
        }

        $banners = $query->get(['id', 'title', 'subtitle', 'image', 'image_mobile', 'video', 'location', 'button_text', 'button_link'])
            ->map(function ($b) {
                return [
                    'id'               => $b->id,
                    'title'            => $b->title,
                    'subtitle'         => $b->subtitle,
                    'image_url'        => $b->image_url,
                    'image_mobile_url' => $b->image_mobile_url,
                    'video_url'        => $b->video_url,
                    'location'         => $b->location ?? [],
                    'button_text'      => $b->button_text,
                    'button_link'      => $b->button_link,
                ];
            });

        return $this->success($banners);
    }
}
