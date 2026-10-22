<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Sluggable;

class SalesConsultantTranslation extends BaseModel
{
    use Sluggable;

    protected $table = 'sales_consultant_translations';

    public $timestamps = false;
    public $slugAttribute = 'name';

    protected $fillable = [
        'name',
        'slug',
        'job_title',
        'short_bio',
        'bio',
    ];
}
