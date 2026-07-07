<?php

namespace App\Http\Controllers\Backend;

use App\Models\Post\Post;
use Illuminate\Routing\Controller;
use App\Traits\HasCrudActions;

class FeedbackController extends Controller
{
    use HasCrudActions;
    public $model = Post::class;

    private function getTable()
    {
        return 'Feedbacks';
    }

    private function beforeIndex($query)
    {
        return $query->where('type', Post::TYPE_FEEDBACK)
            ->orderBy('id', 'DESC');
    }

    private function beforeStore($request, $rules)
    {
        $request->merge(['type' => Post::TYPE_FEEDBACK]);
        return $rules;
    }
}
