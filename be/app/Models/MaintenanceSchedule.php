<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

class MaintenanceSchedule extends BaseModel
{
    use SoftDeletes;

    protected $table = 'maintenance_schedules';

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    protected $fillable = [
        'title',
        'image',
        'links',
        'sort_order',
        'status',
    ];

    protected $appends = ['image_url'];

    public function rules(): array
    {
        return [
            'title'      => 'required|string|max:255',
            'image'      => 'nullable|array',
            'links'      => 'nullable|array',
            'status'     => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order' => 'nullable|integer',
        ];
    }

    public function setImageAttribute($value): void
    {
        $this->attributes['image'] = is_array($value) ? json_encode($value) : $value;
    }

    public function getImageAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function getImageUrlAttribute(): ?string
    {
        if (isset($this->image['path'])) {
            $path = $this->image['path'];
            if (str_starts_with($path, '/assets/') || str_starts_with($path, 'assets/')) {
                return '/' . ltrim($path, '/');
            }
            return static_url($path);
        }
        return null;
    }

    public function setLinksAttribute($value): void
    {
        $this->attributes['links'] = is_array($value) ? json_encode($value) : $value;
    }

    public function getLinksAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }
}
