<?php

namespace App\Models\Slider;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\BaseModel;

class SliderTranslation extends BaseModel
{
    use HasFactory;

    public $timestamps = false;

    public $fillable = [
        'slider_id',
        'locale',
        'title',
        'description',
        'link',
        'target',
        'image',
        'image_mobile',
        'custom_fields'
    ];

    public $casts = [
        'image_mobile' => 'array',
        'image' => 'array',
        'custom_fields' => 'array'
    ];

    public function slider()
    {
        return $this->belongsTo(Slider::class);
    }
}
