<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Contact;
use App\Traits\HasCrudActions;

class ContactController extends Controller
{
    use HasCrudActions;
    public $model = Contact::class;

    private function getTable()
    {
        return 'FormContacts';
    }

    private function beforeIndex($query)
    {
        return $query->whereIn('type', ['CONTACT_FORM', 'ADVISE_FORM'])
            ->orderBy('id', 'DESC');
    }
}
