<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('category_id')->nullable();
            
            $table->enum('type', ['suv', 'pickup', 'commercial'])->default('suv');
            $table->boolean('is_best_seller')->default(false);
            $table->decimal('base_price', 15, 2)->default(0);
            
            $table->json('image')->nullable()->comment('Main image');
            $table->json('images')->nullable()->comment('Gallery images');
            $table->json('colors')->nullable()->comment('Array of color options: {name, hex, image}');
            $table->json('images_360_external')->nullable()->comment('360 degree external images');
            $table->json('images_360_internal')->nullable()->comment('360 degree internal images');
            $table->string('image_360_internal_url', 500)->nullable()->comment('URL to internal panorama 360');

            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('category_id')
                ->references('id')
                ->on('vehicle_categories')
                ->onDelete('set null');
        });

        Schema::create('vehicle_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_id');
            $table->string('locale', 10)->index();
            
            $table->string('title', 255)->nullable();
            $table->string('slug', 255)->nullable();
            $table->string('tagline', 255)->nullable();
            $table->text('description')->nullable();

            $table->unique(['vehicle_id', 'locale']);
            $table->unique(['locale', 'slug']);
            $table->foreign('vehicle_id')
                ->references('id')
                ->on('vehicles')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_translations');
        Schema::dropIfExists('vehicles');
    }
};
