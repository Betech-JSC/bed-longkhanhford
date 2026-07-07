<?php

namespace App\Models;

use App\Models\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class CmsManual extends BaseModel
{
    use SoftDeletes;

    protected $table = 'cms_manuals';

    public const STATUS_ACTIVE   = 'ACTIVE';
    public const STATUS_INACTIVE = 'INACTIVE';

    public const STATUS_LIST = [
        self::STATUS_ACTIVE   => 'Hiển thị',
        self::STATUS_INACTIVE => 'Ẩn',
    ];

    protected $fillable = [
        'title',
        'slug',
        'content',
        'status',
        'sort_order',
    ];

    public function rules(): array
    {
        return [
            'title'      => 'required|string|max:255',
            'slug'       => 'nullable|string|max:255|unique:cms_manuals,slug,' . $this->id,
            'content'    => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'status'     => 'required|string|in:ACTIVE,INACTIVE',
        ];
    }

    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeSortByPosition($query)
    {
        return $query->orderByRaw('ISNULL(sort_order) OR sort_order = 0, sort_order ASC')
            ->orderBy('id', 'desc');
    }

    public function transform(): array
    {
        return [
            'id'         => $this->id,
            'title'      => $this->title,
            'slug'       => $this->slug,
            'content'    => $this->content,
            'sort_order' => $this->sort_order,
            'status'     => $this->status,
            'created_at' => $this->formatted_created_at,
            'updated_at' => $this->formatted_updated_at,
        ];
    }
}
