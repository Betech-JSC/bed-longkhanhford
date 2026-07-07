<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->string('name', 255)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('email', 255)->nullable();
            
            $table->unsignedBigInteger('region_id')->nullable();
            $table->unsignedBigInteger('vehicle_id')->nullable();
            $table->unsignedBigInteger('vehicle_version_id')->nullable();
            
            $table->decimal('loan_amount', 15, 2)->nullable();
            $table->integer('loan_duration')->nullable()->comment('Vay trong bao nhiêu tháng');
            $table->text('note')->nullable();

            $table->json('data')->nullable();
            $table->string('status')->default('NEW');
            $table->string('type', 30)->nullable()->comment('contact, test_drive, rolling_cost, loan_estimate');

            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('request_url')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('region_id')
                ->references('id')
                ->on('regions')
                ->onDelete('set null');
                
            $table->foreign('vehicle_id')
                ->references('id')
                ->on('vehicles')
                ->onDelete('set null');
                
            $table->foreign('vehicle_version_id')
                ->references('id')
                ->on('vehicle_versions')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contacts');
    }
}
