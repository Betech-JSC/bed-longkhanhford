<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Service;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('status', 30)->default(Service::STATUS_ACTIVE);
            $table->integer('position')->nullable();
            $table->json('image')->nullable();
            $table->json('benefit_image')->nullable();
            $table->json('sliders')->nullable();
            $table->integer('view_count')->default(0);
            $table->boolean('is_content_by_tab')->default(0);
            $table->string('email')->nullable();

            $table->softDeletes();
            $table->addInjectCode();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('services');
    }
};
