<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            RoleSeeder::class,
            RegionSeeder::class,
            VehicleTestSeeder::class,
            RegistrationFeeSeeder::class,
            PostNewsSeeder::class,
            ServiceAgencyJobSeeder::class,
            AccessoryAndBrandSeeder::class,
            MaintenanceScheduleSeeder::class,
            CustomerHandoverSeeder::class,
        ]);
    }
}
