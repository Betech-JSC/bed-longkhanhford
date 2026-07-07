<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenance_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255)->comment('Tên dòng xe (vd: Ranger, Fiesta)');
            $table->json('image')->nullable()->comment('Ảnh đại diện xe');
            $table->json('links')->nullable()->comment('Mảng các link tài liệu: [{label, url}]');
            $table->integer('sort_order')->default(0)->comment('Thứ tự sắp xếp');
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE')->comment('Trạng thái hiển thị');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenance_schedules');
    }
};
