<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Banner extends BaseModel
{
    use SoftDeletes;

    protected $table = 'banners';

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE   => 'Kích hoạt',
        self::STATUS_INACTIVE => 'Tắt',
    ];

    public const LOCATION_HOMEPAGE      = 'homepage';
    public const LOCATION_HOMEPAGE_EDU  = 'homepage_edu';
    public const LOCATION_HOMEPAGE_HERO = 'homepage_hero';
    public const LOCATION_CONTACT       = 'contact';
    public const LOCATION_NEWS          = 'news';
    public const LOCATION_COURSES       = 'courses';
    public const LOCATION_PRODUCTS      = 'products';
    public const LOCATION_ABOUT         = 'about';

    public const LOCATION_LIST = [
        self::LOCATION_HOMEPAGE      => 'Trang chủ - Hero slider',
        self::LOCATION_HOMEPAGE_EDU  => 'Trang chủ - Banner giới thiệu',
        self::LOCATION_HOMEPAGE_HERO => 'Trang chủ - Banner quảng cáo',
        self::LOCATION_CONTACT       => 'Trang liên hệ',
        self::LOCATION_NEWS          => 'Trang tin tức',
        self::LOCATION_COURSES       => 'Trang khóa học',
        self::LOCATION_PRODUCTS      => 'Trang sản phẩm',
        self::LOCATION_ABOUT         => 'Trang về chúng tôi',
    ];

    protected $fillable = [
        'title',
        'subtitle',
        'image',
        'image_mobile',
        'video',
        'location',
        'button_text',
        'button_link',
        'sort_order',
        'status',
    ];

    public function getLocationAttribute($value): array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true) ?? [];
        }
        return is_array($value) ? $value : [];
    }

    public function rules(): array
    {
        return [
            'title'        => 'nullable|string|max:255',
            'image'        => 'nullable|array',
            'image_mobile' => 'nullable|array',
            'video'        => 'nullable|array',
            'location'     => 'nullable|array',
        ];
    }

    public function setLocationAttribute($value): void
    {
        if (is_array($value)) {
            $ids = array_values(array_map(function ($item) {
                return is_array($item) ? ($item['id'] ?? $item) : $item;
            }, $value));
            $this->attributes['location'] = json_encode($ids);
        } else {
            $this->attributes['location'] = $value;
        }
    }

    public function setImageAttribute($value): void
    {
        $this->attributes['image'] = is_array($value) ? json_encode($value) : $value;
    }

    public function setImageMobileAttribute($value): void
    {
        $this->attributes['image_mobile'] = is_array($value) ? json_encode($value) : $value;
    }

    public function setVideoAttribute($value): void
    {
        $this->attributes['video'] = is_array($value) ? json_encode($value) : $value;
    }

    public function getImageAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function getImageMobileAttribute($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function getVideoAttribute($value): ?array
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

    public function getImageMobileUrlAttribute(): ?string
    {
        return isset($this->image_mobile['path']) ? static_url($this->image_mobile['path']) : null;
    }

    public function getVideoUrlAttribute(): ?string
    {
        return isset($this->video['path']) ? static_url($this->video['path']) : (!empty($this->video) && is_string($this->video) ? $this->video : null);
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }
}
