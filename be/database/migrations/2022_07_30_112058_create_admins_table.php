<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use JamstackVietnam\Core\Models\Admin;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone')->unique()->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('status', 30)->default(Admin::STATUS_ACTIVE);

            $table->string('google2fa_secret')->nullable();
            $table->unsignedInteger('google2fa_ts')->default(0);

            $table->rememberToken();

            $table->timestamps();
            $table->softDeletes();

            $table->index('deleted_at', 'deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('admins');
    }
};
