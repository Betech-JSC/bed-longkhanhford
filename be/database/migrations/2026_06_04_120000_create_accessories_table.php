<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accessories', function (Blueprint $table) {
            $table->id();

            $table->string('code', 50)->nullable()->comment('Mã sản phẩm phụ kiện');
            $table->enum('category', ['interior', 'exterior', 'tech', 'wheels', 'performance'])
                  ->default('exterior')
                  ->comment('Danh mục phụ kiện');
            $table->decimal('price', 15, 2)->default(0)->comment('Giá (VNĐ)');

            $table->json('image')->nullable()->comment('Ảnh đại diện');
            $table->json('images')->nullable()->comment('Thư viện ảnh');
            $table->json('fit_vehicles')->nullable()->comment('Danh sách xe tương thích (JSON array of strings)');
            $table->json('features')->nullable()->comment('Tính năng nổi bật (JSON array of strings)');

            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);

            $table->unsignedBigInteger('created_by')->nullable()->index();
            $table->unsignedBigInteger('updated_by')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('accessory_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('accessory_id');
            $table->string('locale', 10)->index();

            $table->string('title', 255)->nullable();
            $table->string('slug', 255)->nullable();
            $table->text('description')->nullable();
            $table->text('compatibility_text')->nullable()->comment('Nội dung tab Tương thích');
            $table->text('safety_text')->nullable()->comment('Nội dung tab An toàn');
            $table->longText('product_desc_text')->nullable()->comment('Nội dung tab Mô tả sản phẩm');

            $table->addSeo();

            $table->unique(['accessory_id', 'locale']);
            $table->unique(['locale', 'slug']);
            $table->foreign('accessory_id')
                ->references('id')
                ->on('accessories')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accessory_translations');
        Schema::dropIfExists('accessories');
    }
};
