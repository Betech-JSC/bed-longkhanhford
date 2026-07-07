<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->string('brochure_url', 500)->nullable()->after('layout_blocks');
            $table->text('brochure_file')->nullable()->after('brochure_url');
        });

        Schema::table('accessories', function (Blueprint $table) {
            $table->string('brochure_url', 500)->nullable()->after('status');
            $table->text('brochure_file')->nullable()->after('brochure_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['brochure_url', 'brochure_file']);
        });

        Schema::table('accessories', function (Blueprint $table) {
            $table->dropColumn(['brochure_url', 'brochure_file']);
        });
    }
};
