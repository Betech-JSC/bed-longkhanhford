<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class KeywordRefDate extends Model
{
    use HasFactory;

    public $with = ['keyword'];

    public $fillable = [
        'keyword_id',
        'created_at',
        'updated_at',
    ];

    public function keyword()
    {
        return $this->belongsTo(Keyword::class);
    }

    public function scopeFilter(Builder $query, array $filters = []): Builder
    {
        $query->when($filters['sort'] ?? false, function (Builder $query, $value) {
                switch ($value) {
                    case 'to_day':
                        $query->whereDate('created_at', Carbon::today());
                        break;
                    case 'last_7':
                        $query->whereDate('created_at', '>=', Carbon::today()->subDays(7));
                        break;
                    case 'last_30':
                        $query->whereDate('created_at', '>=', Carbon::today()->subDays(30));
                        break;
                }
            });

        $query->select('keyword_id', \DB::raw('count(*) as total_keyword'))->groupBy('keyword_id');

        $query->when($filters['orderByCount'] ?? false, function (Builder $query, $value) {
            $query->orderByDesc('total_keyword');
        });
        return $query;
    }

    public function transform()
    {
        return [
            'id' => $this->keyword->id,
            'keyword' => $this->keyword->keyword,
            'search_count' => $this->keyword->search_count,
            'formatted_updated_at' => $this->keyword->formatted_updated_at
        ];
    }
}
