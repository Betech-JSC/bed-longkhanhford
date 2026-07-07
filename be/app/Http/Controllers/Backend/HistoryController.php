<?php

namespace App\Http\Controllers\Backend;

use App\Models\History;
use Illuminate\Routing\Controller;
use App\Traits\HasCrudActions;

class HistoryController extends Controller
{
    use HasCrudActions;
    public $model = History::class;

    private function beforeIndex($query)
    {
        return $query->orderBy('year', 'DESC')
            ->orderBy('id', 'DESC');
    }
}
