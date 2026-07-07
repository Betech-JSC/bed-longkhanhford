<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use JamstackVietnam\Core\Models\BaseModel;
use App\Traits\Searchable;
use App\Traits\Translatable;

class CustomerHandover extends BaseModel
{
    use HasFactory, SoftDeletes, Searchable, Translatable;

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    public $with = ['translations'];

    public $fillable = [
        'status',
        'position_sort',
        'image',
    ];

    public $translatedAttributes = [
        'title',
    ];

    protected $casts = [
        'image' => 'array',
    ];

    public function rules()
    {
        return [
            'vi.title' => 'required|string|max:255',
            'image' => 'required|array',
        ];
    }

    protected $searchable = [
        'columns' => [
            'customer_handover_translations.title' => 10,
        ],
        'joins' => [
            'customer_handover_translations' => ['customer_handover_translations.customer_handover_id', 'customer_handovers.id'],
        ],
    ];

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(position_sort) OR position_sort = 0, position_sort ASC')
            ->orderBy('id', 'desc');
    }

    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function transform()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'image_url' => $this->image_url,
        ];
    }
}
