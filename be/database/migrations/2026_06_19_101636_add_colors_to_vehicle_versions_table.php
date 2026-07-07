<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('vehicle_versions', 'colors')) {
            Schema::table('vehicle_versions', function (Blueprint $table) {
                $table->json('colors')->nullable()->after('image')->comment('Colors specifically configured for this version');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('vehicle_versions', 'colors')) {
            Schema::table('vehicle_versions', function (Blueprint $table) {
                $table->dropColumn('colors');
            });
        }
    }
};
