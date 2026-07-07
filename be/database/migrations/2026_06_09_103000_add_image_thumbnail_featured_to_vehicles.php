<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->json('image_thumbnail')->nullable()->after('image')
                ->comment('Thumbnail image with transparent/white background for listing cards');
            $table->json('image_featured')->nullable()->after('image_thumbnail')
                ->comment('Featured panoramic image for homepage popular vehicles slider');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['image_thumbnail', 'image_featured']);
        });
    }
};
