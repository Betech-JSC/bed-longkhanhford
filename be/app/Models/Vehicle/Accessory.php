<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Accessory extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'accessories';

    public $translationModel = AccessoryTranslation::class;
    public $translationForeignKey = 'accessory_id';
    public $with = ['translations'];
    protected $appends = ['url', 'category'];



    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    public $translatedAttributes = [
        'title',
        'slug',
        'description',
        'compatibility_text',
        'safety_text',
        'product_desc_text',
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
        'brand_id',
        'code',
        'price',
        'image',
        'images',
        'fit_vehicles',
        'features',
        'status',
        'sort_order',
        'created_by',
        'updated_by',
        'brochure_url',
        'brochure_file',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function rules(): array
    {
        $base = [
            'vi.title'   => 'required|string|max:255',
            'brand_id'   => 'nullable|integer|exists:brands,id',
            'code'       => 'nullable|string|max:50',
            'price'      => 'nullable|numeric|min:0',
            'image'      => 'nullable|array',
            'images'     => 'nullable|array',
            'status'     => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order' => 'nullable|integer',
            'brochure_url' => 'nullable|string|max:500',
            'brochure_file' => 'nullable|array',
        ];

        return [
            'store'      => $base,
            'storeDraft' => $base,
        ];
    }

    protected static function booted()
    {
        static::saved(function (self $model) {
            if (request()->route() === null) return;
            $model->saveCategories($model);
            $model->saveVehicles($model);
        });
    }

    public function saveCategories($model)
    {
        $categories = array_column(request()->input('categories', []), 'id');
        $model->categories()->sync($categories);
    }

    public function saveVehicles($model)
    {
        $vehicles = array_column(request()->input('vehicles', []), 'id');
        $model->vehicles()->sync($vehicles);
    }

    // ── JSON field accessors (same pattern as Vehicle) ──

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

    public function setImagesAttribute($value): void
    {
        $this->attributes['images'] = $this->encodeJsonField($value);
    }

    public function getImagesAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function setFitVehiclesAttribute($value): void
    {
        if (is_array($value)) {
            // Trim each element and filter out nulls/empties
            $trimmed = array_map(function($item) {
                return is_null($item) ? null : trim((string) $item);
            }, $value);

            $filtered = array_filter($trimmed, function($item) {
                return !is_null($item) && $item !== '';
            });

            // Remove case-insensitive duplicates
            $uniqueValues = [];
            foreach ($filtered as $item) {
                $lowerItem = strtolower($item);
                if (!isset($uniqueValues[$lowerItem])) {
                    $uniqueValues[$lowerItem] = $item;
                }
            }
            $value = array_values($uniqueValues);
        }
        $this->attributes['fit_vehicles'] = $this->encodeJsonField($value);
    }

    public function getFitVehiclesAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function setFeaturesAttribute($value): void
    {
        $this->attributes['features'] = $this->encodeJsonField($value);
    }

    public function getFeaturesAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function setBrochureFileAttribute($value): void
    {
        $this->attributes['brochure_file'] = $this->encodeJsonField($value);
    }

    public function getBrochureFileAttribute($value): ?array
    {
        if (is_null($value) || $value === '') return null;
        $decoded = $this->decodeJsonField($value);
        if (is_null($decoded) && is_string($value)) {
            return ['path' => $value];
        }
        return $decoded;
    }

    // ── Helpers ──

    public function categories()
    {
        return $this->belongsToMany(
            AccessoryCategory::class,
            'accessory_ref_categories',
            'accessory_id',
            'accessory_category_id'
        );
    }

    public function vehicles()
    {
        return $this->belongsToMany(
            Vehicle::class,
            'accessory_ref_vehicles',
            'accessory_id',
            'vehicle_id'
        );
    }

    public function brand()
    {
        return $this->belongsTo(\App\Models\Brand\Brand::class, 'brand_id');
    }

    public function getCategoryNameAttribute(): string
    {
        return $this->categories->pluck('title')->implode(', ');
    }

    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        if ($this->status === self::STATUS_ACTIVE) {
            foreach ($this->translations as $translation) {
                $slug = $translation->seo_slug ?? $translation->slug;
                if ($slug) {
                    if ($translation->locale === 'vi') {
                        $urls['VI'] = '/phu-kien/' . $slug;
                    } else {
                        $urls[strtoupper($translation->locale)] = '/accessories/' . $slug;
                    }
                }
            }
        }
        return $urls;
    }

    public function getCategoryAttribute(): ?string
    {
        $firstCategory = $this->categories->first();
        if (!$firstCategory) return null;

        $map = [
            1 => 'interior',
            2 => 'exterior',
            3 => 'tech',
            4 => 'wheels',
            5 => 'performance',
        ];

        if (isset($map[$firstCategory->id])) {
            return $map[$firstCategory->id];
        }

        $slug = $firstCategory->slug;
        if ($slug) {
            if (str_contains($slug, 'noi-that') || str_contains($slug, 'interior')) return 'interior';
            if (str_contains($slug, 'ngoai-that') || str_contains($slug, 'exterior')) return 'exterior';
            if (str_contains($slug, 'cong-nghe') || str_contains($slug, 'tech')) return 'tech';
            if (str_contains($slug, 'mam-lop') || str_contains($slug, 'wheels')) return 'wheels';
            if (str_contains($slug, 'hieu-suat') || str_contains($slug, 'performance')) return 'performance';
        }

        return null;
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    public function scopeWhereSlug($query, $slug)
    {
        return $query->whereHas('translations', function ($q) use ($slug) {
            $q->where('slug', $slug)->orWhere('seo_slug', $slug);
        });
    }

    public function getImageDetail($image): array
    {
        return [
            'url' => isset($image['path']) ? static_url($image['path']) : null,
            'alt' => $image['alt'] ?? $this->title,
        ];
    }

    public function transform(): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'slug'          => $this->seo_slug ?? $this->slug,
            'code'          => $this->code,
            'categories'    => $this->categories->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->title,
            ]),
            'category_name' => $this->category_name,
            'brand'         => $this->brand ? $this->brand->transform() : null,
            'price'         => $this->price,
            'description'   => $this->description,
            'image'         => array_merge($this->getImageDetail($this->image ?? []), ['path' => $this->image['path'] ?? null]),
            'images'        => collect($this->images)->map(fn($item) => $this->getImageDetail($item)),
            'fit_vehicles'  => $this->fit_vehicles ?? [],
            'vehicles'      => $this->vehicles->map(fn($item) => [
                'id' => $item->id,
                'title' => $item->translate('vi')->title ?? $item->title,
                'slug' => $item->translate('vi')->slug ?? $item->slug,
            ]),
            'features'      => $this->features ?? [],
            'brochure_url'  => $this->brochure_url,
            'brochure_file' => $this->brochure_file ? [
                'url'  => isset($this->brochure_file['path']) ? static_url($this->brochure_file['path']) : null,
                'path' => $this->brochure_file['path'] ?? null,
            ] : null,
        ];
    }

    public function transformDetails(): array
    {
        return array_merge($this->transform(), [
            'compatibility_text' => $this->compatibility_text,
            'safety_text'        => $this->safety_text,
            'product_desc_text'  => transform_richtext($this->product_desc_text),
        ]);
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }
}
