<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleVersion;

return new class extends Migration
{
    public function up(): void
    {
        $territory = Vehicle::whereHas('translations', function ($q) {
            $q->where('slug', 'ford-territory')->orWhere('slug', 'territory');
        })->first();

        if (!$territory) {
            return;
        }

        // 1. Cập nhật giá niêm yết các bản hiện tại theo bảng giá thực tế 2026
        // Titanium X: 875.000.000 đ
        $titX = VehicleVersion::where('vehicle_id', $territory->id)
            ->whereHas('translations', fn($q) => $q->where('name', 'LIKE', '%Titanium X%'))
            ->first();
        if ($titX) {
            $titX->update(['price' => 875000000, 'sort_order' => 2]);
        }

        // Titanium: 819.000.000 đ
        $tit = VehicleVersion::where('vehicle_id', $territory->id)
            ->whereHas('translations', fn($q) => $q->where('name', 'LIKE', '%Titanium%')->where('name', 'NOT LIKE', '%Titanium X%'))
            ->first();
        if ($tit) {
            $tit->update(['price' => 819000000, 'sort_order' => 3]);
        }

        // Trend: 739.000.000 đ
        $trend = VehicleVersion::where('vehicle_id', $territory->id)
            ->whereHas('translations', fn($q) => $q->where('name', 'LIKE', '%Trend%'))
            ->first();
        if ($trend) {
            $trend->update(['price' => 739000000, 'sort_order' => 4]);
        }

        // 2. Thêm hoặc cập nhật bản Territory Platinum 1.5L AT: 916.000.000 đ
        $plat = VehicleVersion::where('vehicle_id', $territory->id)
            ->whereHas('translations', fn($q) => $q->where('name', 'LIKE', '%Platinum%'))
            ->first();

        if (!$plat) {
            $plat = new VehicleVersion([
                'vehicle_id' => $territory->id,
                'price' => 916000000,
                'status' => VehicleVersion::STATUS_ACTIVE,
                'sort_order' => 1,
            ]);
            $plat->fill(['vi' => ['name' => 'Territory Platinum 1.5L AT']]);
            $plat->save();
        } else {
            $plat->update(['price' => 916000000, 'status' => VehicleVersion::STATUS_ACTIVE, 'sort_order' => 1]);
        }
    }

    public function down(): void
    {
        $territory = Vehicle::whereHas('translations', function ($q) {
            $q->where('slug', 'ford-territory')->orWhere('slug', 'territory');
        })->first();

        if (!$territory) {
            return;
        }

        VehicleVersion::where('vehicle_id', $territory->id)
            ->whereHas('translations', fn($q) => $q->where('name', 'LIKE', '%Titanium X%'))
            ->update(['price' => 954000000]);

        VehicleVersion::where('vehicle_id', $territory->id)
            ->whereHas('translations', fn($q) => $q->where('name', 'LIKE', '%Titanium%')->where('name', 'NOT LIKE', '%Titanium X%'))
            ->update(['price' => 899000000]);

        VehicleVersion::where('vehicle_id', $territory->id)
            ->whereHas('translations', fn($q) => $q->where('name', 'LIKE', '%Platinum%'))
            ->delete();
    }
};
