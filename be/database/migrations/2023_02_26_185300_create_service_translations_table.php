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
        Schema::create('service_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('service_id');

            $table->string('title');
            $table->string('locale');
            $table->string('slug');

            $table->text('description')->nullable();
            $table->longText('content')->nullable();
            $table->string('title_content')->nullable();
            $table->json('content_by_tab')->nullable();
            $table->text('benefit_title')->nullable();
            $table->json('benefits')->nullable();

            $table->addSeo();

            $table->unique(['locale', 'service_id']);
            $table->unique(['locale', 'slug']);
            $table->foreign('service_id')
                ->references('id')
                ->on('services')
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
        Schema::dropIfExists('service_translations');
    }
};
