<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\BaseModel;
use App\Traits\Searchable;

class Region extends BaseModel
{
    use HasFactory, Searchable;
    public $timestamps = false;

    public const SHIPPING_PRICE = "50000.00";

    public $fillable = [
        'country_id',
        'level',
        'code',
        'parent_code',
        'type',
        'name',
        'name_with_type',
        'path',
        'path_with_type',
        'sort',
        'shipping_price',
    ];

    public function rules()
    {
        return [
            'code' => 'required',
            'level' => 'required',
            'sort' => 'required',
        ];
    }

    protected $searchable = [
        'columns' => [
            'regions.name' => 10,
            'regions.name_with_type' => 5,
            'regions.path_with_type' => 5,
            'regions.shipping_price' => 5,
        ],
    ];


    protected static function booted()
    {
        static::saving(function (self $model) {
            if ($model->shipping_price == 0) {
                $model->shipping_price = null;
            }
        });
    }

    public function getProvincy()
    {
        return self::getCities()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item['code'],
                    'name' => $item['name_with_type']
                ];
            });
    }

    public function getDistrict()
    {
        $request = request()->all();
        return self::select('name_with_type', 'parent_code', 'code', 'id')
            ->where('parent_code', $request['params']['province_id'])
            ->orderBy('sort', 'desc')
            ->orderBy('name_with_type')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item['code'],
                    'name' => $item['name_with_type']
                ];
            });
    }

    public function getWard()
    {
        $request = request()->all();
        return self::select('name_with_type', 'parent_code', 'code', 'id')
            ->where('parent_code', $request['params']['district_id'])
            ->orderBy('sort', 'desc')
            ->orderBy('name_with_type')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item['code'],
                    'name' => $item['name_with_type']
                ];
            });
    }

    public function scopeGetCities($query)
    {
        return $query
            ->where('parent_code', null)
            ->orderBy('sort', 'desc')
            ->orderBy('name_with_type');
    }

    public function scopeGetDistricts($query, $city_code)
    {
        return $query
            ->select('name_with_type', 'parent_code', 'code', 'id')
            ->where('parent_code', $city_code)
            ->orderBy('sort', 'desc')
            ->orderBy('name_with_type')
            ->get()
            ->toArray();
    }

    public function scopeGetWards($query, $district_code)
    {
        return $query
            ->select('name_with_type', 'parent_code', 'code', 'id')
            ->where('parent_code', $district_code)
            ->orderBy('sort', 'desc')
            ->orderBy('name_with_type')
            ->get()
            ->toArray();
    }

    public function scopeCodeToId($query, $code)
    {
        try {
            return $query->where('code', $code)->first()->id;
        } catch (\Throwable $th) {
            return null;
        }
    }

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_code', 'code');
    }

    public function children()
    {
        return $this->hasMany(self::class, 'parent_code', 'code');
    }

    public function nodes()
    {
        return $this->children()
            ->with('nodes')
            ->sortByPosition();
    }

    public function getShippingPrice()
    {
        $request = request()->all();

        $shippingPrice = self::SHIPPING_PRICE;

        $ward = self::with('parent.parent')
            ->where('code', $request['params']['code'])->first();

        if ($ward->id) {
            return $ward->shipping_price || $ward->parent->shipping_price || $ward->parent->parent->shipping_price || $shippingPrice;
        }

        return $shippingPrice;
    }

    public static function getRoot()
    {
        return static::with(['nodes'])
            ->sortByPosition()
            ->whereParent()
            ->get();
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort) OR sort = 0, sort ASC')
            ->orderBy('id', 'desc');
    }

    public function scopeWhereParent($query)
    {
        return $query->whereNull('parent_code')->orWhere('parent_code', 0);
    }

    public function scopeSortByProvincy($query)
    {
        return $query->orderByRaw('ISNULL(sort) OR sort = 0, sort ASC')
            ->orderBy('level', 'asc')
            ->orderBy('id', 'desc');
    }
}
