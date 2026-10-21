<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('landing_pages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sales_consultant_id');
            $table->unsignedBigInteger('vehicle_id');
            $table->json('layout_blocks')->nullable();
            $table->json('promotions')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['sales_consultant_id', 'vehicle_id'], 'uid_lp_sales_vehicle');
            
            $table->foreign('sales_consultant_id', 'fk_lp_sales_consultant_id')
                ->references('id')
                ->on('sales_consultants')
                ->onDelete('cascade');

            $table->foreign('vehicle_id', 'fk_lp_vehicle_id')
                ->references('id')
                ->on('vehicles')
                ->onDelete('cascade');
        });

        Schema::create('landing_page_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('landing_page_id');
            $table->string('locale', 10)->index();
            $table->string('title', 255)->nullable();
            
            // SEO Fields
            $table->string('seo_meta_title', 255)->nullable();
            $table->text('seo_meta_description')->nullable();
            $table->string('seo_meta_keywords', 255)->nullable();
            $table->string('seo_meta_robots', 100)->nullable();
            $table->string('seo_canonical', 255)->nullable();
            $table->json('seo_image')->nullable();
            $table->json('seo_schemas')->nullable();

            $table->unique(['landing_page_id', 'locale'], 'uid_lp_trans_id_locale');
            
            $table->foreign('landing_page_id', 'fk_lp_trans_lp_id')
                ->references('id')
                ->on('landing_pages')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('landing_page_translations');
        Schema::dropIfExists('landing_pages');
    }
};
