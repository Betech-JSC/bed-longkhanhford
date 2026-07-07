<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registration_fees', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('region_id')->unique();
            $table->decimal('registration_tax_percent', 5, 2)->default(10.00);
            $table->decimal('license_plate_fee', 15, 2)->default(1000000);
            $table->decimal('inspection_fee', 15, 2)->default(340000);
            $table->decimal('road_maintenance_fee', 15, 2)->default(1560000);
            $table->decimal('civil_insurance_fee', 15, 2)->default(480700);
            $table->decimal('service_fee', 15, 2)->default(0);
            $table->timestamps();

            $table->foreign('region_id')
                ->references('id')
                ->on('regions')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registration_fees');
    }
};
