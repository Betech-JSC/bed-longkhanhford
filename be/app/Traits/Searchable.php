<?php

namespace App\Traits;

use Nicolaslopezj\Searchable\SearchableTrait;

trait Searchable
{
    use SearchableTrait;

    public function scopeSearchLike($q, $keyword)
    {
        if (empty($keyword)) return $q;

        $query = clone $q;
        $query->select($this->getTable() . '.*');
        $this->makeJoins($query);

        $query->where(function ($query) use ($keyword) {
            foreach ($this->getColumns() as $column => $relevance) {
                $query->orWhere($column, 'LIKE', "%$keyword%");
            }
        });

        return $query;
    }

    public function scopeWhereLike($query, $column, $search)
    {
        if (empty($search)) return $query;

        $words = $this->splitToWords($search);
        $queries = $this->getSearchQueriesForColumn($column, 1, $words);

        $query->selectRaw(
            'max(' . implode(' + ', $queries) . ') as relevance',
            $this->search_bindings
        );

        return $query->orderBy('relevance', 'DESC')
            ->groupBy($this->getTable() . '.' . $this->primaryKey);
    }

    private function splitToWords($search)
    {
        $search = mb_strtolower(trim($search));
        preg_match_all('/(?:")((?:\\\\.|[^\\\\"])*)(?:")|(\S+)/', $search, $matches);
        $words = $matches[1];
        for ($i = 2; $i < count($matches); $i++) {
            $words = array_filter($words) + $matches[$i];
        }
        return $words;
    }
}
