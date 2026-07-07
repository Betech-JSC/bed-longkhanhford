<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePolicyTranslationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('policy_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('policy_id');

            $table->string('title');
            $table->string('slug');
            $table->string('locale');

            $table->text('content')->nullable();

            $table->addSeo();

            $table->unique(['locale', 'policy_id']);
            $table->unique(['locale', 'slug']);
            $table->foreign('policy_id')
                ->references('id')
                ->on('policies')
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
        Schema::dropIfExists('policy_translations');
    }
}
