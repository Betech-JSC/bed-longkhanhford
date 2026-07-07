<?php

namespace JamstackVietnam\Tag\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;
use \Illuminate\Support\Facades\Route;

class Tag extends BaseModel
{
    use HasFactory, Translatable, SoftDeletes, Searchable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const TYPE_BLOG = 'BLOG';
    public const TYPE_VLOG = 'VLOG';
    public const TYPE_JOB = 'JOB';
    public const TYPE_PRODUCT = 'PRODUCT';

    public const TYPE_LIST = [
        self::TYPE_BLOG => 'Bài viết',
        self::TYPE_VLOG => 'Vlog',
        self::TYPE_JOB => 'Tuyển dụng',
        self::TYPE_PRODUCT => 'Sản phẩm',
    ];

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public $with = ['translations'];

    protected $appends = ['url'];

    public $fillable = [
        'status',
        'position',
        'text_color',
        'background_color',
        'type',
        'icon',
        'value',
        'view_count'
    ];

    public $translatedAttributes = [
        'locale',
        'title',
        'slug',
        'description',
        'image',

        'seo_meta_title',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    protected $searchable = [
        'columns' => [
            'tag_translations.title' => 10,
            'tag_translations.id' => 5,
        ],
        'joins' => [
            'tag_translations' => ['tag_translations.tag_id', 'tags.id'],
        ],
    ];

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'text_color' => [
                'nullable',
                'regex:/^(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s\/]*[\d\.]+%?\))$/i',
            ],
            'background_color' => [
                'nullable',
                'regex:/^(#(?:[0-9a-f]{2}){2,4}|#[0-9a-f]{3}\((?:\d+%?(?:deg|rad|grad|turn)?(?:,|\s)+){2,3}[\s\/]*[\d\.]+%?\))$/i',
            ],
        ];
    }

    public static function getBlogs()
    {
        return static::whereBlog()
            ->sortByPosition()
            ->get();
    }

    public static function getVlogs()
    {
        return static::whereVlog()
            ->sortByPosition()
            ->get();
    }

    public static function getJobs()
    {
        return static::whereJob()
            ->sortByPosition()
            ->get();
    }

    public static function getProducts()
    {
        return static::whereProduct()
            ->sortByPosition()
            ->get();
    }

    public function transform()
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'icon' => $this->icon,
            'text_color' => $this->text_color,
            'background_color' => $this->background_color,
            'type' => $this->type,
            'value' => $this->value,
            'image' => $this->getImageDetail($this->image),
            'url' => $this->current_url
        ];
    }

    public function transformDetails()
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'icon' => $this->icon,
            'text_color' => $this->text_color,
            'background_color' => $this->background_color,
            'type' => $this->type,
            'description' => $this->description,
            'value' => $this->value,
            'image' => $this->getImageDetail($this->image),
            'url' => $this->current_url
        ];
    }

    public function getImageDetail($image)
    {
        return [
            'url' => isset($image['path']) ? static_url($image['path']) : null,
            'alt' => $image['alt'] ?? $this->title,
        ];
    }

    public function scopeWhereBlog($query)
    {
        return $query->where('type', self::TYPE_BLOG);
    }

    public function scopeWhereVlog($query)
    {
        return $query->where('type', self::TYPE_VLOG);
    }

    public function scopeWhereJob($query)
    {
        return $query->where('type', self::TYPE_JOB);
    }

    public function scopeWhereProduct($query)
    {
        return $query->where('type', self::TYPE_PRODUCT);
    }

    public function scopeWhereInTypes($query, $types)
    {
        return $query->whereIn('type', $types);
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC')
            ->orderBy('id', 'desc');
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        $default_locale = config('app.locale');

        if ($this->is_active) {
            if (Route::has($default_locale . ".post_tags.show") && $this->type == self::TYPE_BLOG) {
                foreach ($this->translations as $translation) {
                    $urls[strtoupper($translation->locale)] = route("$translation->locale.post_tags.show", [
                        'slug' => $translation->seo_slug ?? $translation->slug,
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
}
