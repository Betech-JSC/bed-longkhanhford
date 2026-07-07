<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tạo bảng pivot accessory_ref_categories
        Schema::create('accessory_ref_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('accessory_id');
            $table->unsignedBigInteger('accessory_category_id');

            $table->unique(['accessory_id', 'accessory_category_id'], 'acc_ref_cat_unique');
            
            $table->foreign('accessory_id', 'fk_acc_ref_cat_acc_id')
                ->references('id')
                ->on('accessories')
                ->onDelete('cascade');

            $table->foreign('accessory_category_id', 'fk_acc_ref_cat_cat_id')
                ->references('id')
                ->on('accessory_categories')
                ->onDelete('cascade');
        });

        // 2. Chuyển đổi dữ liệu cũ từ accessories.category_id sang bảng pivot
        $accessories = DB::table('accessories')->whereNotNull('category_id')->get();
        foreach ($accessories as $accessory) {
            DB::table('accessory_ref_categories')->insert([
                'accessory_id' => $accessory->id,
                'accessory_category_id' => $accessory->category_id,
            ]);
        }

        // 3. Drop foreign key và drop cột category_id trong bảng accessories
        Schema::table('accessories', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });
    }

    public function down(): void
    {
        // Khôi phục cột category_id trong bảng accessories
        Schema::table('accessories', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable()->after('code');
            $table->foreign('category_id')
                ->references('id')
                ->on('accessory_categories')
                ->onDelete('set null');
        });

        // Di chuyển ngược dữ liệu từ pivot table về cột category_id (lấy danh mục đầu tiên tìm thấy)
        $pivots = DB::table('accessory_ref_categories')->get()->groupBy('accessory_id');
        foreach ($pivots as $accessoryId => $items) {
            $firstCategory = $items->first();
            DB::table('accessories')
                ->where('id', $accessoryId)
                ->update(['category_id' => $firstCategory->accessory_category_id]);
        }

        // Drop bảng pivot
        Schema::dropIfExists('accessory_ref_categories');
    }
};
