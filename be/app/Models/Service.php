<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;

class Service extends BaseModel
{
    use HasFactory, SoftDeletes, Searchable, Translatable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public $with = ['translations'];

    public $fillable = [
        'status',
        'position',
        'view_count',
        'image',
        'banner_image',
        'benefit_image',
        'sliders',
        'is_content_by_tab',
        'email',
        'custom_link',

        'inject_head',
        'inject_body_start',
        'inject_body_end',
    ];

    public $translatedAttributes = [
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
        'seo_focus_keyword',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    protected $casts = [
        'image' => 'array',
        'banner_image' => 'array',
        'benefit_image' => 'array',
        'sliders' => 'array'
    ];

    public function rules()
    {
        return [
            'vi.title' => 'required|string|max:255',
        ];
    }

    protected $searchable = [
        'columns' => [
            'service_translations.title' => 10,
            'service_translations.id' => 5,
            'service_translations.slug' => 5,
        ],
        'joins' => [
            'service_translations' => ['service_translations.service_id', 'services.id'],
        ],
    ];

    protected $appends = ['url'];

    public function getUrlAttribute(): array
    {
        $urls = [];

        if ($this->is_active) {
            foreach ($this->translations as $translation) {
                $urls[strtoupper($translation->locale)] = route("$translation->locale.services.show", [
                    'slug' => $translation->seo_slug ?? $translation->slug,
                ]);
            }
        }
        return $urls;
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function getIsActiveAttribute()
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC')
            ->orderBy('id', 'desc');
    }

    public function transform()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'description' => $this->description,
            'image' => $this->getImageDetail($this->image),
            'custom_link' => $this->custom_link,
        ];
    }

    public function transformDetails()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'description' => $this->description,
            'content' => transform_richtext($this->content),
            'custom_link' => $this->custom_link,
            'image' => $this->getImageDetail($this->image),
            'banner_image' => $this->getImageDetail($this->banner_image),
            'is_content_by_tab' => $this->is_content_by_tab == true || $this->is_content_by_tab == 1,
            'content_by_tab' => $this->getTabContent(),
            'benefit_title' => $this->benefit_title,
            'benefit_image' => $this->getImageDetail($this->benefit_image),
            'benefits' => $this->benefits,
            'sliders' => $this->getSliderDetail(),
        ];
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }

    public function getImageDetail($image)
    {
        return [
            'url' => isset($image['path']) ? static_url($image['path']) : null,
            'alt' => $image['alt'] ?? $this->title,
        ];
    }

    public function getSliderDetail()
    {
        return collect($this->sliders)
            ->map(function ($item) {
                return [
                    'url' => static_url($item['path']) ?? null,
                    'alt' => $item['alt'] ?? $this->title
                ];
            });
    }

    public function getTabContent()
    {
        return collect($this->content_by_tab)
            ->map(function ($item) {
                return [
                    'content' => transform_richtext($item['content'] ?? null),
                    'title_content' => $item['title_content'] ?? null,
                    'title' => $item['title'] ?? null
                ];
            });
    }

    public function getImageUrlAttribute()
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }
}
