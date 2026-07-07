<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Partner extends BaseModel
{
    use SoftDeletes;

    protected $table = 'partners';

    public const STATUS_ACTIVE   = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE   => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    protected $fillable = [
        'name',
        'logo',
        'link',
        'sort_order',
        'status',
    ];

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'logo' => 'nullable|array',
        ];
    }

    public function setLogoAttribute($value): void
    {
        $this->attributes['logo'] = is_array($value) ? json_encode($value) : $value;
    }

    public function getLogoAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) return json_decode($value, true);
        return is_array($value) ? $value : null;
    }

    public function getLogoUrlAttribute(): ?string
    {
        return isset($this->logo['path']) ? static_url($this->logo['path']) : null;
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }
}
