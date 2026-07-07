<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tạo bảng pivot vehicle_ref_categories
        Schema::create('vehicle_ref_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_id');
            $table->unsignedBigInteger('vehicle_category_id');

            $table->unique(['vehicle_id', 'vehicle_category_id'], 'veh_ref_cat_unique');
            
            $table->foreign('vehicle_id', 'fk_veh_ref_cat_veh_id')
                ->references('id')
                ->on('vehicles')
                ->onDelete('cascade');

            $table->foreign('vehicle_category_id', 'fk_veh_ref_cat_cat_id')
                ->references('id')
                ->on('vehicle_categories')
                ->onDelete('cascade');
        });

        // 2. Chuyển đổi dữ liệu cũ từ vehicles.category_id sang bảng pivot
        $vehicles = DB::table('vehicles')->whereNotNull('category_id')->get();
        foreach ($vehicles as $vehicle) {
            DB::table('vehicle_ref_categories')->insert([
                'vehicle_id' => $vehicle->id,
                'vehicle_category_id' => $vehicle->category_id,
            ]);
        }

        // 3. Drop foreign key và drop cột category_id trong bảng vehicles
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }

    public function down(): void
    {
        // Khôi phục cột category_id trong bảng vehicles
        Schema::table('vehicles', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable()->after('id');
            $table->foreign('category_id')
                ->references('id')
                ->on('vehicle_categories')
                ->onDelete('set null');
        });

        // Di chuyển ngược dữ liệu từ pivot table về cột category_id (lấy danh mục đầu tiên tìm thấy)
        $pivots = DB::table('vehicle_ref_categories')->get()->groupBy('vehicle_id');
        foreach ($pivots as $vehicleId => $items) {
            $firstCategory = $items->first();
            DB::table('vehicles')
                ->where('id', $vehicleId)
                ->update(['category_id' => $firstCategory->vehicle_category_id]);
        }

        // Drop bảng pivot
        Schema::dropIfExists('vehicle_ref_categories');
    }
};
