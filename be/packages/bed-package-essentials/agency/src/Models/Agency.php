<?php

namespace JamstackVietnam\Agency\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;
use Illuminate\Database\Eloquent\Builder;
use \Illuminate\Support\Facades\Route;

class Agency extends BaseModel
{
    use HasFactory, SoftDeletes, Translatable, Searchable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public $with = ['translations'];

    public $fillable = [
        'position',
        'is_headquarter',
        'is_featured',
        'status',
        'link_google_map',
        'longitude',
        'latitude',
        'region',
        'image',
        'images',
        'province_id',
        'district_id',
        'ward_id',
        'code',
    ];

    public $translatedAttributes = [
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
        'image' => 'array',
        'images' => 'array',
    ];

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'location' => 'required',
            'longitude' => 'nullable|numeric|min:-180|max:180',
            'latitude' => 'nullable|numeric|min:-90|max:90',
            'position' => 'nullable|integer|min:0',
        ];
    }

    protected $searchable = [
        'columns' => [
            'agency_translations.title' => 10,
            'agency_translations.locale' => 10,
            'agency_translations.id' => 1,
        ],
        'joins' => [
            'agency_translations' => ['agency_translations.agency_id', 'agencies.id'],
        ],
    ];

    protected $appends = ['url'];

    protected static function booted()
    {
        static::saved(function (self $model) {
            if (request()->route() === null) return;

            if ($model->status == self::STATUS_ACTIVE && $model->is_headquarter) {
                self::active()
                    ->where('is_headquarter', true)
                    ->where('id', '<>', $model->id)
                    ->update(['is_headquarter' => false]);
            }
        });
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        $default_locale = config('app.locale');

        if ($this->is_active) {
            if (Route::has($default_locale . ".agencies.show")) {
                foreach ($this->translations as $translation) {
                    $urls[strtoupper($translation->locale)] = route("$translation->locale.agencies.show", [
                        'slug' => $translation->seo_slug ?? $translation->slug
                    ]);
                }
            }
        }

        return $urls;
    }

    public function scopeActive($query)
    {
        return $query->whereLocaleActive()->where('status', self::STATUS_ACTIVE);
    }

    public function getIsActiveAttribute()
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    public function transform()
    {
        return [
            'title' => $this->title,
            'location' => $this->location,
            'phones' => $this->phones,
            'longitude' => $this->longitude,
            'full_address' => $this->full_address,
            'latitude' => $this->latitude,
            'link_google_map' => $this->link_google_map,
            'province_id' => $this->province_id,
            'district_id' => $this->district_id,
            'ward_id' => $this->ward_id,
            'code' => $this->code,
            'is_headquarter' => $this->is_headquarter,
            'image' => [
                'url' => isset($this->image['path']) ? static_url($this->image['path']) : null,
                'alt' => $this->image['alt'] ?? $this->title,
            ],
            'url' => $this->current_url
        ];
    }

    public function transformDetails()
    {
        return [
            'title' => $this->title,
            'location' => $this->location,
            'full_address' => $this->full_address,
            'phones' => $this->phones,
            'longitude' => $this->longitude,
            'latitude' => $this->latitude,
            'link_google_map' => $this->link_google_map,
            'description' => $this->description,
            'content' => transform_richtext($this->content),
            'info' => $this->info,
            'region' => $this->region,
            'province_id' => $this->province_id,
            'district_id' => $this->district_id,
            'ward_id' => $this->ward_id,
            'code' => $this->code,
            'is_headquarter' => $this->is_headquarter,
            'image' => [
                'url' => isset($this->image['path']) ? static_url($this->image['path']) : null,
                'alt' => $this->image['alt'] ?? $this->title,
            ],
            'images' => collect($this->images)
                ->map(function ($item) {
                    return [
                        'url' => static_url($item['path']) ?? null,
                        'alt' => $item['alt'] ?? $this->title
                    ];
                }),
            'url' => $this->current_url
        ];
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC')
            ->orderBy('id', 'desc');
    }

    public function scopeFilter(Builder $query, array $filters = []): Builder
    {
        $query->when($filters['province_id'] ?? false, function (Builder $query, $value) {
            $query->where('province_id', $value);
        });

        $query->when($filters['district_id'] ?? false, function (Builder $query, $value) {
            $query->where('district_id', $value);
        });

        $query->when($filters['ward_id'] ?? false, function (Builder $query, $value) {
            $query->where('ward_id', $value);
        });

        $query->when($filters['keyword'] ?? false, function (Builder $query, $keyword) {
            $query->search($keyword);
        });

        $query->when($filters['limit'] ?? false, function (Builder $query, $value) {
            $query->take($value);
        });

        return $query;
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }
}
