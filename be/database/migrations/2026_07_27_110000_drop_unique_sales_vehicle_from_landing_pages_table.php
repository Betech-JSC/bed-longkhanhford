<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('landing_pages', function (Blueprint $table) {
            $table->dropForeign('fk_lp_sales_consultant_id');
            $table->dropUnique('uid_lp_sales_vehicle');
            
            $table->index('sales_consultant_id', 'idx_lp_sales_consultant');
            $table->foreign('sales_consultant_id', 'fk_lp_sales_consultant_id')
                ->references('id')
                ->on('sales_consultants')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('landing_pages', function (Blueprint $table) {
            $table->unique(['sales_consultant_id', 'vehicle_id'], 'uid_lp_sales_vehicle');
        });
    }
};
