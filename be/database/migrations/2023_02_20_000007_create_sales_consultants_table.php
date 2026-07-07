<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales_consultants', function (Blueprint $table) {
            $table->id();
            $table->string('department', 100)->nullable();
            $table->json('avatar')->nullable();
            $table->json('cover_image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('facebook_url', 255)->nullable();
            $table->string('linkedin_url', 255)->nullable();
            $table->string('zalo_url', 255)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('phone', 50)->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('sales_consultant_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sales_consultant_id');
            $table->string('locale', 10)->index();
            $table->string('name', 255)->nullable();
            $table->string('slug', 255)->nullable();
            $table->string('job_title', 255)->nullable();
            $table->text('short_bio')->nullable();
            $table->text('bio')->nullable();

            $table->unique(['sales_consultant_id', 'locale'], 'uid_sc_trans_id_locale');
            $table->unique(['locale', 'slug'], 'uid_sc_trans_locale_slug');
            $table->foreign('sales_consultant_id', 'fk_sc_trans_sc_id')
                ->references('id')
                ->on('sales_consultants')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sales_consultant_translations');
        Schema::dropIfExists('sales_consultants');
    }
};
