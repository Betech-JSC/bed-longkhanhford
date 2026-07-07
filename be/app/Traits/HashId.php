<?php

namespace App\Traits;

use Haruncpi\LaravelIdGenerator\IdGenerator;

trait HashId
{
    public static function generateId(): int
    {
        try {
            return IdGenerator::generate(['table' => (new self())->getTable(), 'field' => 'hash_id', 'length' => 10, 'prefix' => date('ym')]);
        } catch (\Exception $e) {
            return 0;
        }
    }

    public static function generateIdByPrefix($prefix = "BE", $field = 'hash_id', $length = 8): string
    {
        try {
            return IdGenerator::generate(['table' => (new self())->getTable(), 'field' => $field, 'length' => $length, 'prefix' => $prefix]);
        } catch (\Exception $e) {
            return '';
        }
    }
}
