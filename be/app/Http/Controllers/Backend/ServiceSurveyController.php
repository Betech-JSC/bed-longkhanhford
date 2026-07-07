<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Contact;
use App\Traits\HasCrudActions;

class ServiceSurveyController extends Controller
{
    use HasCrudActions;
    public $model = Contact::class;

    private function getTable()
    {
        return 'ServiceSurveys';
    }

    private function beforeIndex($query)
    {
        return $query->where('type', 'SERVICE_SURVEY')
            ->orderBy('id', 'DESC');
    }
}
