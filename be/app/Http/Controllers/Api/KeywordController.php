<?php

namespace App\Http\Controllers\Api;

use App\Models\Keyword;
use App\Models\KeywordRefDate;
use Illuminate\Routing\Controller;
use JamstackVietnam\Core\Traits\ApiResponse;

class KeywordController extends Controller
{
    use ApiResponse;
    public $model = Keyword::class;

    private function getTable()
    {
        return 'Keywords';
    }

    public function index()
    {
        $items = KeywordRefDate::filter(request()->all())
            ->paginate(request()->input('limit') ?? 25)
            ->through(function ($item) {
                $data = $item->transform();
                $data['search_count'] = $item->total_keyword;
                return $data;
            })
            ->withQueryString();

        return $this->success($items);
    }
}
