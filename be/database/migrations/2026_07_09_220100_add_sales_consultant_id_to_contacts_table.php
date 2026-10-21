<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->unsignedBigInteger('sales_consultant_id')->nullable()->after('vehicle_version_id');

            $table->foreign('sales_consultant_id', 'fk_contacts_sales_consultant_id')
                ->references('id')
                ->on('sales_consultants')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropForeign('fk_contacts_sales_consultant_id');
            $table->dropColumn('sales_consultant_id');
        });
    }
};
