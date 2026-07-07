<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->integer('rating')->default(5);
            $table->json('image')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('vehicle_id')
                ->references('id')
                ->on('vehicles')
                ->onDelete('set null');
        });

        Schema::create('customer_review_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_review_id');
            $table->string('locale', 10)->index();
            $table->string('customer_name', 100)->nullable();
            $table->text('content')->nullable();

            $table->unique(['customer_review_id', 'locale'], 'uid_rev_trans_id_locale');
            $table->foreign('customer_review_id', 'fk_rev_trans_rev_id')
                ->references('id')
                ->on('customer_reviews')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_review_translations');
        Schema::dropIfExists('customer_reviews');
    }
};
