<?php

namespace App\Http\Controllers\Frontend;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Routing\Controller;
use JamstackVietnam\Agency\Models\Agency;
use JamstackVietnam\Slider\Models\Slider;

class AgencyController extends Controller
{
    public function index()
    {
        $agencies = Agency::query()
            ->active()
            ->SortByPosition()
            ->get()
            ->groupBy('region')
            ->map(function ($item, $key) {
                return [
                    'region_key' => $key,
                    'region_title' =>  __('agency.region.' . $key, [], current_locale()),
                    'agencies' => $item->map(function ($agency) {
                        return [
                            'title' => $agency['title'],
                            'phone' => $agency['info']['phone'] ?? ($agency['phones'][0]['number'] ?? null),
                            'email' => $agency['info']['email'] ?? null,
                            'location' => $agency['location'] ?? $agency['full_address'],
                            'link_google_map' => $agency['link_google_map'],
                            'code' => $agency['code'],
                            'phones' => $agency['phones'] ?? [],
                            'info' => $agency['info'] ?? [],
                        ];
                    })
                ];
            })
            ->sortBy(
                fn ($item)
                => $item['region_key'] === 'mien_nam' ? 0
                    : ($item['region_key'] === 'mien_trung' ? 1 : 2)
            )
            ->values();

        $data = [
            'agencies' => $agencies
        ];

        if (request()->wantsJson() || request()->is('*/api/*') || request()->is('api/*') || request()->routeIs('api.*')) {
            return response()->json($data);
        }

        return Inertia::render('Contact', $data);
    }
}
