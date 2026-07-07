<?php

namespace JamstackVietnam\Agency\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Sluggable;

class AgencyTranslation extends BaseModel
{
    use HasFactory, Sluggable;

    public $timestamps = false;
    public $slugAttribute = 'title';

    public $fillable = [
        'agency_id',
        'locale',
        'title',
        'slug',
        'location',
        'full_address',
        'description',
        'content',
        'phones',
        'info',

        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    protected $casts = [
        'phones' => 'array',
        'info' => 'array'
    ];

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }
}
