<?php

namespace App\Http\Controllers\Backend;

use App\Models\Vehicle\LandingPage;
use App\Models\Vehicle\SalesConsultant;
use App\Models\Vehicle\Vehicle;
use App\Models\Post\Post;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;

class LandingPageController extends Controller
{
    use HasCrudActions;

    public $model = LandingPage::class;

    public $with = [
        'index' => ['salesConsultant', 'vehicle', 'vehicle.categories'],
        'form' => ['salesConsultant', 'vehicle', 'vehicle.categories', 'translations'],
    ];

    private function beforeIndex($query)
    {
        return $query->orderBy('id', 'DESC');
    }

    private function beforeForm($data)
    {
        $data['sales_consultants'] = SalesConsultant::where('status', SalesConsultant::STATUS_ACTIVE)
            ->sortByPosition()
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'label' => $c->name,
                'name' => $c->name,
                'email' => $c->email,
                'slug' => $c->slug,
                'custom_domain' => $c->custom_domain,
            ]);

        $data['vehicles'] = Vehicle::where('status', Vehicle::STATUS_ACTIVE)
            ->sortByPosition()
            ->get()
            ->map(fn($v) => [
                'id' => $v->id,
                'label' => $v->title,
                'title' => $v->title,
                'slug' => $v->slug,
                'base_price' => $v->base_price,
                'type' => $v->type,
                'image' => $v->image ? (is_string($v->image) ? $v->image : ($v->image->path ?? null)) : null,
                'layout_blocks' => $v->layout_blocks,
            ]);

        // Lấy danh sách bài viết khuyến mãi thuộc category 'khuyen-mai'
        $data['global_promotions'] = Post::query()
            ->where('status', Post::STATUS_ACTIVE)
            ->whereHas('categories', function($q) {
                $q->whereHas('translations', function($trans) {
                    $trans->where('slug', 'khuyen-mai')
                          ->orWhere('slug', 'like', '%khuyen-mai%');
                });
            })
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'title' => $p->title,
                'slug' => $p->slug,
            ]);

        return $data;
    }
}
