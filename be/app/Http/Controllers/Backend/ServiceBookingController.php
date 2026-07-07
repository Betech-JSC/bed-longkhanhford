<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Contact;
use App\Traits\HasCrudActions;

class ServiceBookingController extends Controller
{
    use HasCrudActions;
    public $model = Contact::class;

    private function getTable()
    {
        return 'ServiceBookings';
    }

    private function beforeIndex($query)
    {
        return $query->where('type', 'SERVICE_BOOKING')
            ->orderBy('id', 'DESC');
    }
}
