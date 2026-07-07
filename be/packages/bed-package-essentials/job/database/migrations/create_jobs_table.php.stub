<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use JamstackVietnam\Job\Models\Job;

class CreateJobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('status', 30)->default(Job::STATUS_ACTIVE);
            $table->integer('view_count')->default(0);
            $table->integer('position')->nullable();
            $table->date('expected_time')->nullable();
            $table->date('published_at')->nullable();
            $table->integer('quantity')->nullable();

            $table->softDeletes();
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
        Schema::dropIfExists('jobs');
    }
}
