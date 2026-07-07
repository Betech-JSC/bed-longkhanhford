<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccessoryCategory extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'accessory_categories';

    public $translationModel = AccessoryCategoryTranslation::class;
    public $translationForeignKey = 'accessory_category_id';
    public $with = ['translations'];
    protected $appends = ['url'];
    
    public $translatedAttributes = [
        'title',
        'slug',
        'seo_meta_title',
        'seo_focus_keyword',
        'seo_slug',
        'seo_meta_description',
        'seo_meta_keywords',
        'seo_meta_robots',
        'seo_canonical',
        'seo_image',
        'seo_schemas',
    ];

    protected $fillable = [
        'image',
        'status',
        'sort_order',
    ];

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public function rules(): array
    {
        $base = [
            'vi.title' => 'required|string|max:255',
            'image' => 'nullable|array',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order' => 'nullable|integer',
        ];

        return [
            'store' => $base,
            'storeDraft' => $base,
        ];
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }
    
    public function accessories()
    {
        return $this->hasMany(Accessory::class, 'category_id');
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        if ($this->status === self::STATUS_ACTIVE) {
            foreach ($this->translations as $translation) {
                if ($translation->locale === 'vi') {
                    $urls['VI'] = '/danh-muc-phu-kien/' . ($translation->seo_slug ?? $translation->slug);
                } else {
                    $urls[strtoupper($translation->locale)] = '/accessory-categories/' . ($translation->seo_slug ?? $translation->slug);
                }
            }
        }
        return $urls;
    }

    // ── JSON field accessors for image ──

    private function encodeJsonField($value): ?string
    {
        if (is_null($value)) return null;
        return is_array($value) ? json_encode($value) : $value;
    }

    private function decodeJsonField($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function setImageAttribute($value): void
    {
        $this->attributes['image'] = $this->encodeJsonField($value);
    }

    public function getImageAttribute($value): ?array
    {
        if (is_null($value) || $value === '') return null;
        $decoded = $this->decodeJsonField($value);
        if (is_null($decoded) && is_string($value)) {
            return ['path' => $value];
        }
        return $decoded;
    }

    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }
}
