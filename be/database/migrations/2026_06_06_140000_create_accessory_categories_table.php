<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tạo bảng accessory_categories
        Schema::create('accessory_categories', function (Blueprint $table) {
            $table->id();
            $table->json('image')->nullable()->comment('Ảnh danh mục');
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Tạo bảng accessory_category_translations
        Schema::create('accessory_category_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('accessory_category_id');
            $table->string('locale', 10)->index();
            $table->string('title', 255)->nullable();
            $table->string('slug', 255)->nullable();
            $table->addSeo();

            $table->unique(['accessory_category_id', 'locale'], 'acc_cat_locale_unique');
            $table->unique(['locale', 'slug'], 'acc_cat_slug_unique');
            $table->foreign('accessory_category_id', 'fk_acc_cat_trans_cat_id')
                ->references('id')
                ->on('accessory_categories')
                ->onDelete('cascade');
        });

        // 3. Thêm cột category_id vào accessories
        Schema::table('accessories', function (Blueprint $table) {
            $table->unsignedBigInteger('category_id')->nullable()->after('code');
            $table->foreign('category_id')
                ->references('id')
                ->on('accessory_categories')
                ->onDelete('set null');
        });

        // 4. Seed dữ liệu mặc định và chuyển đổi dữ liệu từ cột category cũ
        $categories = [
            'interior'    => ['vi' => 'Phụ Kiện Nội Thất', 'en' => 'Interior Accessories'],
            'exterior'    => ['vi' => 'Phụ Kiện Ngoại Thất', 'en' => 'Exterior Accessories'],
            'tech'        => ['vi' => 'Công Nghệ & Điện Tử', 'en' => 'Tech & Electronics'],
            'wheels'      => ['vi' => 'Mâm & Lốp Xe', 'en' => 'Wheels & Tires'],
            'performance' => ['vi' => 'Phụ Tùng Hiệu Suất', 'en' => 'Performance Parts'],
        ];

        $sort = 1;
        foreach ($categories as $key => $names) {
            $catId = DB::table('accessory_categories')->insertGetId([
                'status' => 'ACTIVE',
                'sort_order' => $sort++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($names as $locale => $title) {
                DB::table('accessory_category_translations')->insert([
                    'accessory_category_id' => $catId,
                    'locale' => $locale,
                    'title' => $title,
                    'slug' => Str::slug($title),
                    'seo_slug' => Str::slug($title),
                ]);
            }

            // Gán category_id cho các phụ kiện cũ có category tương ứng
            DB::table('accessories')
                ->where('category', $key)
                ->update(['category_id' => $catId]);
        }

        // 5. Drop cột category cũ trong bảng accessories
        Schema::table('accessories', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }

    public function down(): void
    {
        // Khôi phục cột category cũ dạng enum
        Schema::table('accessories', function (Blueprint $table) {
            $table->enum('category', ['interior', 'exterior', 'tech', 'wheels', 'performance'])
                  ->default('exterior')
                  ->after('code');
        });

        // Map ngược lại dữ liệu từ category_id về enum
        $categories = [
            'interior'    => 'Phụ Kiện Nội Thất',
            'exterior'    => 'Phụ Kiện Ngoại Thất',
            'tech'        => 'Công Nghệ & Điện Tử',
            'wheels'      => 'Mâm & Lốp Xe',
            'performance' => 'Phụ Tùng Hiệu Suất',
        ];

        foreach ($categories as $key => $titleVi) {
            $cat = DB::table('accessory_category_translations')
                ->where('locale', 'vi')
                ->where('title', $titleVi)
                ->first();

            if ($cat) {
                DB::table('accessories')
                    ->where('category_id', $cat->accessory_category_id)
                    ->update(['category' => $key]);
            }
        }

        // Drop foreign key và cột category_id
        Schema::table('accessories', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn('category_id');
        });

        Schema::dropIfExists('accessory_category_translations');
        Schema::dropIfExists('accessory_categories');
    }
};
