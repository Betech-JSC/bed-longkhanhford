<?php

namespace JamstackVietnam\Job\Models;

use JamstackVietnam\Core\Models\BaseModel;

class JobRefOption extends BaseModel
{
    protected $table = 'job_ref_options';
    public $timestamps = false;
    public $incrementing = false;
    public $primaryKey = null;

    public $fillable = [
        'job_id',
        'option_id',
        'position',
        'is_required',
    ];

    public static function storeJobOption()
    {
        $optionRefs = self::query()->get();
        foreach ($optionRefs as $optionRef) {
            if (!empty($optionRef->option)) {
                $data = [
                    'option_id' => $optionRef->option->parent_id,
                    'job_id' => $optionRef->job_id,
                ];

                self::updateOrCreate($data, array_merge($data, [
                    'is_required' => true
                ]));
            }
        }
    }

}
