<?php

use Illuminate\Database\Migrations\Migration;
use Database\Seeders\RoleSeeder;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Clear Spatie permission cache
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Run the createPermissions method from RoleSeeder
        if (class_exists(RoleSeeder::class)) {
            RoleSeeder::createPermissions();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
