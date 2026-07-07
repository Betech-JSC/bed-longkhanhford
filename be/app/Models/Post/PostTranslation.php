<?php

namespace App\Models\Post;

use JamstackVietnam\Blog\Models\PostTranslation as BasePost;


class PostTranslation extends BasePost
{
    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LOCALE_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];
    public $fillable = [
        'slug',
        'locale',
        'status_locale',
        'title',
        'author',
        'description',
        'content',
        'sliders',

        'seo_meta_title',
        'seo_focus_keyword',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];
}
