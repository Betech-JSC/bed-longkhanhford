<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id', 64)->unique()->index();
            $table->json('messages')->nullable();
            $table->string('lead_score', 20)->default('cold')->comment('hot, warm, cold');
            $table->json('contact_info')->nullable()->comment('Họ tên, SĐT, xe quan tâm...');
            $table->string('interested_vehicle')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->boolean('notified')->default(false)->comment('Đã gửi thông báo Telegram chưa');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_sessions');
    }
};
