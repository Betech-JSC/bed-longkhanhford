<?php

namespace JamstackVietnam\Job\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;
use \Illuminate\Support\Facades\Route;
use JamstackVietnam\Tag\Models\Tag;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

class Job extends BaseModel
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
        'expected_time',
        'published_at',
        'quantity',
        'status',
        'view_count'
    ];

    public $translatedAttributes = [
        'slug',
        'locale',
        'title',
        'description',
        'content',
        'working_position',
        'work_address',
        'working_time',

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
        ];
    }

    protected $searchable = [
        'columns' => [
            'job_translations.title' => 10,
            'job_translations.id' => 5,
            'job_translations.slug' => 2,
        ],
        'joins' => [
            'job_translations' => ['job_translations.job_id', 'jobs.id'],
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

            if (request()->has('related_jobs')) {
                $model->saveRelateJobs($model);
            }

            if (request()->has('tags')) {
                $model->saveTags($model);
            }

            if (request()->has('list_option_cover')) {
                $model->saveOptions($model);
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
            'job_ref_tags',
            'job_id',
            'tag_id'
        );
    }

    public function options()
    {
        return $this->belongsToMany(
            JobOption::class,
            'job_ref_options',
            'job_id',
            'option_id',
        )
            ->withPivot('position', 'is_required')
            ->orderBy('is_required', 'DESC')
            ->orderBy('position', 'DESC');
    }

    public function saveRelateJobs($model)
    {
        $relatedJobs = array_column(request()->input('related_jobs', []), 'id');
        $model->relatedJobs()->sync($relatedJobs, 'id');
    }

    public function relatedJobs()
    {
        return $this->belongsToMany(
            self::class,
            'related_jobs',
            'job_id',
            'related_job_id'
        );
    }

    private function saveOptions($model)
    {
        $parents = collect(request()->input('list_option_cover', []))
            ->filter(fn ($item) => !empty($item['id']) && !empty($item['nodes']));
        $children = $parents->pluck('nodes')->flatten(1);

        $refs = JobRefOption::query()
            ->where('job_id', $model->id)
            ->pluck('option_id');

        $ids = $refs->diff($children->pluck('id'));

        if ($ids->isNotEmpty()) {
            JobRefOption::query()
                ->where('job_id', $model->id)
                ->whereIn('option_id', $ids->toArray())
                ->delete();
        }

        self::withoutEvents(function () use ($model, $parents, $children) {
            foreach ($parents as $parent) {
                JobRefOption::create([
                    'option_id' => $parent['id'],
                    'job_id' => $model->id,
                    'position' => $parent['position'] ?? 0,
                    'is_required' => $parent['is_required'] ?? false
                ]);
            }
            foreach ($children as $child) {
                JobRefOption::firstOrCreate([
                    'option_id' => $child['id'],
                    'job_id' => $model->id
                ]);
            }
        });
    }

    public function jobOptions()
    {
        return $this->options()->where('job_options.parent_id', 0);
    }

    public function childrenOptions()
    {
        return $this->options()->where('job_options.parent_id', '!=', 0);
    }

    public function getListOptionCoverAttribute()
    {
        $listOptions = JobOption::transformNested($this->jobOptions, $this->childrenOptions);

        $listOptions = $listOptions->map(function ($item) {
            $option = $this->jobOptions
                ->where('id', $item['id'])
                ->first();

            $item['id'] = strval($item['id']);
            $item['is_required'] = $option['pivot']['is_required'] ?? false;
            $item['position'] = $option['pivot']['position'] ?? 0;
            $item['nodes'] = collect($item['nodes'])->map(function ($value) {
                $value['id'] = strval($value['id']);
                return $value;
            });

            return $item;
        });

        return $listOptions;
    }

    public function getUrlAttribute()
    {
        $urls = [];
        $default_locale = config('app.locale');
        if ($this->is_active) {
            if (Route::has($default_locale . ".jobs.show")) {
                foreach ($this->translations as $translation) {
                    $urls[strtoupper($translation->locale)] = route("$translation->locale.jobs.show", [
                        'slug' => $translation->seo_slug ?? $translation->slug
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
            ->where('published_at', '<=', now())
            ->where(function ($query) {
                $query->whereNull('expected_time')
                    ->orWhereDate('expected_time', '>=', Carbon::today());
            });
    }

    public function getIsActiveAttribute()
    {
        return $this->status === self::STATUS_ACTIVE
            && $this->published_at <= now()
            && ($this->expected_time == null || $this->expected_time >= date('Y-m-d'));
    }

    public function transform($conditions = ['tags' => false, 'options' => false])
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'description' => $this->description,
            'working_position' => $this->working_position,
            'work_address' => $this->work_address,
            'working_time' => $this->working_time,
            'expected_time' => $this->expected_time,
            'quantity' => $this->quantity,
            'url' => $this->current_url
        ];

        if (isset($conditions['tags']) && $conditions['tags']) {
            $data['tags'] = $this->getTags();
        }

        if (isset($conditions['options']) && $conditions['options']) {
            $data['options'] = $this->getOptions();
        }
        return $data;
    }

    public function transformDetails($conditions = ['tags' => false, 'options' => false])
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->seo_slug ?? $this->slug,
            'description' => $this->description,
            'content' => transform_richtext($this->content),
            'working_position' => $this->working_position,
            'work_address' => $this->work_address,
            'working_time' => $this->working_time,
            'expected_time' => $this->expected_time,
            'published_at' => $this->published_at,
            'quantity' => $this->quantity,
            'url' => $this->current_url
        ];

        if (isset($conditions['tags']) && $conditions['tags']) {
            $data['tags'] = $this->getTags();
        }

        if (isset($conditions['options']) && $conditions['options']) {
            $data['options'] = $this->getOptions();
        }

        return $data;
    }

    public function getOptions()
    {
        $childrenOptions = $this->options
            ->where('parent_id', '!=', 0)
            ->where('status', JobOption::STATUS_ACTIVE)
            ->values();

        $options = $this->options
            ->where('parent_id', 0)
            ->where('is_filter', true)
            ->where('status', JobOption::STATUS_ACTIVE)
            ->sortBy(
                fn ($item)
                => $item['position'] === NULL || $item['position'] === 0
                    ? PHP_INT_MAX
                    : $item['position']
            )
            ->values()
            ->map(function ($item) use ($childrenOptions) {
                $item = $item->transform();
                $item['nodes'] = $childrenOptions->where('parent_id', $item['id'])
                    ->values()
                    ->map(fn ($node) => $node->transform());
                $item['value'] = $item['nodes']->pluck('title')->join('/ ');

                return $item;
            });

        return $options;
    }

    public function getTags()
    {
        return $this->tags
            ->where('status', self::STATUS_ACTIVE)
            ->values()
            ->map(fn ($item) => $item->transform());
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

    public function scopeFilter(Builder $query, array $filters = []): Builder
    {

        $optionFilters = collect($filters)->filter(function ($value, $key) {
            return explode('-', $key)[0] == 'opt';
        });

        foreach($optionFilters as $key => $value)
        {
            $jobOption = JobOption::query()
                ->active()
                ->with('children')
                ->whereHas('translations', function ($query) use ($key) {
                    $query->where('slug', str_replace('opt-', '', $key));
                })
                ->first();

            if (!empty($jobOption->id) && $jobOption->children) {
                $ids = explode(',', $value);

                $query->whereHas('options', function ($query) use ($ids) {
                    $query->whereIn('id', $ids);
                });
            }
        }

        $query->when($filters['options'] ?? false, function (Builder $query, $options) {
            $ids = explode(',', $options);

            $options = JobOption::query()
                ->with('childrenRange')
                ->whereIn('id', $ids)
                ->get()
                ->groupBy('parent_id')
                ->values();

            foreach ($options as $group) {
                $ids = $group->pluck('id')->toArray();
                $query->whereHas('options', function ($query) use ($ids) {
                    $query->whereIn('id', $ids);
                });

                foreach ($group as $option) {
                    $optionIds[] = $option->id;
                    $optionIds = array_merge($optionIds, $option->childrenRange->pluck('id')->toArray());
                }

                $query->whereHas('options', function ($query) use ($optionIds) {
                    $query->whereIn('id', $optionIds);
                });
            }
        });

        return $query;
    }
}
