<?php

namespace App\Models\Sitemap;

use App\Models\Vehicle\VehicleVersion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class Sitemap
{
    public array $tags = [];

    const CHANGE_FREQUENCY_DAILY = 'daily';
    const CHANGE_FREQUENCY_WEEKLY = 'weekly';
    const PRIORITY = 0.8;
    const PRIORITY_VERSION = 0.85;

    public static function create(): static
    {
        return new static();
    }

    public function addStaticRoutes(): static
    {
        $staticRoutes = [
            '/',
            '/san-pham',
            '/tin-tuc',
            '/bang-gia',
            '/dich-vu',
            '/dich-vu/bao-duong-dinh-ky',
            '/dich-vu/bao-duong-nhanh',
            '/dich-vu/giao-nhan-xe-tan-noi',
            '/dich-vu/cham-soc-khach-hang',
            '/dich-vu/dich-vu-sua-chua',
            '/dich-vu/dich-vu-cuu-ho-247',
            '/dich-vu/dich-vu-xe-da-qua-su-dung',
            '/dich-vu/dich-vu-nang-cap-xe',
            '/dich-vu/ford-sync',
            '/dich-vu/ung-dung-ford',
            '/dich-vu/ford-ensure',
            '/dich-vu/intelligent-oil-life-monitor',
            '/phu-kien',
            '/xe-da-qua-su-dung',
            '/gioi-thieu',
            '/lien-he',
            '/dang-ky-lai-thu',
            '/tuyen-dung',
            '/thu-vien-media',
            '/chinh-sach-bao-mat',
            '/dieu-khoan-su-dung',
            '/cong-cu/so-sanh-xe',
            '/cong-cu/uoc-tinh-lan-banh',
            '/cong-cu/uoc-tinh-tra-gop',
        ];

        foreach ($staticRoutes as $route) {
            $this->add(url($route));
        }

        return $this;
    }

    public function add(string | iterable | Model $tag, $name = null): static
    {
        if (is_array($tag) && (isset($tag['VI']) || isset($tag['vi']))) {
            $defaultLocale = strtoupper(config('app.locale', 'vi'));
            $url = $tag[$defaultLocale] ?? $tag[strtolower($defaultLocale)] ?? head($tag);
            if ($url) {
                $this->add($url);
            }

            return $this;
        }

        if (is_iterable($tag)) {
            foreach ($tag as $item) {
                $this->add($item);
            }

            return $this;
        }

        if (is_string($tag)) {
            $tag = $this->createUrl($tag, $name);
        }

        if (!is_array($tag)) {
            $tag = $this->transformUrl($tag);
        }

        if (!in_array($tag, $this->tags)) {
            if (is_array($tag) && count($tag) && is_array(head($tag))) {
                $this->tags = array_merge($this->tags, $tag);
            } else {
                $this->tags[] = $tag;
            }
        }

        return $this;
    }

    public function addVehicleVersions(iterable $vehicles): static
    {
        foreach ($vehicles as $vehicle) {
            $vehicleSlug = null;
            if (!empty($vehicle->url['VI'])) {
                $vehicleSlug = ltrim($vehicle->url['VI'], '/');
            } else {
                $translation = $vehicle->translations->firstWhere('locale', 'vi') ?? $vehicle->translations->first();
                $vehicleSlug = $translation?->seo_slug ?? $translation?->slug;
            }

            if (empty($vehicleSlug)) {
                continue;
            }

            $versions = $vehicle->relationLoaded('versions')
                ? $vehicle->versions
                : $vehicle->versions()->where('status', VehicleVersion::STATUS_ACTIVE)->get();

            foreach ($versions as $version) {
                if ($version->status !== VehicleVersion::STATUS_ACTIVE) {
                    continue;
                }

                $versionTranslation = $version->relationLoaded('translations')
                    ? ($version->translations->firstWhere('locale', 'vi') ?? $version->translations->first())
                    : ($version->translate('vi') ?? $version->translations->first());

                $versionName = $versionTranslation?->name ?? $version->name;

                if (empty($versionName)) {
                    continue;
                }

                $versionSlug = Str::slug(str_replace('+', '-plus', $versionName));
                if (empty($versionSlug)) {
                    continue;
                }

                $url = '/' . ltrim($vehicleSlug, '/') . '/' . ltrim($versionSlug, '/');
                $lastMod = $version->updated_at ?? $version->created_at ?? $vehicle->updated_at ?? $vehicle->created_at;

                $this->tags[] = [
                    'url' => $url,
                    'lastModificationDate' => $lastMod ? Carbon::parse($lastMod)->toAtomString() : now()->toAtomString(),
                    'changeFrequency' => self::CHANGE_FREQUENCY_WEEKLY,
                    'priority' => self::PRIORITY_VERSION,
                ];
            }
        }

        return $this;
    }

    public function render()
    {
        $frontendUrl = rtrim(config('app.frontend_url'), '/');
        $requestHost = request()->getSchemeAndHttpHost();
        $appUrl = rtrim(config('app.url'), '/');

        $items = collect($this->tags)
            ->whereNotNull('url')
            ->map(function ($item) use ($frontendUrl, $requestHost, $appUrl) {
                $url = $item['url'];
                if (str_starts_with($url, '/')) {
                    $url = $frontendUrl . '/' . ltrim($url, '/');
                } else {
                    $url = str_replace($requestHost, $frontendUrl, $url);
                    $url = str_replace($appUrl, $frontendUrl, $url);
                }
                $item['url'] = $url;
                return $item;
            })
            ->unique('url')
            ->filter()
            ->sortBy('priority')
            ->sortBy('url');

        return response()
            ->view('sitemap::sitemap', ['items' => $items])
            ->header('Content-Type', 'text/xml');
    }

    private function transformUrl($item)
    {
        $lastMod = $item->updated_at ?? $item->published_at ?? $item->created_at;
        $lastModificationDate = $lastMod ? Carbon::parse($lastMod)->toAtomString() : now()->toAtomString();

        if (is_array($item->url)) {
            $urls = [];
            foreach ($item->url as $locale => $url) {
                if (is_string($locale) && strtoupper($locale) !== strtoupper(config('app.locale', 'vi'))) {
                    continue;
                }
                $urls[] = [
                    'url' => $url,
                    'lastModificationDate' => $lastModificationDate,
                    'changeFrequency' => self::CHANGE_FREQUENCY_DAILY,
                    'priority' => $item->priority ?? self::PRIORITY,
                ];
            }
            return $urls;
        } else {
            return [
                'url' => $item->url,
                'lastModificationDate' => $lastModificationDate,
                'changeFrequency' => self::CHANGE_FREQUENCY_DAILY,
                'priority' => $item->priority ?? self::PRIORITY,
            ];
        }
    }

    private function createUrl(string $url, $name = null)
    {
        return [
            'url' => $url,
            'name' => $name,
            'lastModificationDate' => now()->toAtomString(),
            'changeFrequency' => self::CHANGE_FREQUENCY_DAILY,
            'priority' => self::PRIORITY
        ];
    }
}
