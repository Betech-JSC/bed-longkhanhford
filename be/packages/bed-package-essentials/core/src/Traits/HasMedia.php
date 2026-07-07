<?php

namespace JamstackVietnam\Core\Traits;

use JamstackVietnam\Core\Models\File;

trait HasMedia
{
    /**
     * The "booting" method of the trait.
     *
     * @return void
     */
    public static function bootHasMedia()
    {

        static::saved(function ($model) {
            $mediaFields = $model->mediaFields;

            if (!empty($mediaFields)) {
                foreach ($mediaFields as $field) {
                    if (!request()->has($field)) continue;

                    $data = request($field, []);

                    if (!empty($data) && !is_array(head($data))) {
                        $data = [$data];
                    }

                    $model->syncFiles($field, $data);
                }
            }
        });
    }

    /**
     * Get all of the files for the entity.
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphToMany
     */
    public function files()
    {
        return $this->morphToMany(File::class, 'entity', 'entity_files')
            ->withPivot(['id', 'zone'])
            ->withTimestamps();
    }

    /**
     * Filter files by zone.
     *
     * @param string $zone
     * @return \Illuminate\Database\Eloquent\Category
     */
    public function filterFiles($zone)
    {
        return $this->files()->wherePivot('zone', $zone);
    }

    /**
     * Sync files for the entity.
     *
     * @param array $files
     */

    public function syncFiles($zone, $files = [])
    {
        $this->filterFiles($zone)->detach();

        $entityType = get_class($this);
        $syncList = [];
        foreach ($files as $file) {
            $syncList[$file['id']] = [
                'zone' => $zone,
                'entity_type' => $entityType
            ];
        }
        $this->filterFiles($zone)->attach($syncList);
    }

    public function getFilePath($field)
    {
        $file =  $this->getFile($field);
        return $file->static_url ?? null;
    }

    public function getFile($field)
    {
        return $this->files->where('pivot.zone', $field)->first();
    }

    public function getFilePaths($field)
    {
        return $this->files
            ->where('pivot.zone', $field)
            ->pluck('static_url');
    }

    public function getFiles($field)
    {
        try {
            $files = $this->files->where('pivot.zone', $field)->toArray();
            return array_values($files);
        } catch (\Throwable $th) {
            if (env('APP_ENV') === 'local') throw $th;
            return [];
        }
    }
}
