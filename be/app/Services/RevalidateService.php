<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Service to trigger Next.js on-demand ISR revalidation.
 * 
 * When admin updates content in CMS, this service calls the Next.js
 * revalidation API to purge cached pages/data so users see fresh content.
 */
class RevalidateService
{
    /**
     * Model class → cache tags mapping.
     * When a model is saved/deleted, these tags will be purged from Next.js cache.
     */
    private static array $modelTagMap = [
        \App\Models\Vehicle\Vehicle::class              => ['vehicles', 'homepage'],
        \App\Models\Vehicle\VehicleVersion::class       => ['vehicles'],
        \App\Models\Vehicle\VehicleCategory::class      => ['vehicles', 'homepage'],
        \App\Models\Vehicle\Banner::class               => ['banners', 'homepage'],
        \App\Models\Vehicle\CustomerReview::class       => ['reviews', 'homepage'],
        \App\Models\Vehicle\Partner::class              => ['partners', 'homepage'],
        \App\Models\Vehicle\SalesConsultant::class      => ['consultants'],
        \App\Models\Vehicle\Accessory::class            => ['accessories'],
        \App\Models\Vehicle\AccessoryCategory::class    => ['accessories'],
        \App\Models\Post\Post::class                    => ['posts'],
        \App\Models\Post\PostCategory::class            => ['posts'],
        \App\Models\Service::class                      => ['services'],
        \App\Models\UsedVehicle\UsedVehicle::class      => ['used-vehicles'],
        \App\Models\Policy\Policy::class                => ['policies'],
        \App\Models\CustomerHandover::class             => ['handovers', 'homepage'],
        \App\Models\MaintenanceSchedule::class          => ['maintenance'],
        \App\Models\Setting::class                      => ['settings'],
    ];

    /**
     * Revalidate Next.js cache by tags and/or paths.
     */
    public static function revalidate(array $tags = [], array $paths = []): void
    {
        $frontendUrl = config('app.frontend_url');
        $secret = config('app.revalidate_secret');

        if (empty($frontendUrl) || empty($secret)) {
            return;
        }

        try {
            Http::timeout(5)
                ->retry(2, 100)
                ->post("{$frontendUrl}/api/revalidate", [
                    'secret' => $secret,
                    'tags'   => $tags,
                    'paths'  => $paths,
                ]);
        } catch (\Throwable $e) {
            Log::warning('Frontend revalidation failed', [
                'tags'    => $tags,
                'paths'   => $paths,
                'error'   => $e->getMessage(),
            ]);
        }
    }

    /**
     * Auto-detect tags from Eloquent model class and revalidate.
     * Called from HasCrudActions trait after store/update/delete.
     */
    public static function revalidateForModel(string $modelClass): void
    {
        $tags = self::$modelTagMap[$modelClass] ?? [];

        if (empty($tags)) {
            // Fallback: derive tag from table name
            $tags = [strtolower(class_basename($modelClass)) . 's'];
        }

        self::revalidate($tags);
    }
}
