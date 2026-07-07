<?php

namespace App\Models\UsedVehicle;

use JamstackVietnam\Core\Models\BaseModel;
use App\Traits\Sluggable;

class UsedVehicleTranslation extends BaseModel
{
    use Sluggable;

    public $slugAttribute = 'title';

    protected $table = 'used_vehicle_translations';

    public $timestamps = false;

    protected $fillable = [
        'title',
        'slug',
        'tagline',
        'description',
        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];
}
