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

class Post extends BaseModel
{
    use HasFactory, SoftDeletes, Searchable, Translatable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public $with = ['translations', 'categories'];

    public $fillable = [
        'status',
        'published_at',
        'is_home',
        'is_featured',
        'position',
        'home_position',
        'footer_position',
        'view_count',
        'image',
        'banner',
        'banner_mobile',
        'show_table_of_contents',

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
        'author',
        'description',
        'content',
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
        'banner' => 'array',
        'banner_mobile' => 'array'
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
            'post_translations.title' => 10,
            'post_translations.id' => 5,
            'post_translations.slug' => 5,
        ],
        'joins' => [
            'post_translations' => ['post_translations.post_id', 'posts.id'],
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
            $model->saveRelatedPosts($model);
            $model->saveCategories($model);
        });
    }

    public function saveTags($model)
    {
        $tags = array_column(request()->input('tags', []), 'id');
        $model->tags()->sync($tags, 'id');
    }

    public function saveCategories($model)
    {
        $categories = array_column(request()->input('categories', []), 'id');
        $model->categories()->sync($categories, 'id');
    }

    public function saveRelatedPosts($model)
    {
        $relatedPosts = array_column(request()->input('related_posts', []), 'id');
        $model->relatedPosts()->sync($relatedPosts, 'id');
    }

    public function categories()
    {
        return $this->belongsToMany(
            PostCategory::class,
            'post_ref_categories',
            'post_id',
            'post_category_id'
        );
    }

    public function tags()
    {
        return $this->belongsToMany(
            Tag::class,
            'post_ref_tags',
            'post_id',
            'tag_id'
        );
    }

    public function relatedPosts()
    {
        return $this->belongsToMany(
            self::class,
            'related_posts',
            'post_id',
            'related_post_id'
        );
    }

    public function getPostRelatedIdsAttribute()
    {
        return $this->relatedPosts;
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        $default_locale = config('app.locale');

        if ($this->is_active) {
            if (Route::has($default_locale . ".posts.show")) {
                foreach ($this->translations as $translation) {
                    $urls[strtoupper($translation->locale)] = route("$translation->locale.posts.show", [
                        'slug' => $translation->seo_slug ?? $translation->slug,
                        'id' => $this->id,
                    ]);
                }
            } else if (Route::has($default_locale . ".nested_posts.show")) {
                $category = $this->categories
                    ->where('status', PostCategory::STATUS_ACTIVE)
                    ->values()
                    ->first();

                if ($category) {
                    foreach ($this->translations as $translation) {
                        $categoryTranslation = $category->translations->where(function ($item) use ($translation, $default_locale) {
                            return $item->locale === $translation->locale || $item->locale === $default_locale;
                        })
                            ->sortBy(fn($item) => $item['locale'] === $translation->locale ? 0 : 1)
                            ->first();

                        $urls[strtoupper($translation->locale)] = route("$translation->locale.nested_posts.show", [
                            'nested' => $categoryTranslation->seo_slug ?? $categoryTranslation->slug,
                            'slug' => $translation->seo_slug ?? $translation->slug,
                        ]);
                    }
                }
            }
        }
        return $urls;
    }

    public function getCategoryAttribute()
    {
        return $this->categories
            ->where('status', PostCategory::STATUS_ACTIVE)
            ->sortBy([['parent_id', 'desc']])
            ->values()
            ->first()?->transform();
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

    public function scopeActiveCategories($query)
    {
        return $query->whereHas('categories', function ($query) {
            $query->active();
        });
    }

    public function transform($conditions = ['categories' => false, 'tags' => false])
    {
        $categories = $this->categories
            ->where('status', self::STATUS_ACTIVE)
            ->values()
            ->map(fn($item) => $item->transform());

        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'published_at' => $this->published_at,
            'description' => $this->description,
            'category' => $this->category,
            'categories' => $categories,
            'image' => $this->getImageDetail($this->image),
            'url' => $this->current_url
        ];

        if (isset($conditions['categories']) && $conditions['categories']) {
            $data['categories'] = $this->categories
                ->where('status', self::STATUS_ACTIVE)
                ->values()
                ->map(fn($item) => $item->transform());
        }

        if (isset($conditions['tags']) && $conditions['tags']) {
            $data['tags'] = $this->getTags();
        }
        return $data;
    }

    public function transformDetails($conditions = ['tags' => false])
    {
        $categories = $this->categories
            ->where('status', self::STATUS_ACTIVE)
            ->values()
            ->map(fn($item) => $item->transform());

        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'author' => $this->author,
            'published_at' => $this->published_at,
            'description' => $this->description,
            'content' => transform_richtext($this->content),
            'category' => $this->category,
            'categories' => $categories,
            'breadcrumbs' => $this->getBreadcrumbsAttribute(),
            'image' => $this->getImageDetail($this->image),
            'banner' => $this->getImageDetail($this->banner),
            'banner_mobile' => $this->getImageDetail($this->banner_mobile),
            'show_table_of_contents' => $this->show_table_of_contents,
            'url' => $this->current_url
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

    public function getBreadcrumbsAttribute()
    {
        $category = $this->categories()
            ->with('parentNode')
            ->where('status', PostCategory::STATUS_ACTIVE)
            ->orderBy('parent_id', 'desc')
            ->first();

        return PostCategory::transformAsBreadcrumb($category);
    }

    public function getTags()
    {
        return $this->tags
            ->where('status', self::STATUS_ACTIVE)
            ->values()
            ->map(fn($item) => $item->transform());
    }

    public function related($condition = [])
    {
        $limit = empty($condition['limit']) ? 8 : $condition['limit'];

        $relatedPosts = $this->relatedPosts
            ->where('status', self::STATUS_ACTIVE);

        if (!empty($condition['has_category'])) {
            $relatedPosts = $relatedPosts->where(function ($collection) {
                return $collection->categories
                    ->where('status', self::STATUS_ACTIVE)
                    ->count() > 0;
            });
        }

        $relatedPosts = $relatedPosts->values()->take($limit);

        $relatedPostIds = [];

        if ($relatedPosts->count() > 0) {
            $relatedPostIds = $relatedPosts->pluck('id');
        }

        if (count($relatedPosts) < $limit) {
            $addPosts = self::query()
                ->active()
                ->when($this->category['id'] ?? false, function ($query) {
                    $query->whereHas('categories', function ($query) {
                        $query->where('post_categories.id', $this->category['id']);
                    });
                })
                ->where('id', '<>', $this->id)
                ->whereNotIn('id', $relatedPostIds)
                ->take($limit - count($relatedPosts))
                ->get();

            if (count($addPosts) > 0) {
                $relatedPosts = $relatedPosts->concat($addPosts);
            }
        }

        return $relatedPosts->map(fn($item) => $item->transform());
    }

    public function scopeOrderByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC');
    }

    public function scopeOrderByHomePosition($query)
    {
        return $query->orderByRaw('ISNULL(home_position) OR home_position = 0, home_position ASC');
    }

    public function scopeOrderByFooterPosition($query)
    {
        return $query->orderByRaw('ISNULL(footer_position) OR footer_position = 0, footer_position ASC');
    }

    public function scopeWhereFooter($query)
    {
        return $query->where(function ($query) {
            $query->whereNotNull('footer_position')->where('footer_position', '>', 0);
        })
            ->orderByFooterPosition()
            ->orderBy('id', 'desc');
    }

    public function scopeFilter(Builder $query, array $filters = []): Builder
    {
        $query->when($filters['tag'] ?? false, function (Builder $query, $value) {
            $query->whereHas('categories', function ($query) use ($value) {
                $query->whereHas('translations', function ($query) use ($value) {
                    $query->whereSlug($value);
                });
            });
        });

        $query->when($filters['sort'] ?? 'default', function (Builder $query, $value) {
            switch ($value) {
                case 'position':
                    $query->orderByPosition();
                    break;
                case 'home_position':
                    $query->orderByHomePosition();
                    break;
                default:
                    $query->orderBy('published_at', 'desc');
                    break;
            }
        });

        $query->orderBy('id', 'desc');

        $query->when($filters['keyword'] ?? false, function (Builder $query, $keyword) {
            $query->search($keyword);
        });

        $query->when($filters['limit'] ?? false, function (Builder $query, $value) {
            $query->take($value);
        });

        $query->when($filters['limit'] ?? false && !$filters['paginate'] ?? true, function (Builder $query, $value) {
            $query->take($value);
        });

        return $query;
    }

    public function getImageUrlAttribute()
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }
}
