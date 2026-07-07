<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Sluggable;

class HistoryTranslation extends BaseModel
{
    use HasFactory, Sluggable;

    public $timestamps = false;
    public $slugAttribute = 'title';

    public $fillable = [
        'slug',
        'locale',
        'title',
        'description',
        'content',

        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    public function history()
    {
        return $this->belongsTo(History::class);
    }
}
