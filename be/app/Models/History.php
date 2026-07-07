<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;

use \Illuminate\Support\Facades\Route;
use Illuminate\Database\Eloquent\Builder;
use JamstackVietnam\Agency\Models\Agency;

class History extends BaseModel
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
        'year',
        'staff_quantity',
        'image',
        'sliders',
        'view_count',

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
        'sliders' => 'array'
    ];

    public function rules()
    {
        return [
            'vi.title'     => 'required|string|max:255',
            'year'         => 'required|digits:4|integer|min:1900|max:' . (date('Y') + 1),
            'staff_quantity' => 'nullable|integer|min:0|max:999999'
        ];
    }

    protected $searchable = [
        'columns' => [
            'history_translations.title' => 10,
            'history_translations.id' => 5,
            'history_translations.slug' => 5,
        ],
        'joins' => [
            'history_translations' => ['history_translations.history_id', 'histories.id'],
        ],
    ];

    protected $appends = ['url'];

    protected static function booted()
    {
        static::saved(function (self $model) {
            if (request()->route() === null) return;
            $model->saveAgencies($model);
        });
    }

    public function saveAgencies($model)
    {
        $agencies = array_column(request()->input('agencies', []), 'id');
        $model->agencies()->sync($agencies, 'id');
    }

    public function getUrlAttribute(): array
    {
        $urls = [];

        if ($this->is_active) {
            foreach ($this->translations as $translation) {
                $urls[strtoupper($translation->locale)] = route("$translation->locale.histories.show", [
                    'slug' => $translation->seo_slug ?? $translation->slug,
                ]);
            }
        }
        return $urls;
    }

    public function agencies()
    {
        return $this->belongsToMany(
            Agency::class,
            'history_ref_agencies',
            'history_id',
            'agency_id'
        );
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function getIsActiveAttribute()
    {
        return $this->status === self::STATUS_ACTIVE && !empty($this->content);
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC')
            ->orderBy('year', 'desc')
            ->orderBy('id', 'desc');
    }

    public function scopeSortByYear($query)
    {
        return $query->orderBy('year', 'desc')
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
            'year' => $this->year,
            'staff_quantity' => $this->staff_quantity,
            'has_content' => empty($this->content) ? false : true
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
            'agencies' => $this->getAgencies(),
            'sliders' => $this->getSliderDetail(),
            'year' => $this->year,
            'staff_quantity' => $this->staff_quantity,
        ];
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

    public function getAgencies()
    {
        return $this->agencies
            ->where('status', self::STATUS_ACTIVE)
            ->values()->map(function ($agency) {
                return [
                    'title' => $agency['title'],
                    'phone' => $agency['info']['phone'],
                    'email' => $agency['info']['email'],
                    'location' => $agency['location'],
                    'link_google_map' => $agency['link_google_map'],
                    'code' => $agency['code'],
                ];
            });
    }

    public function getImageUrlAttribute()
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }
}
