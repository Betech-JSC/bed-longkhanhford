<?php

namespace JamstackVietnam\Translation\Models;
use Illuminate\Database\Eloquent\Model;

class Translation extends Model
{
    public $fillable = [
        'locale',
        'key',
        'value',
    ];

    public $rules = [
        'locale' => 'required',
        'key' => 'required',
        'value' => 'required',
    ];

    public static function updateOrCreateData($data)
    {
        static::updateOrCreate([
            'key' => trim($data['key']),
            'locale' => $data['locale']
        ], [
            'value' => $data['value']
        ]);
    }

    public static function encodeEmail($value) {
        if (str_contains($value, '@')) {
            return str_replace('@', '\x40', $value);
        }
        return $value;
    }

    public static function decodeEmail($value) {
        if (str_contains($value, '\x40')) {
            return str_replace('\x40', '@', $value);
        }
        return $value;
    }
}
