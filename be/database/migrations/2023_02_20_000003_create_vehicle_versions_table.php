<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_versions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_id');
            $table->decimal('price', 15, 2)->default(0);
            $table->json('specs')->nullable()->comment('Detailed specifications (engine, power, transmission, etc.)');
            $table->json('image')->nullable()->comment('Version featured image');
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('vehicle_id')
                ->references('id')
                ->on('vehicles')
                ->onDelete('cascade');
        });

        Schema::create('vehicle_version_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_version_id');
            $table->string('locale', 10)->index();
            $table->string('name', 255)->nullable();

            $table->unique(['vehicle_version_id', 'locale'], 'uid_ver_trans_id_locale');
            $table->foreign('vehicle_version_id', 'fk_ver_trans_ver_id')
                ->references('id')
                ->on('vehicle_versions')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_version_translations');
        Schema::dropIfExists('vehicle_versions');
    }
};
