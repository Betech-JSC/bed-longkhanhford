<?php

namespace App\Models\UsedVehicle;

use JamstackVietnam\Core\Models\BaseModel;
use App\Traits\Translatable;
use App\Traits\Searchable;
use Illuminate\Database\Eloquent\SoftDeletes;

class UsedVehicle extends BaseModel
{
    use SoftDeletes, Translatable, Searchable;

    protected $table = 'used_vehicles';

    public $translationModel = UsedVehicleTranslation::class;
    public $translationForeignKey = 'used_vehicle_id';
    public $with = ['translations'];
    protected $appends = ['url', 'image_url', 'images_urls'];

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
        'status',
        'sort_order',
        'price',
        'year',
        'odo',
        'image',
        'images',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'year' => 'integer',
        'odo' => 'integer',
        'image' => 'array',
        'images' => 'array',
    ];

    public const STATUS_ACTIVE = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public function rules(): array
    {
        $base = [
            'vi.title'   => 'required|string|max:255',
            'price'      => 'nullable|numeric|min:0',
            'year'       => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'odo'        => 'nullable|integer|min:0',
            'image'      => 'nullable|array',
            'images'     => 'nullable|array',
            'status'     => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order' => 'nullable|integer',
        ];

        return [
            'store'      => $base,
            'storeDraft' => $base,
        ];
    }

    protected $searchable = [
        'columns' => [
            'used_vehicle_translations.title' => 10,
        ],
        'joins' => [
            'used_vehicle_translations' => ['used_vehicle_translations.used_vehicle_id', 'used_vehicles.id'],
        ],
    ];

    public function getImageUrlAttribute(): ?string
    {
        return isset($this->image['path']) ? static_url($this->image['path']) : null;
    }

    public function getImagesUrlsAttribute(): array
    {
        if (empty($this->images)) return [];
        return collect($this->images)->map(function ($img) {
            return isset($img['path']) ? static_url($img['path']) : (is_string($img) ? static_url($img) : null);
        })->filter()->values()->toArray();
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
                $slug = $translation->seo_slug ?? $translation->slug;
                if ($translation->locale === 'vi') {
                    $urls['VI'] = '/xe-da-qua-su-dung/' . $slug;
                } else {
                    $urls[strtoupper($translation->locale)] = '/en/used-vehicles/' . $slug;
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
