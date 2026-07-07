<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Sluggable;

use League\Glide\Server;

class ServiceTranslation extends BaseModel
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
        'title_content',
        'content_by_tab',
        'benefits',
        'benefit_title',

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
        'content_by_tab' => 'array',
        'benefits' => 'array',
    ];

    public function service()
    {
        return $this->belongsTo(Server::class);
    }
}
