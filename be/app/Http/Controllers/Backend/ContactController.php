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
        return $query->with('salesConsultant')->where(function ($q) {
            $q->whereIn('type', ['CONTACT_FORM', 'ADVISE_FORM', 'NEW_CAR_QUOTE_FORM', 'TEST_DRIVE', 'APPLY_FORM', 'LDP_CLICK_CALL', 'LDP_CLICK_ZALO'])
              ->orWhereNull('type');
        })->orderBy('id', 'DESC');
    }
}
