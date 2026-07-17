<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use JamstackVietnam\Core\Traits\ApiResponse;
use App\Services\GeminiService;

class VehicleController extends Controller
{
    use ApiResponse;

    /**
     * Map vehicle to standard format
     */
    private function formatList(Vehicle $v): array
    {
        $data = [
            'id'                  => $v->id,
            'category_id'         => $v->category_id,
            'category_ids'        => $v->category_ids,
            'title'               => $v->title,
            'slug'                => $v->slug,
            'tagline'             => $v->tagline,
            'image_url'           => $v->image_url,
            'image_thumbnail_url' => $v->image_thumbnail_url,
            'image_featured_url'  => $v->image_featured_url,
            'video_url'           => $v->video_url,
            'video'               => $v->video ? $this->resolveFileUrl($v->video) : null,
            'type'                => $v->type,
            'base_price'          => $v->base_price,
            'is_best_seller'      => $v->is_best_seller,
            'sort_order'          => $v->sort_order,
            'brochure_url'        => $v->brochure_url,
            'brochure_file'       => $v->brochure_file ? $this->resolveFileUrl($v->brochure_file) : null,
            'colors'              => collect($v->colors)->map(function ($color) {
                $imagePath = null;
                if (isset($color['image_path'])) {
                    $imagePath = static_url($color['image_path']);
                } elseif (isset($color['image'])) {
                    $imagePath = $this->resolveFileUrl($color['image']);
                }
                return [
                    'name'       => $color['name'] ?? ($color['color_name'] ?? ''),
                    'hex'        => $color['hex'] ?? ($color['color_code'] ?? ''),
                    'image_path' => $imagePath,
                ];
            })->toArray(),
        ];

        if ($v->relationLoaded('versions')) {
            $data['versions'] = $v->versions->map(fn($ver) => [
                'id'                  => $ver->id,
                'name'                => $ver->name,
                'price'               => $ver->price,
                'image_url'           => $ver->image_url,
                'image_thumbnail_url' => $ver->image_thumbnail_url,
                'specs'               => $ver->specs ?? [],
                'sort_order'          => $ver->sort_order,
            ])->toArray();
        }

        return $data;
    }

    /**
     * GET /api/vehicles
     */
    public function index(Request $request): JsonResponse
    {
        $query = Vehicle::query()
            ->with('categories')
            ->where('status', Vehicle::STATUS_ACTIVE)
            ->sortByPosition();

        if ($request->has('with_versions')) {
            $query->with(['categories', 'versions' => fn($q) => $q->where('status', 'ACTIVE')->sortByPosition()]);
        }

        if ($categorySlug = $request->query('category')) {
            $query->whereHas('categories', function ($q) use ($categorySlug) {
                $q->whereSlug($categorySlug)
                    ->where('status', VehicleCategory::STATUS_ACTIVE);
            });
        }

        $vehicles = $query->get()
            ->map(fn($v) => $this->formatList($v));

        return $this->success($vehicles);
    }

    /**
     * GET /api/vehicles/featured
     */
    public function featured(): JsonResponse
    {
        $vehicles = Vehicle::query()
            ->with('categories')
            ->where('status', Vehicle::STATUS_ACTIVE)
            ->where('is_best_seller', true)
            ->sortByPosition()
            ->get()
            ->map(fn($v) => $this->formatList($v));

        return $this->success($vehicles);
    }

    /**
     * GET /api/vehicles/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $vehicle = Vehicle::query()
            ->where('status', Vehicle::STATUS_ACTIVE)
            ->whereSlug($slug)
            ->with([
                'categories',
                'versions' => fn($q) => $q->where('status', 'ACTIVE')->sortByPosition()
            ])
            ->first();

        if (!$vehicle) {
            return $this->failure(__('Không tìm thấy xe'), 404);
        }

        return $this->success([
            'id'                     => $vehicle->id,
            'category_id'            => $vehicle->category_id,
            'category_ids'           => $vehicle->category_ids,
            'title'                  => $vehicle->title,
            'slug'                   => $vehicle->slug,
            'tagline'                => $vehicle->tagline,
            'description'            => $vehicle->description,
            'image_url'              => $vehicle->image_url,
            'video_url'              => $vehicle->video_url,
            'video'                  => $this->resolveFileUrl($vehicle->video),
            'brochure_url'           => $vehicle->brochure_url,
            'brochure_file'          => $this->resolveFileUrl($vehicle->brochure_file),
            'images'                 => collect($vehicle->images)->map(fn($img) => isset($img['path']) ? static_url($img['path']) : $img),
            'colors'                 => collect($vehicle->colors)->map(function ($color) {
                $imagePath = null;
                if (isset($color['image_path'])) {
                    $imagePath = static_url($color['image_path']);
                } elseif (isset($color['image'])) {
                    $imagePath = $this->resolveFileUrl($color['image']);
                }

                $images360 = [];
                if (isset($color['images_360']) && is_array($color['images_360'])) {
                    $images360 = collect($color['images_360'])->map(function($img) {
                        return $this->resolveFileUrl($img);
                    })->filter()->values()->toArray();
                }

                $image360Internal = null;
                if (isset($color['image_360_internal'])) {
                    $image360Internal = $this->resolveFileUrl($color['image_360_internal']);
                }

                $images360Internal = [];
                if (isset($color['images_360_internal']) && is_array($color['images_360_internal'])) {
                    $images360Internal = collect($color['images_360_internal'])->map(function($img) {
                        return $this->resolveFileUrl($img);
                    })->filter()->values()->toArray();
                }

                return [
                    'name'                => $color['name'] ?? ($color['color_name'] ?? ''),
                    'hex'                 => $color['hex'] ?? ($color['color_code'] ?? ''),
                    'image_path'          => $imagePath,
                    'images_360'          => $images360,
                    'image_360_internal'  => $image360Internal,
                    'images_360_internal' => $images360Internal,
                ];
            })->toArray(),
            'images_360_external'    => collect($vehicle->images_360_external ?? [])->map(fn($img) => $this->resolveFileUrl($img))->filter()->values()->toArray(),
            'images_360_internal'    => collect($vehicle->images_360_internal ?? [])->map(fn($img) => $this->resolveFileUrl($img))->filter()->values()->toArray(),
            'image_360_internal_url' => $this->resolveFileUrl($vehicle->image_360_internal_url),
            'type'                   => $vehicle->type,
            'base_price'             => $vehicle->base_price,
            'versions'               => $vehicle->versions->map(fn($v) => [
                'id'                  => $v->id,
                'name'                => $v->name,
                'price'               => $v->price,
                'image_url'           => $v->image_url,
                'image_thumbnail_url' => $v->image_thumbnail_url,
                'specs'               => $v->specs ?? [],
                'sort_order'          => $v->sort_order,
                'colors'     => collect($v->colors ?? [])->map(function ($color) {
                    $imagePath = null;
                    if (isset($color['image_path'])) {
                        $imagePath = static_url($color['image_path']);
                    } elseif (isset($color['image'])) {
                        $imagePath = $this->resolveFileUrl($color['image']);
                    }

                    $images360 = [];
                    if (isset($color['images_360']) && is_array($color['images_360'])) {
                        $images360 = collect($color['images_360'])->map(function($img) {
                            return $this->resolveFileUrl($img);
                        })->filter()->values()->toArray();
                    }

                    $image360Internal = null;
                    if (isset($color['image_360_internal'])) {
                        $image360Internal = $this->resolveFileUrl($color['image_360_internal']);
                    }

                    $images360Internal = [];
                    if (isset($color['images_360_internal']) && is_array($color['images_360_internal'])) {
                        $images360Internal = collect($color['images_360_internal'])->map(function($img) {
                            return $this->resolveFileUrl($img);
                        })->filter()->values()->toArray();
                    }

                    return [
                        'name'                => $color['name'] ?? ($color['color_name'] ?? ''),
                        'hex'                 => $color['hex'] ?? ($color['color_code'] ?? ''),
                        'image_path'          => $imagePath,
                        'images_360'          => $images360,
                        'image_360_internal'  => $image360Internal,
                        'images_360_internal' => $images360Internal,
                    ];
                })->toArray(),
            ]),
            'layout_blocks'          => $this->resolveLayoutBlocksUrls($vehicle->layout_blocks),
        ]);
    }

    private function resolveLayoutBlocksUrls($blocks)
    {
        if (!is_array($blocks)) return $blocks;
        
        foreach ($blocks as $i => $block) {
            if (isset($block['type']) && isset($block['data'])) {
                if ($block['type'] === 'HeroBanner' && isset($block['data']['background_image'])) {
                    $blocks[$i]['data']['background_image'] = $this->resolveFileUrl($block['data']['background_image']);
                }
                if ($block['type'] === 'BookingBanner' && isset($block['data']['car_image'])) {
                    $blocks[$i]['data']['car_image'] = $this->resolveFileUrl($block['data']['car_image']);
                }
                if ($block['type'] === 'Promotions' && isset($block['data']['image'])) {
                    $blocks[$i]['data']['image'] = $this->resolveFileUrl($block['data']['image']);
                }
                if ($block['type'] === 'FeaturesGrid') {
                    if (isset($block['data']['image_1'])) {
                        $blocks[$i]['data']['image_1'] = $this->resolveFileUrl($block['data']['image_1']);
                    }
                    if (isset($block['data']['image_2'])) {
                        $blocks[$i]['data']['image_2'] = $this->resolveFileUrl($block['data']['image_2']);
                    }
                    if (isset($block['data']['image_3'])) {
                        $blocks[$i]['data']['image_3'] = $this->resolveFileUrl($block['data']['image_3']);
                    }
                    if (isset($block['data']['image_large'])) {
                        $blocks[$i]['data']['image_large'] = $this->resolveFileUrl($block['data']['image_large']);
                    }
                    if (isset($block['data']['image_large_2'])) {
                        $blocks[$i]['data']['image_large_2'] = $this->resolveFileUrl($block['data']['image_large_2']);
                    }
                    if (isset($block['data']['image_large_3'])) {
                        $blocks[$i]['data']['image_large_3'] = $this->resolveFileUrl($block['data']['image_large_3']);
                    }
                    if (isset($block['data']['split_image'])) {
                        $blocks[$i]['data']['split_image'] = $this->resolveFileUrl($block['data']['split_image']);
                    }
                }
                if ($block['type'] === 'FeaturesList' && isset($block['data']['features']) && is_array($block['data']['features'])) {
                    foreach ($block['data']['features'] as $fIndex => $feature) {
                        if (isset($feature['image'])) {
                            $blocks[$i]['data']['features'][$fIndex]['image'] = $this->resolveFileUrl($feature['image']);
                        }
                    }
                }
            }
        }
        return $blocks;
    }

    private function resolveFileUrl($file)
    {
        if (empty($file)) return null;
        if (is_array($file)) {
            if (isset($file['path'])) {
                $path = $file['path'];
                if (str_starts_with($path, 'uploads/')) {
                    $path = str_replace('uploads/', '', $path);
                }
                return static_url($path);
            }
            if (isset($file['url'])) {
                return $file['url'];
            }
        }
        if (is_string($file)) {
            if (str_starts_with($file, 'http://') || str_starts_with($file, 'https://') || str_starts_with($file, '/')) {
                return $file;
            }
            $path = $file;
            if (str_starts_with($path, 'uploads/')) {
                $path = str_replace('uploads/', '', $path);
            }
            return static_url($path);
        }
        return $file;
    }

    public function updateLayout(Request $request, string $slug): JsonResponse
    {
        $vehicle = Vehicle::whereSlug($slug)->firstOrFail();
        $vehicle->update([
            'layout_blocks' => $request->input('layout_blocks')
        ]);
        return response()->json([
            'success' => true,
            'data' => $this->resolveLayoutBlocksUrls($vehicle->layout_blocks)
        ]);
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:10240',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Save file using the 'uploads' disk
            \Illuminate\Support\Facades\Storage::disk('uploads')->putFileAs('', $file, $filename);
            
            return response()->json([
                'success' => true,
                'path' => $filename,
                'url' => static_url($filename),
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No file uploaded'
        ], 400);
    }

    public function generateBlockContent(Request $request, GeminiService $gemini): JsonResponse
    {
        $request->validate([
            'vehicle_title' => 'required|string',
            'section_type' => 'required|string',
            'field_type' => 'required|string',
            'user_prompt' => 'nullable|string',
        ]);

        $result = $gemini->generateBlockContent([
            'vehicle_title' => $request->input('vehicle_title'),
            'section_type' => $request->input('section_type'),
            'field_type' => $request->input('field_type'),
            'user_prompt' => $request->input('user_prompt'),
        ]);

        if (isset($result['success']) && !$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 400);
        }

        return response()->json([
            'success' => true,
            'content' => $result['content'],
        ]);
    }
}
