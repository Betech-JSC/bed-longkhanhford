<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;

class SalesConsultantTranslation extends BaseModel
{
    protected $table = 'sales_consultant_translations';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'slug',
        'job_title',
        'short_bio',
        'bio',
    ];
}
