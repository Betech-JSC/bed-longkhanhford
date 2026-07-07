<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'post_translations',
            'post_category_translations',
            'vehicle_translations',
            'vehicle_category_translations',
            'used_vehicle_translations',
            'accessory_translations',
            'accessory_category_translations',
            'policy_translations',
            'service_translations',
            'brand_translations',
            'history_translations',
            'meta_pages'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::table($table, function (Blueprint $tableGroup) use ($table) {
                    if (!Schema::hasColumn($table, 'seo_focus_keyword')) {
                        // Thêm cột seo_focus_keyword sau cột seo_meta_title
                        if (Schema::hasColumn($table, 'seo_meta_title')) {
                            $tableGroup->string('seo_focus_keyword')->nullable()->after('seo_meta_title');
                        } else {
                            $tableGroup->string('seo_focus_keyword')->nullable();
                        }
                    }
                });
            }
        }
    }

    public function down(): void
    {
        $tables = [
            'post_translations',
            'post_category_translations',
            'vehicle_translations',
            'vehicle_category_translations',
            'used_vehicle_translations',
            'accessory_translations',
            'accessory_category_translations',
            'policy_translations',
            'service_translations',
            'brand_translations',
            'history_translations',
            'meta_pages'
        ];

        foreach ($tables as $table) {
            if (Schema::hasTable($table)) {
                Schema::table($table, function (Blueprint $tableGroup) use ($table) {
                    if (Schema::hasColumn($table, 'seo_focus_keyword')) {
                        $tableGroup->dropColumn('seo_focus_keyword');
                    }
                });
            }
        }
    }
};
