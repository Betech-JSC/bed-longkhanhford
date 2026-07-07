<?php

namespace JamstackVietnam\Region\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use JamstackVietnam\Core\Traits\ApiResponse;
use JamstackVietnam\Region\Models\Region;

class RegionController extends Controller
{
    use ApiResponse;

    public function province()
    {
        $data = Region::where('parent_code', null)
            ->orderBy('sort', 'desc')
            ->orderBy('name')
            ->get()
            ->map(fn ($item) => [
                'id' => $item['code'],
                'name' => $item['name'],
                'full_name' => $item['name_with_type'],
            ]);

        return $this->success($data);
    }

    public function district($province_id)
    {
        $data = Region::where('parent_code', $province_id)
            ->orderBy('sort', 'desc')
            ->orderBy('name_with_type')
            ->get()
            ->map(fn ($item) => [
                'id' => $item['code'],
                'name' => $item['name'],
                'full_name' => $item['name_with_type'],
                'province_id' => $item['parent_code']
            ]);

        return $this->success($data);
    }

    public function ward($district_id)
    {
        $data = Region::where('parent_code', $district_id)
            ->orderBy('sort', 'desc')
            ->orderBy('name_with_type')
            ->get()
            ->map(fn ($item) => [
                'id' => $item['code'],
                'name' => $item['name'],
                'full_name' => $item['name_with_type'],
                'district_id' => $item['parent_code']
            ]);

        return $this->success($data);
    }

    public function region($code)
    {
        $item = Region::where('code', $code)
            ->with('parent.parent')
            ->orderBy('sort', 'desc')
            ->orderBy('name_with_type')
            ->first();

        if (!$item) {
            return $this->empty();
        }

        return $this->success($item);
    }
}
