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
    use HasCrudActions {
        destroy as baseDestroy;
    }

    public $model = LandingPage::class;

    public $with = [
        'index' => ['salesConsultant', 'vehicle', 'vehicle.categories'],
        'form' => ['salesConsultant', 'vehicle', 'vehicle.categories', 'translations'],
    ];

    private function beforeIndex($query)
    {
        if ($consultantId = current_admin()?->sales_consultant_id) {
            $query->where('sales_consultant_id', $consultantId);
        }
        return $query->orderBy('id', 'DESC');
    }

    private function afterForm($item)
    {
        $consultantId = current_admin()?->sales_consultant_id;

        if ($consultantId) {
            $itemId = is_object($item) ? ($item->id ?? null) : ($item['id'] ?? null);
            $itemConsultantId = is_object($item) ? ($item->sales_consultant_id ?? null) : ($item['sales_consultant_id'] ?? null);

            if (!empty($itemId) && $itemConsultantId != $consultantId) {
                abort(403, 'Bạn không có quyền chỉnh sửa Landing Page của Cố vấn khác.');
            }

            if (is_object($item)) {
                $item->sales_consultant_id = $consultantId;
            } elseif (is_array($item)) {
                $item['sales_consultant_id'] = $consultantId;
            }
        }

        return $item;
    }

    private function beforeForm($data)
    {
        $consultantId = current_admin()?->sales_consultant_id;

        $consultantsQuery = SalesConsultant::where('status', SalesConsultant::STATUS_ACTIVE);
        if ($consultantId) {
            $consultantsQuery->where('id', $consultantId);
        }

        $data['is_sale_user'] = !empty($consultantId);
        $data['sales_consultants'] = $consultantsQuery
            ->sortByPosition()
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'label' => $c->name,
                'name' => $c->name,
                'email' => $c->email,
                'slug' => $c->slug,
                'custom_domain' => $c->custom_domain,
                'phone' => $c->phone,
                'tracking_config' => $c->tracking_config ?? [],
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

    private function afterStore($request, $resource = null)
    {
        if (!$request->has('tracking_config')) {
            return;
        }
        $consultantId = $request->input('sales_consultant_id') ?: ($resource->sales_consultant_id ?? null);
        if (empty($consultantId)) {
            return;
        }
        $rawConfig = $request->input('tracking_config');
        if (!is_array($rawConfig)) {
            return;
        }
        $consultant = SalesConsultant::find($consultantId);
        if (!$consultant) {
            return;
        }
        $keys = [
            'google_ads_id', 'google_ads_form_label', 'google_ads_call_label', 'google_ads_zalo_label',
            'gtm_id', 'facebook_pixel_id', 'tiktok_pixel_id',
            'inject_head', 'inject_body_start', 'inject_body_end',
        ];
        $cleanConfig = [];
        foreach ($keys as $k) {
            $cleanConfig[$k] = trim((string) ($rawConfig[$k] ?? ''));
        }
        $consultant->tracking_config = $cleanConfig;
        $consultant->save();
        \App\Services\RevalidateService::revalidateForModel(SalesConsultant::class);
    }

    private function beforeStore($request, $rules)
    {
        if ($consultantId = current_admin()?->sales_consultant_id) {
            if (is_object($request) && method_exists($request, 'merge')) {
                $request->merge(['sales_consultant_id' => $consultantId]);
            }
            if (!empty($request->id)) {
                $existing = LandingPage::find($request->id);
                if ($existing && $existing->sales_consultant_id != $consultantId) {
                    abort(403, 'Bạn không có quyền chỉnh sửa Landing Page của Cố vấn khác.');
                }
            }
        }
        return $rules;
    }

    public function destroy($id)
    {
        if ($consultantId = current_admin()?->sales_consultant_id) {
            $ids = explode(',', $id);
            $forbidden = LandingPage::whereIn('id', $ids)->where('sales_consultant_id', '!=', $consultantId)->exists();
            if ($forbidden) {
                abort(403, 'Bạn không có quyền xoá Landing Page của Cố vấn khác.');
            }
        }
        return $this->baseDestroy($id);
    }
}
