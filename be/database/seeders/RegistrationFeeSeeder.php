<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Region;
use App\Models\Vehicle\RegistrationFee;

class RegistrationFeeSeeder extends Seeder
{
    public function run()
    {
        $regions = Region::where('level', 1)->get();
        
        foreach ($regions as $region) {
            $taxPercent = 10.00;
            $plateFee = 1000000;
            
            $nameLower = mb_strtolower($region->name, 'UTF-8');
            if (str_contains($nameLower, 'hà nội') || str_contains($nameLower, 'hồ chí minh')) {
                $taxPercent = 12.00;
                $plateFee = 20000000;
            } elseif (str_contains($nameLower, 'hà tĩnh')) {
                $taxPercent = 11.00;
            } elseif (
                str_contains($nameLower, 'hải phòng') || 
                str_contains($nameLower, 'đà nẵng') || 
                str_contains($nameLower, 'cần thơ') || 
                str_contains($nameLower, 'quảng ninh') || 
                str_contains($nameLower, 'lào cai') || 
                str_contains($nameLower, 'cao bằng') || 
                str_contains($nameLower, 'lạng sơn') || 
                str_contains($nameLower, 'sơn la')
            ) {
                $taxPercent = 12.00;
            }

            RegistrationFee::updateOrCreate(
                ['region_id' => $region->id],
                [
                    'registration_tax_percent' => $taxPercent,
                    'license_plate_fee' => $plateFee,
                    'inspection_fee' => 340000,
                    'road_maintenance_fee' => 1560000,
                    'civil_insurance_fee' => 480700,
                    'service_fee' => 2000000,
                ]
            );
        }
    }
}
