<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use JamstackVietnam\Core\Traits\ApiResponse;
use JamstackVietnam\Region\Models\Region;
use App\Models\Config;

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
                'name' => $item['name']
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
                'name' => $item['name_with_type'],
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
                'name' => $item['name_with_type'],
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

        $freeShip = false;
        $getShipping = Config::getShipping()['free_shipping_vnp'];

        if (!$item->shipping_price && $item->parent) {
            if (!$item->parent->shipping_price && $item->parent->parent) {
                $item->shipping_price = $item->parent->parent->shipping_price;
            } else if ($item->parent->shipping_price) {
                $item->shipping_price = $item->parent->shipping_price;
            }
        }

        if (request()->has('payment_method')) {
            $freeShip = $getShipping['free_shipping_vnp'];
            if (!$freeShip || request()->input('payment_method') != 'VNPAY') {
                $freeShip = false;
            }
        }

        if ($freeShip) {
            $item->shipping_price = 0;
        }
        else if (!$item->shipping_price) {
            $item->shipping_price = $getShipping['default'];
        }

        return $this->success($item);
    }

    public function registrationFees()
    {
        $fees = \App\Models\Vehicle\RegistrationFee::with('region')
            ->get()
            ->map(function ($fee) {
                if (!$fee->region) return null;
                return [
                    'province_id' => $fee->region->code,
                    'province_name' => $fee->region->name,
                    'registration_tax_percent' => (float) $fee->registration_tax_percent,
                    'license_plate_fee' => (float) $fee->license_plate_fee,
                    'inspection_fee' => (float) $fee->inspection_fee,
                    'road_maintenance_fee' => (float) $fee->road_maintenance_fee,
                    'civil_insurance_fee' => (float) $fee->civil_insurance_fee,
                    'service_fee' => (float) $fee->service_fee,
                ];
            })
            ->filter()
            ->values();

        return $this->success($fees);
    }
}
