<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateJobTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('job_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('job_id');

            $table->string('title');
            $table->string('slug');
            $table->string('locale');

            $table->string('working_position')->nullable();
            $table->string('work_address')->nullable();
            $table->string('working_time')->nullable();
            $table->text('description')->nullable();
            $table->longText('content')->nullable();

            $table->addSeo();

            $table->unique(['locale', 'job_id']);
            $table->unique(['locale', 'slug']);
            $table->foreign('job_id')
                ->references('id')
                ->on('jobs')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('job_translations');
    }
}
