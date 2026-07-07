<?php

namespace JamstackVietnam\MetaPage\Models;
use JamstackVietnam\Core\Models\BaseModel;

class MetaPage extends BaseModel
{
    public $fillable = [
        'url',

        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',

        'inject_head',
        'inject_body_start',
        'inject_body_end'
    ];

    public $rules = [
        'url' => 'required',
    ];

    public function transform()
    {
        return [
            'id' => $this->id,
            'url' => $this->url,
            'seo_meta_title' => $this->seo_meta_title,
            'seo_slug' => $this->seo_slug,
            'seo_meta_description' => $this->seo_meta_description,
            'seo_meta_keywords' => $this->seo_meta_keywords,
            'seo_meta_robots' => $this->seo_meta_robots,
            'seo_canonical' => $this->seo_canonical,
            'seo_image' => $this->seo_image,
            'seo_schemas' => $this->seo_schemas,

            'inject_head' => $this->inject_head,
            'inject_body_start' => $this->inject_body_start,
            'inject_body_end' => $this->inject_body_end
        ];
    }

    public function transformDetails()
    {
        return $this->transform();
    }
}
