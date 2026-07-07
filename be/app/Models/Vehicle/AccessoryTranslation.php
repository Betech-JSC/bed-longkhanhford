<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Sluggable;

class AccessoryTranslation extends BaseModel
{
    use Sluggable;

    public $slugAttribute = 'title';

    protected $table = 'accessory_translations';

    public $timestamps = false;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'compatibility_text',
        'safety_text',
        'product_desc_text',
        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    public function accessory()
    {
        return $this->belongsTo(Accessory::class);
    }
}
