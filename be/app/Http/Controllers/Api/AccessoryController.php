<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Vehicle\Accessory;
use App\Models\Vehicle\AccessoryCategory;
use JamstackVietnam\Core\Traits\ApiResponse;

class AccessoryController extends Controller
{
    use ApiResponse;

    /**
     * GET /api/accessories/categories
     */
    /**
     * GET /api/accessories/categories
     */
    public function categories(Request $request): JsonResponse
    {
        $categories = \Illuminate\Support\Facades\Cache::remember('api_accessories_categories', 3600, function() {
            return AccessoryCategory::query()
                ->where('status', 'ACTIVE')
                ->sortByPosition()
                ->get()
                ->map(function ($cat) {
                    return [
                        'id' => $cat->id,
                        'title' => $cat->title,
                        'slug' => $cat->slug,
                        'image_url' => $cat->image_url,
                    ];
                })
                ->toArray();
        });

        return $this->success($categories);
    }

    /**
     * GET /api/accessories
     */
    public function index(Request $request): JsonResponse
    {
        $cacheKey = 'api_accessories_index_' . md5(json_encode($request->all()));

        $accessories = \Illuminate\Support\Facades\Cache::remember($cacheKey, 3600, function() use ($request) {
            $query = Accessory::query()
                ->where('status', 'ACTIVE')
                ->with(['translations', 'categories', 'brand', 'vehicles', 'vehicles.translations'])
                ->sortByPosition();

            // Filter by category (supports: interior, exterior, tech, wheels, performance, or category ID, or slug)
            if ($category = $request->query('category')) {
                $categoryKeys = [
                    'interior' => 1,
                    'exterior' => 2,
                    'tech' => 3,
                    'wheels' => 4,
                    'performance' => 5,
                ];

                if (isset($categoryKeys[$category])) {
                    $categoryId = $categoryKeys[$category];
                    $query->whereHas('categories', function ($q) use ($categoryId) {
                        $q->where('accessory_categories.id', $categoryId);
                    });
                } elseif (is_numeric($category)) {
                    $query->whereHas('categories', function ($q) use ($category) {
                        $q->where('accessory_categories.id', $category);
                    });
                } else {
                    $query->whereHas('categories', function ($q) use ($category) {
                        $q->whereHas('translations', function ($t) use ($category) {
                            $t->where('slug', $category)->orWhere('seo_slug', $category);
                        });
                    });
                }
            }

            // Search by keyword
            if ($search = $request->query('q')) {
                $query->whereHas('translations', function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Filter by vehicle ID or slug compatibility (Many-to-Many)
            if ($vehicle = $request->query('vehicle')) {
                $query->whereHas('vehicles', function ($q) use ($vehicle) {
                    if (is_numeric($vehicle)) {
                        $q->where('vehicles.id', $vehicle);
                    } else {
                        $q->whereHas('translations', function ($t) use ($vehicle) {
                            $t->where('slug', $vehicle)->orWhere('seo_slug', $vehicle);
                        });
                    }
                });
            }

            // Filter by brand ID or slug
            if ($brand = $request->query('brand')) {
                if (is_numeric($brand)) {
                    $query->where('brand_id', $brand);
                } else {
                    $query->whereHas('brand', function ($q) use ($brand) {
                        $q->whereHas('translations', function ($t) use ($brand) {
                            $t->where('slug', $brand)->orWhere('seo_slug', $brand);
                        });
                    });
                }
            }

            return $query->get()->map(fn($item) => $item->transform())->toArray();
        });

        return $this->success($accessories);
    }

    /**
     * GET /api/accessories/{slug_or_id}
     */
    public function show($slugOrId): JsonResponse
    {
        $cacheKey = 'api_accessories_show_' . $slugOrId;

        $data = \Illuminate\Support\Facades\Cache::remember($cacheKey, 3600, function() use ($slugOrId) {
            $query = Accessory::query()
                ->where('status', 'ACTIVE')
                ->with(['translations', 'categories', 'brand', 'vehicles', 'vehicles.translations']);

            if (is_numeric($slugOrId)) {
                $accessory = $query->find($slugOrId);
            } else {
                $accessory = $query->whereSlug($slugOrId)->first();
            }

            if (!$accessory) {
                return null;
            }

            return $accessory->transformDetails();
        });

        if (!$data) {
            return $this->failure(__('Không tìm thấy phụ kiện'), 404);
        }

        return $this->success($data);
    }
}
