<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Contact;
use App\Traits\HasCrudActions;

class RepairQuoteController extends Controller
{
    use HasCrudActions;
    public $model = Contact::class;

    private function getTable()
    {
        return 'RepairQuotes';
    }

    protected function folder()
    {
        return 'FormContacts';
    }

    private function beforeIndex($query)
    {
        return $query->where('type', 'REPAIR_QUOTE_FORM')
            ->orderBy('id', 'DESC');
    }
}
