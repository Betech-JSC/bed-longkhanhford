<?php

namespace JamstackVietnam\Core\Traits;

use Illuminate\Support\Facades\Log;

trait ReplaceUrlRichText
{
    private function replace_app_url($value)
    {
        if (!$this->is_api()) return $value;

        $value = $this->add_responsive_iframe($value);
        $value = $this->replace_image_url($value);
        return $value;
    }

    private function add_responsive_iframe($value)
    {
        return preg_replace(
            '/(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))/',
            '<div class="aspect-video">$0</div>',
            $value
        );
    }

    private function replace_image_url($value)
    {
        $regex = '/src\s*=\s*"(.+?)"/m';

        if (empty($value)) {
            return $value;
        }

        preg_match_all($regex, $value, $matches, PREG_SET_ORDER, 0);
        if (empty($matches)) {
            return $value;
        }

        foreach ($matches as $match) {
            $url = $match[1];

            if (!str_contains($url, 'storage/media/')) continue;

            $newUrl = config('app.url') . "/" . strstr($url, 'storage/media/');

            try {
                $value = str_replace($url, $newUrl, $value);
            } catch (\Exception $exception) {
                Log::error('-------------------');
                Log::error($exception->getMessage());
                Log::error($url);
                Log::error('-------------------');
            }
        }
        return $value;
    }

    private function is_api()
    {
        return request()->is('api*');
    }
}
