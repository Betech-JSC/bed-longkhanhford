<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use JamstackVietnam\Job\Models\Job;
use App\Traits\HasCrudActions;

class JobController extends Controller
{
    use HasCrudActions;

    public $model = Job::class;

    public $with = [
        'form' => ['relatedJobs']
    ];

    /**
     * Override validation rules để match với tab locale (vi.title thay vì title)
     */
    private function beforeStore($request, $rules)
    {
        return [
            'vi.title'   => 'required|string|max:255',
            'vi.content' => 'required',
        ];
    }
}
