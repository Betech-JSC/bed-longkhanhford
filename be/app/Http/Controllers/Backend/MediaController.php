<?php

namespace App\Http\Controllers\Backend;

use App\Models\Post\Post;
use Illuminate\Routing\Controller;
use App\Traits\HasCrudActions;

class MediaController extends Controller
{
    use HasCrudActions;
    public $model = Post::class;

    private function folder()
    {
        return 'Media';
    }

    private function beforeIndex($query)
    {
        return $query->where('type', Post::TYPE_MEDIA)
            ->orderBy('id', 'DESC');
    }

    private function beforeStore($request, $rules)
    {
        \Log::info('MediaController beforeStore called!');
        $request->merge(['type' => Post::TYPE_MEDIA]);
        return $rules;
    }

    public function getTable($model = null)
    {
        if ($model) {
            return $model->getTable();
        }
        return 'media';
    }
}
