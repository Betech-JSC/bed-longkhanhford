<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customer_handovers', function (Blueprint $table) {
            $table->id();
            $table->string('status')->default('ACTIVE');
            $table->integer('position_sort')->default(0);
            $table->json('image')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('customer_handover_translations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_handover_id');
            $table->string('locale');
            $table->string('title');

            $table->unique(['locale', 'customer_handover_id'], 'cust_handover_locale_unique');
            $table->foreign('customer_handover_id', 'cust_handover_trans_foreign')
                ->references('id')
                ->on('customer_handovers')
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
        Schema::dropIfExists('customer_handover_translations');
        Schema::dropIfExists('customer_handovers');
    }
};
