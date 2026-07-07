<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;

use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Keyword extends BaseModel
{
    use HasFactory, Searchable;

    public $fillable = [
        'keyword',
        'search_count',
        'updated_at',
    ];

    public function rules()
    {
        return [
            'keyword' => 'required|string|max:255',
        ];
    }

    protected $searchable = [
        'columns' => [
            'keyword' => 10,
            'id' => 5,
        ]
    ];

    public function transform()
    {
        return [
            'id' => $this->id,
            'keyword' => $this->keyword,
            'search_count' => $this->search_count,
            'formatted_updated_at' => $this->formatted_updated_at,
        ];
    }

    public function scopeFilter(Builder $query, array $filters = []): Builder
    {
        $query->when($filters['sort'] ?? false, function (Builder $query, $value) {
            switch ($value) {
                case 'to_day':
                    $query->whereDate('updated_at', Carbon::today());
                    break;
                case 'last_7':
                    $query->whereDate('updated_at', '>=', Carbon::today()->subDays(7));
                    break;
                case 'last_30':
                    $query->whereDate('updated_at', '>=', Carbon::today()->subDays(30));
                    break;
            }
        });

        $query->when($filters['orderByCount'] ?? false, function (Builder $query, $value) {
            $query->orderByDesc('search_count');
        });
        return $query;
    }
}
