<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Contact;
use App\Traits\HasCrudActions;

class TestDriveSurveyController extends Controller
{
    use HasCrudActions;
    public $model = Contact::class;

    private function getTable()
    {
        return 'TestDriveSurveys';
    }

    private function beforeIndex($query)
    {
        return $query->where('type', 'TEST_DRIVE_SURVEY')
            ->orderBy('id', 'DESC');
    }
}
