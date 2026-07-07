<?php

namespace App\Http\Controllers\Frontend;

use Inertia\Inertia;
use Illuminate\Routing\Controller;
use App\Models\Policy\Policy;

class PolicyController extends Controller
{
    public $model = Policy::class;

    public function index()
    {
        return $this->renderDataPage();
    }

    public function show($slug)
    {
        return $this->renderDataPage($slug);
    }

    public function renderDataPage($slug = null)
    {
        $policiesQuery = Policy::query()
            ->active();

        if (request()->has('type')) {
            $policiesQuery->where('type', request()->input('type'));
        }

        $policiesQuery->orderBy('position', 'ASC');

        $rawPolicies = $policiesQuery->get();

        // Tìm content theo slug trên model thô (trước khi transform)
        // để đảm bảo đúng locale context
        if (!empty($slug)) {
            $contentModel = $rawPolicies->first(function ($item) use ($slug) {
                $itemSlug = $item->seo_slug ?? $item->slug;
                return $itemSlug === $slug;
            });
            if (!$contentModel && request()->has('type')) {
                $contentModel = $rawPolicies->first();
            }
        } else {
            $contentModel = $rawPolicies->first();
        }

        $policies = $rawPolicies->map(fn($item) => $item->transform());
        $content = $contentModel ? $contentModel->transform() : null;

        $data = [
            'list_sidebar' => $policies,
            'content' => $content
        ];

        if (request()->wantsJson()) {
            return response()->json($data);
        }

        return Inertia::render('Policy', $data)
            ->withViewData(['seo' => $contentModel ? $contentModel->transformSeo() : null]);
    }
}
