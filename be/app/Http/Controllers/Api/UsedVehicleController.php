<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\UsedVehicle\UsedVehicle;
use JamstackVietnam\Core\Traits\ApiResponse;

class UsedVehicleController extends Controller
{
    use ApiResponse;

    /**
     * Map used vehicle to standard format
     */
    private function formatList(UsedVehicle $v): array
    {
        return [
            'id'             => $v->id,
            'title'          => $v->title,
            'slug'           => $v->slug,
            'tagline'        => $v->tagline,
            'price'          => (float) $v->price,
            'year'           => $v->year,
            'odo'            => $v->odo,
            'image_url'      => $v->image_url,
            'images_urls'    => $v->images_urls,
            'sort_order'     => $v->sort_order,
            'status'         => $v->status,
        ];
    }

    /**
     * GET /api/used-vehicles
     */
    public function index(Request $request): JsonResponse
    {
        $query = UsedVehicle::query()
            ->active()
            ->sortByPosition();

        if ($keyword = $request->query('keyword')) {
            $query->whereHas('translations', function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('tagline', 'like', "%{$keyword}%");
            });
        }

        if ($priceMax = $request->query('price_max')) {
            $query->where('price', '<=', (float) $priceMax);
        }

        if ($priceMin = $request->query('price_min')) {
            $query->where('price', '>=', (float) $priceMin);
        }

        $vehicles = $query->get()
            ->map(fn($v) => $this->formatList($v));

        return $this->success($vehicles);
    }

    /**
     * GET /api/used-vehicles/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $vehicle = UsedVehicle::query()
            ->active()
            ->whereSlug($slug)
            ->first();

        if (!$vehicle) {
            return $this->failure(__('Không tìm thấy xe đã qua sử dụng'), 404);
        }

        return $this->success([
            'id'             => $vehicle->id,
            'title'          => $vehicle->title,
            'slug'           => $vehicle->slug,
            'tagline'        => $vehicle->tagline,
            'description'    => $vehicle->description, // Rich text content
            'price'          => (float) $vehicle->price,
            'year'           => $vehicle->year,
            'odo'            => $vehicle->odo,
            'image_url'      => $vehicle->image_url,
            'images_urls'    => $vehicle->images_urls,
            'sort_order'     => $vehicle->sort_order,
            'seo'            => $vehicle->transformSeo(),
        ]);
    }
}
