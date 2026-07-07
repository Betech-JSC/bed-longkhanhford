<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('vehicle_versions', 'image')) {
            Schema::table('vehicle_versions', function (Blueprint $table) {
                $table->json('image')->nullable()->after('specs')->comment('Version featured image');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('vehicle_versions', 'image')) {
            Schema::table('vehicle_versions', function (Blueprint $table) {
                $table->dropColumn('image');
            });
        }
    }
};
