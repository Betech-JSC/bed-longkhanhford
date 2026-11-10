<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Contact;
use App\Traits\HasCrudActions;

class ContactController extends Controller
{
    use HasCrudActions;
    public $model = Contact::class;

    public $with = [
        'index' => ['salesConsultant'],
        'form'  => ['salesConsultant'],
    ];

    private function getTable()
    {
        return 'FormContacts';
    }

    private function beforeIndex($query)
    {
        $consultantId = current_admin()?->sales_consultant_id;

        $query = $query->with('salesConsultant')->where(function ($q) {
            $q->whereIn('type', ['CONTACT_FORM', 'ADVISE_FORM', 'NEW_CAR_QUOTE_FORM', 'TEST_DRIVE', 'APPLY_FORM', 'LDP_CLICK_CALL', 'LDP_CLICK_ZALO'])
              ->orWhereNull('type');
        });

        if ($consultantId) {
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
                abort(403, 'Bạn không có quyền xem thông tin liên hệ của Cố vấn khác.');
            }
        }
        return $item;
    }
}
