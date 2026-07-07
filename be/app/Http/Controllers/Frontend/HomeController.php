<?php

namespace App\Http\Controllers\Frontend;

use Inertia\Inertia;
use Illuminate\Routing\Controller;
use App\Models\Vehicle\Banner;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\SalesConsultant;
use App\Models\Vehicle\Partner;
use App\Models\Vehicle\CustomerReview;
use App\Models\Post\Post;
use App\Models\Vehicle\DealerActivity;
use App\Models\Vehicle\Award;

class HomeController extends Controller
{
    public function index()
    {
        try {
            $locale = current_locale();

            $bannerHero = Banner::query()
                ->where('status', Banner::STATUS_ACTIVE)
                ->whereJsonContains('location', Banner::LOCATION_HOMEPAGE)
                ->sortByPosition()
                ->get(['id', 'title', 'subtitle', 'image', 'image_mobile', 'video', 'button_text', 'button_link'])
                ->map(fn($banner) => [
                    'id'               => $banner->id,
                    'title'            => $banner->title,
                    'subtitle'         => $banner->subtitle,
                    'image_url'        => $banner->image_url,
                    'image_mobile_url' => $banner->image_mobile_url,
                    'video_url'        => $banner->video_url,
                    'button_text'      => $banner->button_text,
                    'button_link'      => $banner->button_link,
                ]);

            // Banner giới thiệu Học Viện 
            $bannerEdu = Banner::query()
                ->where('status', Banner::STATUS_ACTIVE)
                ->whereJsonContains('location', Banner::LOCATION_HOMEPAGE_EDU)
                ->sortByPosition()
                ->first(['id', 'title', 'image', 'image_mobile', 'video']);

            $bannerEdu = $bannerEdu ? [
                'id'               => $bannerEdu->id,
                'title'            => $bannerEdu->title,
                'image_url'        => $bannerEdu->image_url,
                'image_mobile_url' => $bannerEdu->image_mobile_url,
                'video_url'        => $bannerEdu->video_url,
            ] : null;

            // Banner quảng cáo / Giáo trình quốc tế
            $bannerAdvise = Banner::query()
                ->where('status', Banner::STATUS_ACTIVE)
                ->whereJsonContains('location', Banner::LOCATION_HOMEPAGE_HERO)
                ->sortByPosition()
                ->first(['id', 'title', 'subtitle', 'image', 'image_mobile', 'video', 'button_text', 'button_link']);

            $bannerAdvise = $bannerAdvise ? [
                'id'               => $bannerAdvise->id,
                'title'            => $bannerAdvise->title,
                'subtitle'         => $bannerAdvise->subtitle,
                'image_url'        => $bannerAdvise->image_url,
                'image_mobile_url' => $bannerAdvise->image_mobile_url,
                'video_url'        => $bannerAdvise->video_url,
                'button_text'      => $bannerAdvise->button_text,
                'button_link'      => $bannerAdvise->button_link,
            ] : null;

            // Đội ngũ nổi bật trên homepage
            $teams = SalesConsultant::query()
                ->where('status', SalesConsultant::STATUS_ACTIVE)
                ->sortByPosition()
                ->take(6)
                ->get()
                ->map(fn($t) => $t->toLocalizedSummary($locale));

            // Nhà tài trợ / đối tác
            $sponsors = Partner::query()
                ->where('status', Partner::STATUS_ACTIVE)
                ->sortByPosition()
                ->get(['id', 'name', 'logo', 'link'])
                ->map(fn($s) => [
                    'id'       => $s->id,
                    'name'     => $s->name,
                    'logo_url' => $s->logo_url,
                    'link'     => $s->link,
                ]);

            // Phản hồi học viên (homepage)
            $reviews = CustomerReview::query()
                ->with(['vehicle:id', 'translations'])
                ->where('status', CustomerReview::STATUS_ACTIVE)
                ->sortByPosition()
                ->take(10)
                ->get()
                ->map(fn($r) => array_merge($r->transform(), [
                    'course_title' => optional($r->vehicle)->title,
                    'course_slug'  => optional($r->vehicle)->slug,
                ]));

            // 3 xe nổi bật (is_best_seller) cho trang chủ
            $courses = Vehicle::query()
                ->where('status', Vehicle::STATUS_ACTIVE)
                ->where('is_best_seller', true)
                ->sortByPosition()
                ->take(3)
                ->get()
                ->map(fn($p) => [
                    'id'                => $p->id,
                    'title'             => $p->title,
                    'slug'              => $p->slug,
                    'image_url'         => $p->image_url,
                    'price'             => $p->base_price,
                    'price_sale'        => 0,
                ]);

            // Hoạt động khóa học
            $activities = DealerActivity::query()
                ->active()
                ->sortByPosition()
                ->get()
                ->map(fn($a) => $a->transform());

            $generalSettings = settings()->group('general')->all();
            $introduceBlock = [
                'title'       => $generalSettings['homepage_introduce_title'] ?? null,
                'description' => $generalSettings['homepage_introduce_description'] ?? null,
                'image_url'   => isset($generalSettings['homepage_introduce_image'])
                    ? static_url((is_array($generalSettings['homepage_introduce_image']) ? $generalSettings['homepage_introduce_image'] : json_decode($generalSettings['homepage_introduce_image'], true))['path'] ?? null)
                    : null,
                'video_url'   => isset($generalSettings['homepage_introduce_video'])
                    ? static_url((is_array($generalSettings['homepage_introduce_video']) ? $generalSettings['homepage_introduce_video'] : json_decode($generalSettings['homepage_introduce_video'], true))['path'] ?? null)
                    : null,
            ];

            // Bài viết nổi bật
            $posts = Post::query()
                ->active()
                ->where('type', Post::TYPE_POST)
                ->where('is_featured', 1)
                ->orderByPosition()
                ->take(10)
                ->get()
                ->map(fn($item) => $item->transform());

            // Chứng nhận / giải thưởng
            $certificates = Award::query()
                ->active()
                ->sortByPosition()
                ->get()
                ->map(fn($item) => $item->transform());


            $data = [
                'banner_hero'      => $bannerHero,
                'banner_edu'       => $bannerEdu,
                'banner_advise'    => $bannerAdvise,
                'introduce_block'  => $introduceBlock,
                'activities'       => $activities,
                'courses'          => $courses,
                'teams'            => $teams,
                'sponsors'         => $sponsors,
                'reviews'          => $reviews,
                'posts'            => $posts,
                'certificates'     => $certificates,
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return view('home_cms');
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function search()
    {
        try {
            if (request()->wantsJson()) {
                return response()->json([]);
            }

            if (request()->has('keyword') && !request()->has('page')) {
                $searchKeyword = \App\Models\Keyword::firstOrCreate(['keyword' => request()->input('keyword')]);
                $searchKeyword->update(['updated_at' => now()]);
                \App\Models\KeywordRefDate::create(['keyword_id' => $searchKeyword->id]);
            }

            return Inertia::render('Search', []);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function searchV2()
    {
        return response()->json([
            'success' => true,
            'data'    => [],
            'message' => 'ok',
        ], 200);
    }

    public function factory()
    {
        return Inertia::render('Factory', []);
    }
}
