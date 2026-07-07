<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class DealerActivity extends BaseModel
{
    use SoftDeletes;

    protected $table = 'dealer_activities';

    public const STATUS_ACTIVE   = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE   => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    protected $fillable = [
        'title',
        'image',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'image' => 'array',
    ];

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'image' => 'nullable|array',
        ];
    }

    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    public function transform(): array
    {
        return [
            'id'    => $this->id,
            'title' => $this->title,
            'image' => [
                'url' => $this->image_url,
                'alt' => $this->title,
            ],
        ];
    }
}
