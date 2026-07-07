<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\ResponseCache;
use App\Traits\HasRichText;

/**
 * Class BaseModel
 * @package App\Models
 */
class BaseModel extends Model
{
    use ResponseCache;
    use HasRichText;

    public function getFormattedUpdatedAtAttribute(): string
    {
        return to_date($this->attributes['updated_at'], 'd/m/Y');
    }

    public function getFormattedCreatedAtAttribute(): string
    {
        return to_date($this->attributes['created_at'], 'd/m/Y');
    }

    public function getCurrentUrlAttribute()
    {
        $default_locale = config('app.locale');

        $url = $this->url[strtoupper(current_locale())] ?? null;

        if (config('app.use_default_locale', true) && current_locale() != $default_locale && empty($url)) {
            $defaultUrl = $this->url[strtoupper($default_locale)] ?? null;

            $url = str_replace(env('APP_URL'), env('APP_URL') .  '/' . current_locale(), $defaultUrl);
        }

        return $url;
    }
}
