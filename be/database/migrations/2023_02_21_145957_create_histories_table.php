<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\History;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('histories', function (Blueprint $table) {
            $table->id();
            $table->string('status', 30)->default(History::STATUS_ACTIVE);
            $table->integer('view_count')->default(0);
            $table->integer('position')->nullable();
            $table->integer('year')->nullable();
            $table->integer('staff_quantity')->nullable();
            $table->json('image')->nullable();
            $table->json('sliders')->nullable();

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
        Schema::dropIfExists('histories');
    }
};
