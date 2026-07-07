<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Models\Region;

class RegistrationFee extends BaseModel
{
    protected $table = 'registration_fees';

    protected $fillable = [
        'region_id',
        'registration_tax_percent',
        'license_plate_fee',
        'inspection_fee',
        'road_maintenance_fee',
        'civil_insurance_fee',
        'service_fee',
    ];

    protected $casts = [
        'registration_tax_percent' => 'decimal:2',
        'license_plate_fee'        => 'decimal:2',
        'inspection_fee'           => 'decimal:2',
        'road_maintenance_fee'     => 'decimal:2',
        'civil_insurance_fee'      => 'decimal:2',
        'service_fee'              => 'decimal:2',
    ];

    public function rules(): array
    {
        return [
            'region_id'                => 'required|exists:regions,id|unique:registration_fees,region_id,' . ($this->id ?? 'NULL'),
            'registration_tax_percent' => 'required|numeric|min:0|max:100',
            'license_plate_fee'        => 'required|numeric|min:0',
            'inspection_fee'           => 'required|numeric|min:0',
            'road_maintenance_fee'     => 'required|numeric|min:0',
            'civil_insurance_fee'      => 'required|numeric|min:0',
            'service_fee'              => 'nullable|numeric|min:0',
        ];
    }

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id');
    }
}
