<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Str;
use JamstackVietnam\Contact\Models\Contact;
use App\Models\Vehicle\Vehicle;
use App\Models\Post\Post;
use Carbon\Carbon;

class HandleInertiaBackendRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'backend::app';

    /**
     * Determine the current asset version.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request)
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
    {
        $sliderPositions = [];
        foreach (config('slider.positions') as $key => $value) {
            $sliderPositions[] = [
                'id' => $key,
                'label' => $value['title']
            ];
        };

        $newContact = Contact::where('status', Contact::STATUS_NEW)->get();
        $todayContact = Contact::whereDate('created_at', Carbon::today())->get();

        $totalVehicles = Vehicle::count();
        $totalPosts = Post::count();

        // Weekly stats for the last 7 days (efficient query with collection filter)
        $weeklyStats = [];
        $sevenDaysAgo = Carbon::today()->subDays(6);
        $recentContacts = Contact::where('created_at', '>=', $sevenDaysAgo)->get();

        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dateStr = $date->format('Y-m-d');
            
            $contactsForDay = $recentContacts->filter(function ($c) use ($dateStr) {
                return Carbon::parse($c->created_at)->format('Y-m-d') === $dateStr;
            });
            
            $weeklyStats[] = [
                'date' => $date->format('d/m'),
                'contact' => $contactsForDay->where('type', 'CONTACT_FORM')->count(),
                'apply' => $contactsForDay->where('type', 'APPLY_FORM')->count(),
                'advise' => $contactsForDay->where('type', 'ADVISE_FORM')->count(),
            ];
        }

        // Type distribution for all time
        $allContacts = Contact::select('type')->get();
        $typeDistribution = [
            'contact' => $allContacts->where('type', 'CONTACT_FORM')->count(),
            'apply' => $allContacts->where('type', 'APPLY_FORM')->count(),
            'advise' => $allContacts->where('type', 'ADVISE_FORM')->count(),
        ];

        $data = [
            'flash' => function () use ($request) {
                return [
                    'success' => $request->session()->get('success'),
                    'error' => $request->session()->get('error'),
                ];
            },
            'locale' => [
                'current' => current_locale(),
                'default' => config('app.locale'),
                'list' => config('app.locales'),
            ],
            'route' => [
                'url' => $request->url(),
                'path' => $request->path(),
                'name' => $request->route() ? $request->route()->getName() : null,
                'query' => $request->query(),
            ],
            'data' => [
                'slider' => [
                    'position_display' => $sliderPositions
                ],
                'new_contact_count' => $newContact->where('type', 'CONTACT_FORM')->count(),
                'new_service_booking_count' => $newContact->where('type', 'SERVICE_BOOKING')->count(),
                'new_test_drive_survey_count' => $newContact->where('type', 'TEST_DRIVE_SURVEY')->count(),
                'new_service_survey_count' => $newContact->where('type', 'SERVICE_SURVEY')->count(),
                'new_apply_count' => $newContact->where('type', 'APPLY_FORM')->count(),
                'new_advise_count' => $newContact->where('type', 'ADVISE_FORM')->count(),
                'today_contact_count' => $todayContact->where('type', 'CONTACT_FORM')->count(),
                'today_service_booking_count' => $todayContact->where('type', 'SERVICE_BOOKING')->count(),
                'today_test_drive_survey_count' => $todayContact->where('type', 'TEST_DRIVE_SURVEY')->count(),
                'today_service_survey_count' => $todayContact->where('type', 'SERVICE_SURVEY')->count(),
                'today_apply_count' => $todayContact->where('type', 'APPLY_FORM')->count(),
                'today_advise_count' => $todayContact->where('type', 'ADVISE_FORM')->count(),
                'new_order_count' => 0,
                'today_order_count' => 0,
                'today_order_total_price' => 0,
                'total_vehicles_count' => $totalVehicles,
                'total_posts_count' => $totalPosts,
                'weekly_stats' => $weeklyStats,
                'type_distribution' => $typeDistribution,
            ]
        ];

        if ($admin = auth()->guard('admin')->user()) {
            $data['admin']  = array_merge(
                $admin->toArray(),
                [
                    'permissions' => $admin->getAllPermissions()->pluck('name')->values(),
                ]
            );
        }

        return array_merge(parent::share($request), $data);
    }

    public function getUserAbilities($user)
    {
        $abilities = $user->getAbilities()->merge($user->getForbiddenAbilities());

        $abilities->each(function ($ability) use ($user) {
            $ability->forbidden = $user->getForbiddenAbilities()->contains($ability);
            $ability->entity_type = Str::snake(Str::plural(class_basename($ability->entity_type)));
        });

        return $abilities->toArray();
    }
}
