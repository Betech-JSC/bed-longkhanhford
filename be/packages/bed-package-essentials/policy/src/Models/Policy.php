<?php

namespace JamstackVietnam\Policy\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;
use \Illuminate\Support\Facades\Route;

class Policy extends BaseModel
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
        'icon',
        'status',
    ];

    public $translatedAttributes = [
        'slug',
        'locale',
        'title',
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

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required',
            'position' => 'nullable|integer|min:0',
        ];
    }

    protected $searchable = [
        'columns' => [
            'policy_translations.title' => 10,
            'policy_translations.id' => 5,
            'policy_translations.slug' => 2,
        ],
        'joins' => [
            'policy_translations' => ['policy_translations.policy_id', 'policies.id'],
        ],
    ];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        $urls = [];
        $default_locale = config('app.locale');
        if ($this->is_active) {
            if (Route::has($default_locale . ".policies.show")) {
                foreach ($this->translations as $translation) {
                    $urls[strtoupper($translation->locale)] = route("$translation->locale.policies.show", [
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
            'slug' => $this->seo_slug ?? $this->slug,
            'content' => transform_richtext($this->content),
            'icon' => $this->icon,
            'formatted_updated_at' => $this->formatted_updated_at,
            'url' => $this->current_url
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
}
