<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleVersion;
use App\Models\Vehicle\VehicleCategory;

class UpdateFordPricesFromPtautoSeeder extends Seeder
{
    /**
     * Cập nhật danh sách dòng xe, phiên bản và giá niêm yết chuẩn hoá từ ptauto.com.vn
     * Bỏ qua hoàn toàn phần giảm giá tiền mặt theo yêu cầu người dùng.
     * Sử dụng updateOrCreate để đảm bảo an toàn tuyệt đối cho dữ liệu hiện có.
     */
    public function run(): void
    {
        // 1. Nhóm danh mục xe (Đảm bảo có sẵn)
        $catSUV = VehicleCategory::whereHas('translations', function ($q) {
            $q->where('slug', 'suv');
        })->first() ?? VehicleCategory::firstOrCreate(['id' => 1], ['status' => 'ACTIVE', 'sort_order' => 1]);

        $catPickup = VehicleCategory::whereHas('translations', function ($q) {
            $q->where('slug', 'ban-tai');
        })->first() ?? VehicleCategory::firstOrCreate(['id' => 2], ['status' => 'ACTIVE', 'sort_order' => 2]);

        $catCommercial = VehicleCategory::whereHas('translations', function ($q) {
            $q->where('slug', 'thuong-mai');
        })->first() ?? VehicleCategory::firstOrCreate(['id' => 3], ['status' => 'ACTIVE', 'sort_order' => 3]);

        $vehiclesData = [
            // FORD TERRITORY
            [
                'slug' => 'ford-territory',
                'title' => 'FORD TERRITORY',
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'base_price' => 739000000,
                'versions' => [
                    ['name' => 'Territory Trend 1.5L AT', 'price' => 739000000, 'sort_order' => 1],
                    ['name' => 'Territory Titanium 1.5L AT', 'price' => 819000000, 'sort_order' => 2],
                    ['name' => 'Territory Titanium X 1.5L AT', 'price' => 875000000, 'sort_order' => 3],
                    ['name' => 'Territory Platinum 1.5L AT', 'price' => 916000000, 'sort_order' => 4],
                ]
            ],
            // FORD EVEREST
            [
                'slug' => 'ford-everest',
                'title' => 'FORD EVEREST',
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'base_price' => 1129000000,
                'versions' => [
                    ['name' => 'Everest Active 2.0L AT 4x2', 'price' => 1129000000, 'sort_order' => 1],
                    ['name' => 'Everest Sport 2.0L AT 4x2', 'price' => 1209000000, 'sort_order' => 2],
                    ['name' => 'Everest Platinum 2.0L AT 4x2', 'price' => 1335000000, 'sort_order' => 3],
                    ['name' => 'Everest Platinum 2.0L AT 4x4', 'price' => 1440000000, 'sort_order' => 4],
                    ['name' => 'Everest Platinum+ 2.3L AT 4x4', 'price' => 1629000000, 'sort_order' => 5],
                ]
            ],
            // FORD RANGER
            [
                'slug' => 'ford-ranger',
                'title' => 'FORD RANGER',
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'base_price' => 726000000,
                'versions' => [
                    ['name' => 'Ranger XLS 2.0L AT 4x2 (mới)', 'price' => 726000000, 'sort_order' => 1],
                    ['name' => 'Ranger XLS 2.0L AT 4x4 (mới)', 'price' => 795000000, 'sort_order' => 2],
                    ['name' => 'Ranger Wildtrak 2.0L AT 4x4 (mới)', 'price' => 973000000, 'sort_order' => 3],
                    ['name' => 'Ranger Wildtrak 3.0L AT 4x4 (mới)', 'price' => 1093000000, 'sort_order' => 4],
                ]
            ],
            // FORD RANGER RAPTOR
            [
                'slug' => 'ford-ranger-raptor',
                'title' => 'FORD RANGER RAPTOR',
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'base_price' => 1448000000,
                'versions' => [
                    ['name' => 'Ranger Raptor 3.0L AT 4WD', 'price' => 1448000000, 'sort_order' => 1],
                ]
            ],
            // FORD TRANSIT
            [
                'slug' => 'ford-transit',
                'title' => 'FORD TRANSIT',
                'category_id' => $catCommercial->id,
                'type' => 'commercial',
                'base_price' => 907000000,
                'versions' => [
                    ['name' => 'Transit Trend 16 chỗ', 'price' => 907000000, 'sort_order' => 1],
                    ['name' => 'Transit Premium 16 chỗ', 'price' => 999000000, 'sort_order' => 2],
                    ['name' => 'Transit Premium+ 18 chỗ', 'price' => 1091000000, 'sort_order' => 3],
                ]
            ],
            // FORD MUSTANG MACH-E
            [
                'slug' => 'ford-mustang-mach-e',
                'title' => 'FORD MUSTANG MACH-E',
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'base_price' => 1699000000,
                'versions' => [
                    ['name' => 'Mustang Mach-E Premium AWD (thuần điện)', 'price' => 1699000000, 'sort_order' => 1],
                ]
            ],
        ];

        foreach ($vehiclesData as $vData) {
            $vehicle = Vehicle::whereHas('translations', function ($q) use ($vData) {
                $q->where('slug', $vData['slug']);
            })->first();

            if (!$vehicle) {
                $vehicle = new Vehicle([
                    'type' => $vData['type'],
                    'base_price' => $vData['base_price'],
                    'status' => 'ACTIVE',
                    'sort_order' => 1,
                ]);
                $vehicle->fill([
                    'vi' => [
                        'title' => $vData['title'],
                        'slug' => $vData['slug'],
                    ]
                ]);
                $vehicle->save();
                $vehicle->categories()->sync([$vData['category_id']]);
            } else {
                $vehicle->update([
                    'base_price' => $vData['base_price'],
                    'type' => $vData['type'],
                ]);
            }

            foreach ($vData['versions'] as $verData) {
                $version = VehicleVersion::where('vehicle_id', $vehicle->id)
                    ->whereHas('translations', function ($q) use ($verData) {
                        $q->where('name', $verData['name']);
                    })->first();

                if ($version) {
                    $version->update([
                        'price' => $verData['price'],
                        'sort_order' => $verData['sort_order'],
                    ]);
                } else {
                    $newVer = new VehicleVersion([
                        'vehicle_id' => $vehicle->id,
                        'price' => $verData['price'],
                        'status' => 'ACTIVE',
                        'sort_order' => $verData['sort_order'],
                    ]);
                    $newVer->fill([
                        'vi' => [
                            'name' => $verData['name'],
                        ]
                    ]);
                    $newVer->save();
                }
            }
        }

        $this->command->info('✅ Cập nhật giá niêm yết từ ptauto thành công (Không tính giảm giá tiền mặt)!');
    }
}
