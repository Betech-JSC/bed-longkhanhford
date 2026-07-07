<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleCategory extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'vehicle_categories';

    public $translationModel = VehicleCategoryTranslation::class;
    public $translationForeignKey = 'vehicle_category_id';
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
        return [
            'vi.title' => 'required|string|max:255',
            'status' => 'required|string|in:ACTIVE,INACTIVE',
            'sort_order' => 'nullable|integer',
        ];
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }
    
    public function vehicles()
    {
        return $this->belongsToMany(Vehicle::class, 'vehicle_ref_categories', 'vehicle_category_id', 'vehicle_id');
    }

    public function getUrlAttribute(): array
    {
        $urls = [];
        if ($this->status === self::STATUS_ACTIVE) {
            foreach ($this->translations as $translation) {
                $routeName = "$translation->locale.products.categories";
                if (\Illuminate\Support\Facades\Route::has($routeName)) {
                    $urls[strtoupper($translation->locale)] = route($routeName, [
                        'slug' => $translation->seo_slug ?? $translation->slug,
                    ]);
                } else {
                    $slug = $translation->seo_slug ?? $translation->slug;
                    if ($translation->locale === 'vi') {
                        $urls['VI'] = '/dong-xe/' . $slug;
                    } else {
                        $urls[strtoupper($translation->locale)] = '/en/dong-xe/' . $slug;
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
