<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Post\Post;
use App\Models\Post\PostCategory;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use App\Models\Vehicle\VehicleVersion;
use App\Models\Sitemap\Sitemap;

class SitemapController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::where('status', Vehicle::STATUS_ACTIVE)
            ->with([
                'translations',
                'versions' => function ($query) {
                    $query->where('status', VehicleVersion::STATUS_ACTIVE)
                        ->with('translations');
                },
            ])
            ->get();

        return Sitemap::create()
            ->addStaticRoutes()
            ->add(Post::active()->get()->pluck('url'))
            ->add($vehicles)
            ->addVehicleVersions($vehicles)
            ->add(VehicleCategory::where('status', VehicleCategory::STATUS_ACTIVE)->get())
            ->render();
    }
}
