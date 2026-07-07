<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('vehicle_versions', 'image_thumbnail')) {
            Schema::table('vehicle_versions', function (Blueprint $table) {
                $table->json('image_thumbnail')->nullable()->after('image')->comment('Version representative card thumbnail image');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasColumn('vehicle_versions', 'image_thumbnail')) {
            Schema::table('vehicle_versions', function (Blueprint $table) {
                $table->dropColumn('image_thumbnail');
            });
        }
    }
};
