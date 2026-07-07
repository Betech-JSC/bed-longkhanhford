<?php

namespace JamstackVietnam\Project\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;
use \Illuminate\Support\Facades\Route;

class ProjectCategory extends BaseModel
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
        'status',
    ];

    public $translatedAttributes = [
        'project_id',
        'slug',
        'locale',
        'title',
        'description',
        'type',

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
            'position' => 'nullable|integer|min:0',
        ];
    }

    protected $searchable = [
        'columns' => [
            'project_category_translations.title' => 10,
            'project_category_translations.id' => 5,
            'project_category_translations.slug' => 2,
        ],
        'joins' => [
            'project_category_translations' => ['project_category_translations.project_category_id', 'project_categories.id'],
        ],
    ];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        $urls = [];
        $default_locale = config('app.locale');
        if ($this->is_active) {
            if (Route::has($default_locale . ".project_categories.show")) {
                foreach ($this->translations as $translation) {
                    $urls[strtoupper($translation->locale)] = route("$translation->locale.project_categories.show", [
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
            'description' => $this->description,
            'type' => $this->type,
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
