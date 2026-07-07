<?php

namespace App\Http\Controllers\Frontend;

use Inertia\Inertia;
use Illuminate\Routing\Controller;
use JamstackVietnam\Job\Models\Job;
use App\Models\Post;
use JamstackVietnam\Slider\Models\Slider;

class JobController extends Controller
{
    public function index()
    {
        try {
            $jobs = Job::query()
                ->active()
                ->sortByPosition()
                ->get()
                ->map(fn($item) => $item->transform());

            $data = [
                'jobs' => $jobs,
                'sliders' => Slider::getByPosition('JOB_SLIDER'),
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return Inertia::render('Jobs/Index', $data);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function show($slug)
    {
        try {
            $job = Job::query()
                ->active()
                ->whereSlug($slug)
                ->firstOrFail();

            $job->increment('view_count');

            $data = [
                'job' => $job->transformDetails(),
                'seo' => $job->transformSeo()
            ];

            if (request()->wantsJson()) {
                return response()->json($data);
            }

            return Inertia::render('Jobs/Show', $data)
                ->withViewData(['seo' => $data['seo']]);
        } catch (\Throwable $th) {
            dd($th);
        }
    }

    public function relatedJobs($jobId)
    {
        $job = Job::query()
            ->setEagerLoads([])
            ->with('relatedJobs')
            ->find($jobId);

        $items = $job->relatedJobs()
            ->active()
            ->get()
            ->map(fn($item) => $item->transform());

        return response()->json([
            'success' => true,
            'data' => $items,
            'message' => 'OK',
        ], 200);
    }
}
