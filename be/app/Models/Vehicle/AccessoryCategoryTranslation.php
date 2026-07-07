<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Sluggable;

class AccessoryCategoryTranslation extends BaseModel
{
    use Sluggable;

    public $slugAttribute = 'title';

    protected $table = 'accessory_category_translations';
    
    public $timestamps = false;
    
    protected $fillable = [
        'title',
        'slug',
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
