<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use JamstackVietnam\Core\Traits\ApiResponse;
use JamstackVietnam\Agency\Models\Agency;
use JamstackVietnam\Region\Models\Region;

class AgencyController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $items = Agency::query()
            ->active()
            ->filter(request()->all())
            ->sortByPosition()
            ->get()
            ->map(fn ($item) => $item->transformDetails());

        return $this->success($items);
    }

    public function province(): JsonResponse
    {
        $provinceCodes = Agency::query()
            ->active()
            ->filter(request()->all())
            ->sortByPosition()
            ->groupBy('province_id')
            ->get()
            ->pluck('province_id')
            ->toArray();

        $items = Region::where('parent_code', null)
            ->orderBy('sort', 'desc')
            ->orderBy('name')
            ->whereIn('code', $provinceCodes)
            ->get()
            ->map(fn ($item) => [
                'id' => $item['code'],
                'name' => $item['name'],
                'full_name' => $item['name_with_type']
            ]);

        return $this->success($items);
    }

    public function district($province_id): JsonResponse
    {
        $districtCodes = Agency::query()
            ->active()
            ->filter(request()->all())
            ->sortByPosition()
            ->where('province_id', $province_id)
            ->groupBy('district_id')
            ->get()
            ->pluck('district_id')
            ->toArray();

            $items = Region::where('parent_code', $province_id)
            ->orderBy('sort', 'desc')
            ->orderBy('name')
            ->whereIn('code', $districtCodes)
            ->get()
            ->map(fn ($item) => [
                'id' => $item['code'],
                'name' => $item['name'],
                'full_name' => $item['name_with_type']
            ]);

        return $this->success($items);
    }

    public function ward($district_id): JsonResponse
    {
        $wardCodes = Agency::query()
            ->active()
            ->filter(request()->all())
            ->sortByPosition()
            ->where('district_id', $district_id)
            ->groupBy('ward_id')
            ->get()
            ->pluck('ward_id')
            ->toArray();

        $items = Region::where('parent_code', $district_id)
            ->orderBy('sort', 'desc')
            ->orderBy('name')
            ->whereIn('code', $wardCodes)
            ->get()
            ->map(fn ($item) => [
                'id' => $item['code'],
                'name' => $item['name'],
                'full_name' => $item['name_with_type']
            ]);

        return $this->success($items);
    }
}
