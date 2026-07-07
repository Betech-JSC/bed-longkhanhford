<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use JamstackVietnam\Blog\Models\PostCategory;

class CreatePostCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('post_categories', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('parent_id')->nullable()->default(0);

            $table->json('image')->nullable();
            $table->text('icon')->nullable();
            $table->integer('position')->nullable();
            $table->integer('menu_position')->nullable();
            $table->string('status', 30)->default(PostCategory::STATUS_ACTIVE);

            $table->integer('view_count')->default(0);
            $table->addInjectCode();
            $table->addTimestamps();

            $table->index('parent_id', 'parent_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_categories');
    }
}
