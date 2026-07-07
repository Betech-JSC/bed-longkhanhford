<?php

namespace JamstackVietnam\Slider\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Translatable;
use JamstackVietnam\Core\Traits\Searchable;

class Slider extends BaseModel
{
    use HasFactory, SoftDeletes, Searchable, Translatable;

    const STATUS_ACTIVE = 'ACTIVE';
    const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    public $with = ['translations'];

    protected $searchable = [
        'columns' => [
            'slider_translations.title' => 10,
        ],
        'joins' => [
            'slider_translations' => ['slider_translations.slider_id', 'sliders.id'],
        ],
    ];

    public $fillable = [
        'status',
        'position_display',
        'position_sort',
        'started_at',
        'ended_at',
    ];

    public $translatedAttributes = [
        'title',
        'description',
        'link',
        'target',
        'image_mobile',
        'image',
        'custom_fields'
    ];

    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'position' => 'nullable|integer|min:0',
        ];
    }

    public function getFormattedPositionDisplayAttribute()
    {
        return config('slider.positions.' . $this->position_display . '.title');
    }

    public function scopeActive($query)
    {
        return $query->whereLocaleActive()->where('status', self::STATUS_ACTIVE);
    }

    public function scopeAvailable($query)
    {
        $query->whereDate('started_at', '<=', now())->whereDate('ended_at', '>=', now());
        $query->orWhereDate('started_at', '<=', now())->whereNull('ended_at');
        $query->orWhereDate('ended_at', '>=', now())->whereNull('started_at');
        $query->orWhereNull('ended_at')->whereNull('started_at');
    }

    public function getAvailableAttribute(): bool
    {
        $started_at = $this->started_at;
        $ended_at = $this->ended_at;
        return (is_null($started_at) || $started_at == "" || $started_at <= now()) &&
            (is_null($ended_at) || $ended_at == "" || $ended_at >= now()->subDays(1)) &&
            $this->status == self::STATUS_ACTIVE;
    }

    public function transform()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'link' => $this->link,
            'target' => $this->target,
            'custom_fields' => $this->custom_fields,
            'image' => $this->imageDetail($this->image),
            'image_mobile' => $this->imageDetail($this->image_mobile),
        ];
    }

    public function imageDetail($image)
    {
        return [
            'url' => isset($image['path']) ? static_url($image['path']) : null,
            'alt' => $image['alt'] ?? strip_tags($this->title),
        ];
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position_sort) OR position_sort = 0, position_sort ASC')
            ->orderBy('id', 'desc');
    }

    public static function getByPosition($positionDisplay)
    {
        $query = self::query()
            ->active()
            ->where('position_display', $positionDisplay)
            ->available()
            ->orderBy('position_sort', 'desc')
            ->orderBy('id', 'desc');

        if (config('slider.positions.' . $positionDisplay . '.banner')) {
            return $query->first()?->transform();
        } else {
            return $query->get()
                ->map(fn ($item) => $item->transform());
        }
    }
}
