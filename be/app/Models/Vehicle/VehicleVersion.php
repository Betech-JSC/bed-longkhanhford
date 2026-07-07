<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleVersion extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'vehicle_versions';

    public $translationModel = VehicleVersionTranslation::class;
    public $translationForeignKey = 'vehicle_version_id';
    public $with = ['translations'];

    public $translatedAttributes = [
        'name',
    ];

    protected $appends = ['image_url', 'image_thumbnail_url'];

    protected $fillable = [
        'vehicle_id',
        'price',
        'specs',
        'image',
        'image_thumbnail',
        'colors',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public function rules(): array
    {
        return [
            'vehicle_id'      => 'required|exists:vehicles,id',
            'vi.name'         => 'required|string|max:255',
            'price'           => 'required|numeric|min:0',
            'specs'           => 'nullable|array',
            'image'           => 'nullable|array',
            'image_thumbnail' => 'nullable|array',
            'colors'          => 'nullable|array',
            'status'          => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order'      => 'nullable|integer',
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
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function setImageThumbnailAttribute($value): void
    {
        $this->attributes['image_thumbnail'] = is_array($value) ? json_encode($value) : $value;
    }

    public function getImageThumbnailAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function getImageThumbnailUrlAttribute(): ?string
    {
        return isset($this->image_thumbnail['path']) ? static_url($this->image_thumbnail['path']) : null;
    }

    public function setSpecsAttribute($value): void
    {
        $this->attributes['specs'] = is_array($value) ? json_encode($value) : $value;
    }

    public function getSpecsAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function setColorsAttribute($value): void
    {
        $this->attributes['colors'] = is_array($value) ? json_encode($value) : $value;
    }

    public function getColorsAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }
}
