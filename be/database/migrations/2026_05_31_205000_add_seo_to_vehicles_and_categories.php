<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_translations', function (Blueprint $table) {
            $table->addSeo();
        });

        Schema::table('vehicle_category_translations', function (Blueprint $table) {
            $table->addSeo();
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_translations', function (Blueprint $table) {
            $table->dropColumn([
                'seo_meta_title',
                'seo_slug',
                'seo_meta_description',
                'seo_meta_keywords',
                'seo_meta_robots',
                'seo_canonical',
                'seo_image',
                'seo_schemas',
            ]);
        });

        Schema::table('vehicle_category_translations', function (Blueprint $table) {
            $table->dropColumn([
                'seo_meta_title',
                'seo_slug',
                'seo_meta_description',
                'seo_meta_keywords',
                'seo_meta_robots',
                'seo_canonical',
                'seo_image',
                'seo_schemas',
            ]);
        });
    }
};
