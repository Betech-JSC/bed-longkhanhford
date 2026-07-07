<?php

namespace JamstackVietnam\Job\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Core\Traits\Translatable;
use Illuminate\Support\Arr;

class JobOption extends BaseModel
{
    use HasFactory, Translatable, SoftDeletes, Searchable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public $with = ['translations'];

    public $fillable = [
        'parent_id',
        'status',
        'is_range',
        'is_filter',
        'position',
        'range_id'
    ];

    public $translatedAttributes = [
        'locale',
        'title',
        'slug',
    ];

    protected $searchable = [
        'columns' => [
            'job_option_translations.title' => 10,
            'job_option_translations.id' => 5,
        ],
        'joins' => [
            'job_option_translations' => ['job_option_translations.job_option_id', 'job_options.id'],
        ],
    ];

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
        ];
    }

    protected static function booted()
    {
        static::saving(function (self $model) {
            if (strpos(request()->getRequestUri(), '/job-options/store') == false) return;
            $model->updated_at = now();
        });

        static::saved(function (self $model) {
            if (strpos(request()->getRequestUri(), '/job-options/store') == false) return;
            $model->saveChildren($model);
        });
    }


    public function saveChildren($model)
    {
        $childrenItems = self::filterChildrenOption(request()->input('children_value', []));
        $childrenRangeItems = self::filterChildrenOption(request()->input('children_range', []));

        $children = array_merge($childrenItems, $childrenRangeItems);
        $diff = Arr::pluck($children, 'id');
        $ids = $model->children()->pluck('id')->diff($diff);
        if ($ids->isNotEmpty()) {
            $model->children()->whereIn('id', $ids)->delete();
        }

        if ($model->parent_id == 0) {
            foreach ($children as $index => $item) {
                $item['parent_id'] = $model->id;
                $item['locale'] = $model->locale;
                $item['position'] = $index;

                $model->children()->updateOrCreate(
                    ['id' => $item['id'] ?? null],
                    $item
                );
            }
        }
    }

    public static function filterChildrenOption($option)
    {
        return array_filter($option, function ($item) {
            return $item['title'];
        });
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id', 'id');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_id', 'id');
    }

    public function childrenRange()
    {
        return $this->hasMany(self::class, 'range_id', 'id');
    }

    public function nodes()
    {
        return $this->children()
            ->with('nodes')
            ->orderBy('parent_id')
            ->orderBy('id', 'desc');
    }

    public function ranges()
    {
        return $this->hasMany(self::class, 'parent_id', 'parent_id')
            ->where('is_range', true);
    }

    public static function getRoot()
    {
        return static::query()
            ->orderBy('position', 'desc')
            ->with('nodes')
            ->orderBy('parent_id')
            ->whereParent()
            ->get();
    }

    public static function getRootOption()
    {
        return static::query()
            ->orderBy('position', 'desc')
            ->with(['nodes', 'ranges', 'nodes.ranges'])
            ->orderBy('parent_id')
            ->whereParent()
            ->get();
    }

    public static function getParentNodes()
    {
        return static::whereParent()->get();
    }

    public static function transformNested($parents, $children)
    {
        return $parents->map(function ($parent) use ($children) {
            $nodes = $children
                ?->filter(fn ($item) => $item['parent_id'] === $parent->id)
                ->map(fn ($item) => $item->transformNode())
                ->unique()
                ->values();

            return [
                'id' => $parent->id,
                'title' => $parent->title,
                'slug' => $parent->slug,
                'position' => $parent->pivot->position ?? 0,
                'nodes' => $nodes
            ];
        });
    }

    public function transformNode($conditions = ['options' => []]): array
    {
        $data = [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
        ];

        if ($conditions['options'] && count($conditions['options']) > 0) {
            $data['active'] = in_array($this->id, $conditions['options']);
        }

        if ($this->parent_id === 0) {
            $nodes = $this->nodes->where('is_filter', true)
                ->sortBy('position')
                ->values();
            $data['nodes'] = $nodes->map(function ($item) use ($conditions) {
                $optionIds = $conditions['options'] ?? [];
                return $item->transformNode(['options' => $optionIds]);
            });
        }

        return $data;
    }

    public function transform()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
        ];
    }

    public function transformDetails()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'custom_fields' => $this->custom_fields
        ];
    }

    public function scopeWhereParent($query)
    {
        return $query->whereNull('parent_id')
            ->orWhere('parent_id', 0);
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position) OR position = 0, position ASC')
            ->orderBy('id', 'desc');
    }
}
