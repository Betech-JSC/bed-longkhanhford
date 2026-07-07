<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerReview extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'customer_reviews';

    public $translationModel = CustomerReviewTranslation::class;
    public $translationForeignKey = 'customer_review_id';
    public $with = ['translations'];
    
    public $translatedAttributes = [
        'customer_name',
        'content',
    ];

    protected $appends = ['image_url'];

    public const STATUS_ACTIVE   = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE   => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    protected $fillable = [
        'vehicle_id',
        'rating',
        'status',
        'sort_order',
        'image',
    ];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class, 'vehicle_id');
    }

    public function rules(): array
    {
        return [
            'vi.customer_name' => 'required|string|max:100',
            'vi.content'       => 'required|string',
            'rating'           => 'required|integer|min:1|max:5',
            'image'            => 'nullable|array',
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

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    public function transform(): array
    {
        return [
            'id'            => $this->id,
            'customer_name' => $this->customer_name,
            'rating'        => $this->rating,
            'content'       => $this->content,
            'vehicle_id'    => $this->vehicle_id,
            'image_url'     => $this->image_url,
        ];
    }
}
