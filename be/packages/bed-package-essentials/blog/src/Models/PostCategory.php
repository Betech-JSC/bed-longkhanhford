<?php

namespace JamstackVietnam\Blog\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use JamstackVietnam\Core\Models\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;
use Illuminate\Database\Eloquent\Builder;
use \Illuminate\Support\Facades\Route;

class PostCategory extends BaseModel
{
    use HasFactory, Translatable, SoftDeletes, Searchable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public $with = ['translations'];

    protected $appends = ['url'];

    public $fillable = [
        'parent_id',
        'status',
        'position',
        'menu_position',
        'view_count',
        'image',
        'icon'
    ];

    public $translatedAttributes = [
        'slug',
        'locale',
        'title',
        'sliders',

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
    ];

    protected $searchable = [
        'columns' => [
            'post_category_translations.title' => 10,
            'post_category_translations.id' => 5,
            'post_category_translations.slug' => 5,
        ],
        'joins' => [
            'post_category_translations' => [
                'post_category_translations.post_category_id',
                'post_categories.id'
            ],
        ],
    ];

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'position' => 'nullable|integer|min:0',
        ];
    }

    protected static function booted()
    {
        static::saving(function (self $model) {
            if (request()->route() === null) return;
            $model->view_count = request()->input('view_count', 0);
        });
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id', 'id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public static function getRoot()
    {
        return static::orderBy('position', 'desc')
            ->with(['nodes'])
            ->orderBy('parent_id')
            ->where(function ($query) {
                $query->whereNull('parent_id')->orWhere('parent_id', 0);
            })
            ->get();
    }

    public static function getParentNodes()
    {
        return static::whereNull('parent_id')->orWhere('parent_id', 0)->get();
    }

    public static function getNav()
    {
        return static::query()
            ->active()
            ->with('children.children')
            ->where('parent_id', 0)
            ->get();
    }

    public function nodes()
    {
        return $this->children()
            ->with('nodes')
            ->orderBy('parent_id')
            ->orderBy('id', 'desc');
    }

    public function parentNode()
    {
        return $this->parent()->with('parentNode');
    }

    public function scopeActive($query)
    {
        return $query->whereLocaleActive()->where('status', self::STATUS_ACTIVE);
    }

    public static function transformAsBreadcrumb($category)
    {
        if ($category) {
            return collect(self::flatAncestors($category))
                ->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'title' => $item->title,
                        'slug' => $item->seo_slug ?? $item->slug,
                    ];
                })
                ->reverse()->values();
        }
        return collect([]);
    }

    public static function flatAncestors($model): array
    {
        if (!$model) return [];

        $result[] = $model;
        if (!empty($model->parentNode)) {
            $result = array_merge($result, self::flatAncestors($model->parentNode));
        }

        return $result;
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        $default_locale = config('app.locale');

        if ($this->status == self::STATUS_ACTIVE) {
            if (Route::has($default_locale . ".posts.category")) {
                foreach ($this->translations as $translation) {
                    $urls[strtoupper($translation->locale)] = route("$translation->locale.posts.category", [
                        'slug' => $translation->seo_slug ?? $translation->slug,
                    ]);
                }
            }
        }
        return $urls;
    }
    public function posts()
    {
        return $this->belongsToMany(
            Post::class,
            'post_ref_categories',
            'post_category_id',
            'post_id'
        );
    }

    public function transformNav($level = 1, $conditions = ['show_active' => false, 'categories' => []]): array
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
        ];

        if (isset($conditions['show_active']) && $conditions['show_active']) {
            if (isset($conditions['categories'])) {
                $category = $conditions['categories']->where('id', $this->id)->values()->first();

                $data['is_active'] = $category ? true : false;
                if ($level <= 2) {
                    $data['nodes'] = $this->nodes->map(fn ($item) => $item->transformNav($level + 1, ['show_active' => true, 'categories' => $conditions['categories']]));
                }
            } else {
                $data['is_active'] = false;
            }
        } else if ($level <= 2) {
            $data['nodes'] = $this->nodes->map(fn ($item) => $item->transformNav($level + 1));
        }

        return $data;
    }

    public function transform($conditions = ['post_count' => 0])
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'image' => $this->getImageDetail(),
            'icon' => $this->icon,
            'url' => $this->current_url
        ];

        if (isset($conditions['post_count']) && $conditions['post_count'] > 0) {
            $data['posts'] = $this->posts
                ->where('status', Post::STATUS_ACTIVE)
                ->sortBy([['is_featured', 'desc'], ['id', 'desc']])
                ->values()
                ->take($conditions['post_count'])
                ->map(fn ($item) => $item->transform());
        }

        return $data;
    }

    public function transformDetails()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'breadcrumbs' => self::transformAsBreadcrumb($this),
            'image' => $this->getImageDetail(),
            'url' => $this->current_url
        ];
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }

    public function getImageDetail()
    {
        return [
            'url' => isset($this->image['path']) ? static_url($this->image['path']) : null,
            'alt' => $this->image['alt'] ?? $this->title,
        ];
    }

    public function scopeWithPosts($query, $limit)
    {
        return $query->with('posts')
            ->whereHas('posts', function ($query) use ($limit) {
                $query->active()->limit($limit);
            });
    }

    public function scopeOrderByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC');
    }

    public function scopeFilter(Builder $query, array $filters = []): Builder
    {
        $query->orderByPosition()
            ->orderBy('id', 'desc');

        $query->orderBy('id', 'desc');

        $query->when($filters['limit'] ?? false, function (Builder $query, $value) {
            $query->take($value);
        });

        return $query;
    }

    public function getImageUrlAttribute()
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }
}
