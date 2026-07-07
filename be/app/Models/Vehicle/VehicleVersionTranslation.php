<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;

class VehicleVersionTranslation extends BaseModel
{
    protected $table = 'vehicle_version_translations';

    public $timestamps = false;

    protected $fillable = ['name'];
}
