<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use JamstackVietnam\Core\Models\BaseModel;

class CustomerHandoverTranslation extends BaseModel
{
    use HasFactory;

    public $timestamps = false;

    public $fillable = [
        'locale',
        'title',
    ];

    public function customerHandover()
    {
        return $this->belongsTo(CustomerHandover::class);
    }
}
