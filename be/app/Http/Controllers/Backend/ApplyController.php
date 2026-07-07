<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use JamstackVietnam\Contact\Models\Contact;
use App\Traits\HasCrudActions;

class ApplyController extends Controller
{
    use HasCrudActions;
    public $model = Contact::class;

    private function getTable()
    {
        return 'Applies';
    }

    private function beforeIndex($query)
    {
        return $query->where('type', 'APPLY_FORM')
            ->orderBy('id', 'DESC');
    }
}
