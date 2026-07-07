<?php

namespace App\Http\Controllers\Frontend;

use App\Models\Post\Post;
use App\Models\Vehicle\SalesConsultant;
use App\Models\Vehicle\Banner;
use App\Models\Vehicle\DealerActivity;
use App\Models\Vehicle\Award;
use Inertia\Inertia;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Route;


class HistoryController extends Controller
{
    public function index()
    {
        $locale = current_locale();

        $bannerAbout = Banner::query()
            ->where('status', Banner::STATUS_ACTIVE)
            ->whereJsonContains('location', Banner::LOCATION_ABOUT)
            ->sortByPosition()
            ->first(['id', 'title', 'subtitle', 'image', 'image_mobile', 'video', 'button_text', 'button_link']);

        $bannerAbout = $bannerAbout ? [
            'id'               => $bannerAbout->id,
            'title'            => $bannerAbout->title,
            'subtitle'         => $bannerAbout->subtitle,
            'image_url'        => $bannerAbout->image_url,
            'image_mobile_url' => $bannerAbout->image_mobile_url,
            'video_url'        => $bannerAbout->video_url,
            'button_text'      => $bannerAbout->button_text,
            'button_link'      => $bannerAbout->button_link,
        ] : null;

        $posts = Post::query()
            ->active()
            ->activeCategories()
            ->where('is_featured', 1)
            ->orderByPosition()
            ->take(1)
            ->get()
            ->map(fn($item) => $item->transform());

        $teams = SalesConsultant::query()
            ->where('status', SalesConsultant::STATUS_ACTIVE)
            ->sortByPosition()
            ->get()
            ->map(function ($m) use ($locale) {
                $team = $m->toLocalizedSummary($locale);

                return [
                    'id'       => $team['id'],
                    'slug'     => $this->teamDetailUrl($team['slug'], $locale),
                    'title'    => $team['name'],
                    'position' => $team['job_title'],
                    'image'    => [
                        'url' => $team['avatar_url'],
                        'alt' => $team['name'],
                    ],
                ];
            });

        // Hoạt động khóa học
        $activities = DealerActivity::query()
            ->active()
            ->sortByPosition()
            ->get()
            ->map(fn($a) => $a->transform());

        // Giải thưởng
        $awards = Award::query()
            ->active()
            ->sortByPosition()
            ->get()
            ->map(fn($a) => $a->transform());

        $data = [
            'banner_about' => $bannerAbout,
            'posts'        => $posts,
            'teams'        => $teams,
            'activities'   => $activities,
            'awards'       => $awards,
        ];

        if (request()->wantsJson()) {
            return response()->json($data);
        }

        return Inertia::render('About', $data);
    }

    private function teamDetailUrl(?string $slug, string $locale): ?string
    {
        if (empty($slug)) {
            return null;
        }

        $routeName = "{$locale}.team.show";

        if (Route::has($routeName)) {
            return route($routeName, ['slug' => $slug]);
        }

        return route('team.show', ['slug' => $slug]);
    }
}
