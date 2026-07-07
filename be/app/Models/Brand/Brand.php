<?php

namespace App\Models\Brand;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;

class Brand extends BaseModel
{
    use HasFactory, Translatable, SoftDeletes, Searchable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public $with = ['translations'];

    public $appends = ['url'];

    public $fillable = [
        'status',
        'position',
        'image',

        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public $translatedAttributes = [
        'locale',
        'title',
        'slug',
        'summary',
        'description',

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
        'image' => 'array'
    ];

    protected $searchable = [
        'columns' => [
            'brand_translations.title' => 10,
            'brand_translations.id' => 5,
        ],
        'joins' => [
            'brand_translations' => ['brand_translations.brand_id', 'brands.id'],
        ],
    ];

    public function rules()
    {
        return [
            'vi.title' => 'required|string|max:255'
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function transform()
    {
        return [
            'id' => $this->id,
            'slug' => $this->seo_slug ?? $this->slug,
            'url' => $this->url,
            'title' => $this->title,
            'image' => $this->getImageDetail()
        ];
    }

    public function transformDetails()
    {
        return [
            'id' => $this->id,
            'slug' => $this->seo_slug ?? $this->slug,
            'url' => $this->url,
            'title' => $this->title,
            'summary' => $this->summary,
            'description' => $this->description,
            'image' => $this->getImageDetail()
        ];
    }

    public function getImageDetail()
    {
        return [
            'url' => isset($this->image['path']) ? static_url($this->image['path']) : null,
            'alt' => $this->image['alt'] ?? $this->title,
        ];
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC')
            ->orderBy('id', 'desc');
    }

    public function getUrlAttribute(): array
    {
        $urls = [];

        if ($this->status == self::STATUS_ACTIVE) {
            foreach ($this->translations as $translation) {
                $routeName = "$translation->locale.products.show";
                if (\Illuminate\Support\Facades\Route::has($routeName)) {
                    $urls[strtoupper($translation->locale)] = route($routeName, [
                        'slug' => $translation->seo_slug ?? $translation->slug,
                    ]);
                } else {
                    $slug = $translation->seo_slug ?? $translation->slug;
                    if ($translation->locale === 'vi') {
                        $urls['VI'] = '/san-pham?brand=' . $slug;
                    } else {
                        $urls[strtoupper($translation->locale)] = '/en/products?brand=' . $slug;
                    }
                }
            }
        }
        return $urls;
    }

    public function getImageUrlAttribute()
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }
}
