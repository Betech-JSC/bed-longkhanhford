<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Vehicle\VehicleTranslation;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Fix duplicate tagline/meta description for ranger-2026
        $ranger = VehicleTranslation::where('slug', 'ranger-2026')->first();
        if ($ranger) {
            $ranger->update([
                'tagline' => 'Không có gì chất như Ranger. Vua bán tải mạnh mẽ thế hệ mới.',
                'seo_meta_description' => 'Khám phá chi tiết xe Ford Ranger 2026 chính hãng tại Long Khánh Ford. Nhận báo giá lăn bánh mới nhất cùng khuyến mãi hấp dẫn.',
            ]);
        }

        // Fix duplicate tagline/meta description for ranger-raptor-2026
        $raptor = VehicleTranslation::where('slug', 'ranger-raptor-2026')->first();
        if ($raptor) {
            $raptor->update([
                'tagline' => 'Bán tải hiệu năng cao đỉnh cao từ Ford Performance.',
                'seo_meta_description' => 'Khám phá chi tiết xe Ranger Raptor 2026 - mẫu bán tải hiệu năng cao đỉnh cao từ Ford Performance tại Long Khánh Ford.',
            ]);
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Not necessary to revert data updates
    }
};
