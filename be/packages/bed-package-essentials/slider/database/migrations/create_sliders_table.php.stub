<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSlidersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sliders', function (Blueprint $table) {
            $table->id();
            $table->string('status', 30)->default('ACTIVE');
            $table->string('position_display')->nullable()->default('HOME_SLIDER');
            $table->integer('position_sort')->nullable()->default(0);
            
            $table->date('started_at')->nullable();
            $table->date('ended_at')->nullable();

            $table->addTimestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sliders');
    }
}
