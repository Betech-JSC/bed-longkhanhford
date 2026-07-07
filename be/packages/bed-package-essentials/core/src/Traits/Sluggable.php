<?php

namespace JamstackVietnam\Core\Traits;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

trait Sluggable
{
    public static function bootSluggable()
    {
        static::saving(function ($entity) {
            $entity->setUniqueSlug();
        });
    }

    public function setUniqueSlug($value = null)
    {
        if (is_null($value)) {
            $value = $this->getAttribute($this->slugAttribute);
        }

        $this->attributes['slug'] = $this->generateSlug($value);
    }

    private function generateSlug($value, $loop = 0)
    {
        $slug = Str::slug($value);
        $slug = empty($slug) ? Str::slug(generate_code()) : $slug;

        if ($loop > 0) $slug .= $loop;

        $query = $this->where('id', '!=', $this->id)->where('slug', $slug)->withoutGlobalScope('active');

        if (Arr::has(class_uses($this), SoftDeletes::class)) {
            $query->withTrashed();
        }

        if ($query->exists()) {
            return $this->generateSlug($slug, ++$loop);
        }
        return $slug;
    }
}
