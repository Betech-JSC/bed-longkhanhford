<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\Vehicle\RegistrationFee;
use App\Traits\HasCrudActions;

class RegistrationFeeController extends Controller
{
    use HasCrudActions;
    public $model = RegistrationFee::class;

    private function getTable()
    {
        return 'registration-fees';
    }

    private function beforeIndex($query)
    {
        return $query->with('region')->orderBy('id', 'DESC');
    }

    private function beforeForm($data)
    {
        $data['regions'] = \App\Models\Region::where('level', 1)
            ->orderBy('name')
            ->get()
            ->map(fn($region) => ['id' => $region->id, 'title' => $region->name]);
        return $data;
    }
}
