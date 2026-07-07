<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use App\Models\ChatSession;
use App\Traits\HasCrudActions;

class ChatSessionController extends Controller
{
    use HasCrudActions;
    public $model = ChatSession::class;

    private function getTable()
    {
        return 'ChatSessions';
    }

    private function beforeIndex($query)
    {
        return $query->orderBy('id', 'DESC');
    }
}
