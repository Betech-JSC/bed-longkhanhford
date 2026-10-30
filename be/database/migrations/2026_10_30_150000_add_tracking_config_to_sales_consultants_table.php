<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sales_consultants', function (Blueprint $table) {
            if (!Schema::hasColumn('sales_consultants', 'tracking_config')) {
                $table->json('tracking_config')->nullable()->after('custom_domain');
            }
        });
    }

    public function down(): void
    {
        Schema::table('sales_consultants', function (Blueprint $table) {
            if (Schema::hasColumn('sales_consultants', 'tracking_config')) {
                $table->dropColumn('tracking_config');
            }
        });
    }
};
