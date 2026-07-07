<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'vehicles';

    public $translationModel = VehicleTranslation::class;
    public $translationForeignKey = 'vehicle_id';
    public $with = ['translations'];
    protected $appends = ['url', 'image_url', 'image_thumbnail_url', 'image_featured_url', 'category_id', 'category_ids'];

    public $translatedAttributes = [
        'title',
        'slug',
        'tagline',
        'description',
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
        'type',
        'is_best_seller',
        'base_price',
        'image',
        'image_thumbnail',
        'image_featured',
        'video_url',
        'video',
        'images',
        'colors',
        'images_360_external',
        'images_360_internal',
        'image_360_internal_url',
        'status',
        'sort_order',
        'layout_blocks',
        'brochure_url',
        'brochure_file',
    ];

    protected $casts = [
        'base_price'     => 'decimal:2',
        'is_best_seller' => 'boolean',
    ];

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public function rules(): array
    {
        $base = [
            'vi.title'       => 'required|string|max:255',
            'type'           => 'required|string|in:suv,pickup,commercial',
            'base_price'     => 'nullable|numeric|min:0',
            'image'          => 'nullable|array',
            'image_thumbnail' => 'nullable|array',
            'image_featured'  => 'nullable|array',
            'video_url'      => 'nullable|string|max:500',
            'video'          => 'nullable|array',
            'images'         => 'nullable|array',
            'colors'         => 'nullable|array',
            'images_360_external' => 'nullable|array',
            'images_360_internal' => 'nullable|array',
            'image_360_internal_url' => 'nullable|string',
            'status'         => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order'     => 'nullable|integer',
            'accessories'    => 'nullable|array',
            'brochure_url'   => 'nullable|string|max:500',
            'brochure_file'  => 'nullable|array',
        ];

        return [
            'store'      => $base,
            'storeDraft' => $base,
        ];
    }

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

    public function setVideoAttribute($value): void
    {
        $this->attributes['video'] = $this->encodeJsonField($value);
    }

    public function getVideoAttribute($value): ?array
    {
        if (is_null($value) || $value === '') return null;
        $decoded = $this->decodeJsonField($value);
        if (is_null($decoded) && is_string($value)) {
            return ['path' => $value];
        }
        return $decoded;
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

    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function setImageThumbnailAttribute($value): void
    {
        $this->attributes['image_thumbnail'] = $this->encodeJsonField($value);
    }

    public function getImageThumbnailAttribute($value): ?array
    {
        if (is_null($value) || $value === '') return null;
        $decoded = $this->decodeJsonField($value);
        if (is_null($decoded) && is_string($value)) {
            return ['path' => $value];
        }
        return $decoded;
    }

    public function getImageThumbnailUrlAttribute(): ?string
    {
        return isset($this->image_thumbnail['path']) ? static_url($this->image_thumbnail['path']) : null;
    }

    public function setImageFeaturedAttribute($value): void
    {
        $this->attributes['image_featured'] = $this->encodeJsonField($value);
    }

    public function getImageFeaturedAttribute($value): ?array
    {
        if (is_null($value) || $value === '') return null;
        $decoded = $this->decodeJsonField($value);
        if (is_null($decoded) && is_string($value)) {
            return ['path' => $value];
        }
        return $decoded;
    }

    public function getImageFeaturedUrlAttribute(): ?string
    {
        return isset($this->image_featured['path']) ? static_url($this->image_featured['path']) : null;
    }

    public function setImagesAttribute($value): void
    {
        $this->attributes['images'] = $this->encodeJsonField($value);
    }

    public function getImagesAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function setColorsAttribute($value): void
    {
        $this->attributes['colors'] = $this->encodeJsonField($value);
    }

    public function getColorsAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function setImages360ExternalAttribute($value): void
    {
        $this->attributes['images_360_external'] = $this->encodeJsonField($value);
    }

    public function getImages360ExternalAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function setImages360InternalAttribute($value): void
    {
        $this->attributes['images_360_internal'] = $this->encodeJsonField($value);
    }

    public function getImages360InternalAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function setLayoutBlocksAttribute($value): void
    {
        $this->attributes['layout_blocks'] = $this->encodeJsonField($value);
    }

    public function getLayoutBlocksAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function categories()
    {
        return $this->belongsToMany(VehicleCategory::class, 'vehicle_ref_categories', 'vehicle_id', 'vehicle_category_id');
    }

    public function accessories()
    {
        return $this->belongsToMany(
            Accessory::class,
            'accessory_ref_vehicles',
            'vehicle_id',
            'accessory_id'
        );
    }

    public function getCategoryIdAttribute(): ?int
    {
        return $this->categories->first()?->id;
    }

    public function getCategoryIdsAttribute(): array
    {
        return $this->categories->pluck('id')->toArray();
    }

    public function versions()
    {
        return $this->hasMany(VehicleVersion::class, 'vehicle_id');
    }

    public function reviews()
    {
        return $this->hasMany(CustomerReview::class, 'vehicle_id');
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    public function scopeWhereSlug($query, $slug)
    {
        return $query->whereHas('translations', function ($q) use ($slug) {
            $q->where('slug', $slug);
        });
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        if ($this->status === self::STATUS_ACTIVE) {
            foreach ($this->translations as $translation) {
                $routeName = "$translation->locale.products.show";
                if (\Illuminate\Support\Facades\Route::has($routeName)) {
                    $urls[strtoupper($translation->locale)] = route($routeName, [
                        'slug' => $translation->seo_slug ?? $translation->slug,
                    ]);
                } else {
                    $slug = $translation->seo_slug ?? $translation->slug;
                    if ($translation->locale === 'vi') {
                        $urls['VI'] = '/' . $slug;
                    } else {
                        $urls[strtoupper($translation->locale)] = '/en/' . $slug;
                    }
                }
            }
        }
        return $urls;
    }

    public function transformSeo()
    {
        return transform_seo($this);
    }
}
