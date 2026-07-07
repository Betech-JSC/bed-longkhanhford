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
        Schema::table('agencies', function (Blueprint $table) {
            $table->string('province_id')->nullable()->after('link_google_map');
            $table->string('district_id')->nullable()->after('link_google_map');
            $table->string('ward_id')->nullable()->after('link_google_map');
            $table->text('code')->nullable()->after('link_google_map');
        });

        Schema::table('agency_translations', function (Blueprint $table) {
            $table->string('full_address')->nullable()->after('location');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('agencies', function (Blueprint $table) {
            $table->dropColumn('province_id');
            $table->dropColumn('district_id');
            $table->dropColumn('ward_id');
            $table->dropColumn('code');
        });

        Schema::table('agency_translations', function (Blueprint $table) {
            $table->dropColumn('full_address');
        });
    }
};
