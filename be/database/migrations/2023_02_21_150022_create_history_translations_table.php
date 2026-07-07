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
        Schema::create('history_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('history_id');

            $table->string('title');
            $table->string('locale');
            $table->string('slug');

            $table->text('description')->nullable();
            $table->longText('content')->nullable();

            $table->addSeo();

            $table->unique(['locale', 'history_id']);
            $table->unique(['locale', 'slug']);
            $table->foreign('history_id')
                ->references('id')
                ->on('histories')
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
        Schema::dropIfExists('history_translations');
    }
};
