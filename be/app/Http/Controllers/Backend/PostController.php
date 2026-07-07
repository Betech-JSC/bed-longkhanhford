<?php

namespace App\Http\Controllers\Backend;

use App\Models\Post\Post;
use Illuminate\Routing\Controller;
use App\Traits\HasCrudActions;

class PostController extends Controller
{
    use HasCrudActions;
    public $model = Post::class;

    public $with = [
        'form' => ['relatedPosts']
    ];

    private function beforeIndex($query)
    {
        return $query->where('type', Post::TYPE_POST)
            ->orderBy('id', 'DESC');
    }

    private function beforeStore($request, $rules)
    {
        $request->merge(['type' => Post::TYPE_POST]);
        return $rules;
    }

    public function generatePostByAI(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'topic' => 'required|string|max:1000',
            'tone' => 'nullable|string|max:100',
            'language' => 'nullable|string|max:10',
            'keywords' => 'nullable|string|max:500',
            'outline' => 'nullable|string|max:2000',
        ]);

        $gemini = new \App\Services\GeminiService();
        $result = $gemini->generateArticle($request->all());

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message']
            ], 422);
        }

        return response()->json([
            'success' => true,
            'data' => $result['data']
        ]);
    }
}
