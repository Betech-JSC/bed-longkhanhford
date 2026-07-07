<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;
use App\Traits\Translatable;
use Illuminate\Database\Eloquent\SoftDeletes;

class SalesConsultant extends BaseModel
{
    use SoftDeletes, Translatable;

    protected $table = 'sales_consultants';
    public $translationModel = SalesConsultantTranslation::class;
    public $translationForeignKey = 'sales_consultant_id';

    public const STATUS_ACTIVE   = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE   => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    public $with = ['translations'];

    protected $fillable = [
        'department',
        'avatar',
        'cover_image',
        'gallery',
        'facebook_url',
        'linkedin_url',
        'zalo_url',
        'email',
        'phone',
        'status',
        'sort_order',
    ];

    public $translatedAttributes = [
        'name',
        'slug',
        'job_title',
        'short_bio',
        'bio',
    ];

    public function rules(): array
    {
        return [
            'vi.name'    => 'required|string|max:255',
            'avatar'     => 'nullable|array',
            'cover_image'=> 'nullable|array',
            'gallery'    => 'nullable|array',
        ];
    }

    private function encodeJsonField($value): ?string
    {
        if (is_null($value)) return null;
        return is_array($value) ? json_encode($value) : $value;
    }

    public function setAvatarAttribute($value): void
    {
        $this->attributes['avatar'] = $this->encodeJsonField($value);
    }

    public function setCoverImageAttribute($value): void
    {
        $this->attributes['cover_image'] = $this->encodeJsonField($value);
    }

    public function setGalleryAttribute($value): void
    {
        $this->attributes['gallery'] = $this->encodeJsonField($value);
    }

    private function decodeJsonField($value): ?array
    {
        if (is_string($value) && !empty($value)) {
            return json_decode($value, true);
        }
        return is_array($value) ? $value : null;
    }

    public function getAvatarAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function getCoverImageAttribute($value): ?array
    {
        return $this->decodeJsonField($value);
    }

    public function getGalleryAttribute($value): array
    {
        return $this->decodeJsonField($value) ?? [];
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return isset($this->avatar['path']) ? static_url($this->avatar['path']) : null;
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        return isset($this->cover_image['path']) ? static_url($this->cover_image['path']) : null;
    }

    public function getDefaultLocale(): ?string
    {
        return 'vi';
    }

    public function scopeWhereSlug($query, $slug, ?string $locale = null, bool $fallback = true)
    {
        $locale ??= current_locale();
        $locales = [$locale];

        if ($fallback) {
            $locales[] = $this->getDefaultLocale() ?? config('app.locale');
        }

        $locales = array_values(array_unique(array_filter($locales)));

        return $query->whereHas('translations', function ($q) use ($slug, $locales) {
            $q->where('slug', $slug)
                ->whereIn('locale', $locales);
        });
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    public function localizedTranslation(?string $locale = null, bool $fallback = true): ?SalesConsultantTranslation
    {
        $locale ??= current_locale();
        return $this->translate($locale, $fallback);
    }

    public function toLocalizedSummary(?string $locale = null, bool $fallback = true): array
    {
        $translation = $this->localizedTranslation($locale, $fallback);

        return [
            'id'         => $this->id,
            'name'       => $translation?->name,
            'slug'       => $translation?->slug,
            'job_title'  => $translation?->job_title,
            'department' => $this->department,
            'avatar_url' => $this->avatar_url,
            'short_bio'  => $translation?->short_bio,
        ];
    }

    public function toLocalizedDetail(?string $locale = null, bool $fallback = true): array
    {
        $translation = $this->localizedTranslation($locale, $fallback);

        return [
            'id'         => $this->id,
            'name'       => $translation?->name,
            'slug'       => $translation?->slug,
            'job_title'  => $translation?->job_title,
            'avatar_url' => $this->avatar_url,
            'bio'        => $translation?->bio,
            'gallery'    => collect($this->gallery ?? [])->map(fn($g) => [
                'image_url' => isset($g['image']['path'])
                    ? static_url($g['image']['path'])
                    : (isset($g['path']) ? static_url($g['path']) : ($g['image_url'] ?? null)),
                'caption'   => $g['caption'] ?? null,
            ])->values()->all(),
            'email'      => $this->email,
        ];
    }
}
