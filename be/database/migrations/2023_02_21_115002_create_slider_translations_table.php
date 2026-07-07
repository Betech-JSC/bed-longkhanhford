<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSliderTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('slider_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('slider_id');

            $table->text('title');
            $table->string('locale');

            $table->text('description')->nullable();
            $table->string('link')->nullable();
            $table->string('target')->nullable();

            $table->json('image')->nullable();
            $table->json('image_mobile')->nullable();
            $table->json('custom_fields')->nullable();

            $table->unique(['locale', 'slider_id']);
            $table->foreign('slider_id')
                ->references('id')
                ->on('sliders')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('slider_translations');
    }
}
