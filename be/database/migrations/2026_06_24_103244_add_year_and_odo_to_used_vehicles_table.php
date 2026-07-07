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
        Schema::table('used_vehicles', function (Blueprint $table) {
            $table->integer('year')->nullable()->after('price');
            $table->integer('odo')->nullable()->after('year');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('used_vehicles', function (Blueprint $table) {
            $table->dropColumn(['year', 'odo']);
        });
    }
};
