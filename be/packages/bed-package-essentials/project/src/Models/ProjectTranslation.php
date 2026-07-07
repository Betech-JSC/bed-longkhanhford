<?php

namespace JamstackVietnam\Project\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Sluggable;

class ProjectTranslation extends BaseModel
{
    use HasFactory, Sluggable;

    public $timestamps = false;
    public $slugAttribute = 'title';

    public $fillable = [
        'project_id',
        'slug',
        'locale',
        'title',
        'description',
        'content',
        'type',
        'progress',
        'used',
        'location',
        'detail',

        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
