<?php

namespace JamstackVietnam\Core\Traits;

use Illuminate\Support\Facades\Schema;
use JamstackVietnam\Core\Models\File;

trait HasRichText
{
    public static function bootHasRichText()
    {
        static::saving(function ($model) {
            if (request()->route() === null) {
                return;
            }

            $model->getAllRichTextColumns();
        });
    }

    private function getAllRichTextColumns()
    {
        $columns = Schema::getConnection()
            ->getDoctrineSchemaManager()
            ->listTableColumns($this->getTable());

        foreach ($columns as $column) {
            if ($column->getType()->getName() === 'text') {
                $this->storeExternalMedia($column->getName());
            };
        }
    }

    private function storeExternalMedia($field)
    {
        $this->{$field} = $this->matchContent($this->{$field});
    }

    private function matchContent($content)
    {
        if (is_array($content)) {
            foreach ($content as $key => $value) {
                $content[$key] = $this->matchContent($value);
            }

            return $content;
        } else if (empty($content)) {
            return;
        } else {
            $regex = '/src\s*=\s*"(.+?)"/m';
            preg_match_all($regex, $content, $matches, PREG_SET_ORDER, 0);

            if (!empty($matches)) {
                foreach ($matches as $match) {
                    $url = $match[1];

                    if (strstr($url, 'static/')) {
                        continue;
                    }

                    try {
                        $newUrl = (new File)->storeFromUrl($url);

                        if ($newUrl) {
                            $content = str_replace($url, '/static/' . $newUrl, $content);
                        }
                    } catch (\Exception$exception) {
                        logger()->error('Can not store image: ' . $url);
                        logger()->error($th->getMessage());
                    }
                }
            }
            return $content;
        }
    }
}
