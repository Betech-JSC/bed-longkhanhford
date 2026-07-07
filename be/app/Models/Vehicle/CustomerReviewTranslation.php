<?php

namespace App\Models\Vehicle;

use App\Models\BaseModel;

class CustomerReviewTranslation extends BaseModel
{
    protected $table = 'customer_review_translations';

    public $timestamps = false;

    protected $fillable = [
        'customer_name',
        'content',
    ];
}
