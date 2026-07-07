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
        Schema::create('used_vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('status')->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->decimal('price', 15, 2)->default(0);
            $table->json('image')->nullable()->comment('Main image');
            $table->json('images')->nullable()->comment('Gallery images');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('used_vehicle_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('used_vehicle_id');
            $table->string('locale', 10)->index();
            
            $table->string('title', 255)->nullable();
            $table->string('slug', 255)->nullable();
            $table->string('tagline', 255)->nullable();
            $table->text('description')->nullable()->comment('Detailed content of used vehicle');

            // SEO fields
            $table->string('seo_meta_title', 255)->nullable();
            $table->string('seo_slug', 255)->nullable();
            $table->text('seo_meta_description')->nullable();
            $table->string('seo_meta_keywords', 255)->nullable();
            $table->string('seo_meta_robots', 255)->nullable();
            $table->string('seo_canonical', 500)->nullable();
            $table->json('seo_image')->nullable();
            $table->text('seo_schemas')->nullable();

            $table->unique(['used_vehicle_id', 'locale'], 'used_veh_locale_unique');
            $table->unique(['locale', 'slug'], 'used_veh_locale_slug_unique');
            $table->foreign('used_vehicle_id', 'used_veh_trans_foreign')
                ->references('id')
                ->on('used_vehicles')
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
        Schema::dropIfExists('used_vehicle_translations');
        Schema::dropIfExists('used_vehicles');
    }
};
