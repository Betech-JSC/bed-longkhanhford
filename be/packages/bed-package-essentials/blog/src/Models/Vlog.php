<?php
namespace JamstackVietnam\Blog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;
use \Illuminate\Support\Facades\Route;
use Illuminate\Database\Eloquent\Builder;
use JamstackVietnam\Tag\Models\Tag;

class Vlog extends BaseModel
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
        'published_at',
        'position',
        'view_count',
        'image',
        'time',

        'inject_head',
        'inject_body_start',
        'inject_body_end',

        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public $translatedAttributes = [
        'slug',
        'locale',
        'title',
        'description',
        'video_url',
        'video',

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
        'image' => 'array'
    ];

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
        ];
    }

    protected $searchable = [
        'columns' => [
            'vlog_translations.title' => 10,
            'vlog_translations.id' => 5,
            'vlog_translations.slug' => 5,
        ],
        'joins' => [
            'vlog_translations' => ['vlog_translations.vlog_id', 'vlogs.id'],
        ],
    ];

    protected $appends = ['url'];

    protected static function booted()
    {
        static::saving(function (self $model) {
            if (request()->route() === null) return;
            $model->published_at = request()->input('published_at') ?? now();
        });

        static::saved(function (self $model) {
            if (request()->route() === null) return;

            if (request()->has('tags')) {
                $model->saveTags($model);
            }
        });
    }

    public function saveTags($model)
    {
        $tags = array_column(request()->input('tags', []), 'id');
        $model->tags()->sync($tags, 'id');
    }

    public function tags()
    {
        return $this->belongsToMany(
            Tag::class,
            'vlog_ref_tags',
            'vlog_id',
            'tag_id'
        );
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        $default_locale = config('app.locale');

        if ($this->is_active) {
            if (Route::has($default_locale . ".vlogs.show")) {
                foreach ($this->translations as $translation) {
                    $urls[strtoupper($translation->locale)] = route("$translation->locale.vlogs.show", [
                        'slug' => $translation->seo_slug ?? $translation->slug,
                        'id' => $this->id,
                    ]);
                }
            }
        }
        return $urls;
    }

    public function scopeActive($query)
    {
        return $query->whereLocaleActive()
            ->where('status', self::STATUS_ACTIVE)
            ->where('published_at', '<=', now());
    }

    public function getIsActiveAttribute()
    {
        return $this->status === self::STATUS_ACTIVE &&
            $this->published_at <= now();
    }

    public function transform($conditions = ['tags' => false])
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'published_at' => $this->published_at,
            'description' => $this->description,
            'image' => $this->getImageDetail($this->image),
            'url' => $this->current_url,
            'time' =>$this->time,
        ];

        if (isset($conditions['tags']) && $conditions['tags']) {
            $data['tags'] = $this->getTags();
        }
        return $data;
    }

    public function transformDetails($conditions = ['tags' => false])
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'published_at' => $this->published_at,
            'description' => $this->description,
            'image' => $this->getImageDetail($this->image),
            'video' => $this->getImageDetail($this->video),
            'video_url' => $this->video_url,
            'url' => $this->current_url,
            'time' =>$this->time,
        ];

        if (isset($conditions['tags']) && $conditions['tags']) {
            $data['tags'] = $this->getTags();
        }
        return $data;
    }

    public function getImageDetail($image)
    {
        return [
            'url' => isset($image['path']) ? static_url($image['path']) : null,
            'alt' => $image['alt'] ?? $this->title,
        ];
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }

    public function getTags()
    {
        return $this->tags
            ->where('status', self::STATUS_ACTIVE)
            ->values()
            ->map(fn ($item) => $item->transform());
    }

    public function scopeOrderByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC');
    }

    public function getImageUrlAttribute()
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }
}
