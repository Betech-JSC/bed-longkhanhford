<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_categories', function (Blueprint $table) {
            $table->id();
            $table->string('image', 500)->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('vehicle_category_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_category_id');
            $table->string('locale', 10)->index();
            $table->string('title', 255)->nullable();
            $table->string('slug', 255)->nullable();

            $table->unique(['vehicle_category_id', 'locale']);
            $table->unique(['locale', 'slug']);
            $table->foreign('vehicle_category_id', 'fk_veh_cat_trans_cat_id')
                ->references('id')
                ->on('vehicle_categories')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_category_translations');
        Schema::dropIfExists('vehicle_categories');
    }
};
