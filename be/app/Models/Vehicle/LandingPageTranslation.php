<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;

class LandingPageTranslation extends BaseModel
{
    protected $table = 'landing_page_translations';

    public $timestamps = false;

    protected $fillable = [
        'title',
        'seo_meta_title',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];
}
