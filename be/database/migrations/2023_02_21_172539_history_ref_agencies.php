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
        Schema::create('history_ref_agencies', function (Blueprint $table) {
            $table->unsignedBigInteger('history_id')->index();
            $table->unsignedBigInteger('agency_id')->index();

            $table->primary(['history_id', 'agency_id']);
            $table->foreign('history_id')->references('id')->on('histories')->onDelete('cascade');
            $table->foreign('agency_id')->references('id')->on('agencies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('history_ref_agencies');
    }
};
