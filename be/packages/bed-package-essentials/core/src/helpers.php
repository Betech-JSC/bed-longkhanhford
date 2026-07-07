<?php

if (!function_exists('package_path')) {
    function package_path($path)
    {
        return base_path('packages/bed-package-essentials/' . $path);
    }
}

if (!function_exists('static_url')) {
    function static_url($path, $parameters = [], $absolute = true)
    {
        if (!$path || str_contains($path, 'http') || str_starts_with($path, '//') || preg_match('/^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}|localhost)(:[0-9]+)?\//', $path)) return $path;

        $path = ltrim($path, '/');

        if (!empty($parameters)) {
            $url = route('files.show') . '/' . $path . '?' . http_build_query($parameters);
        } else {
            $url = route('files.show') . '/' . $path;
        }

        if (!$absolute) {
            $url = collect(parse_url($url))->only('path', 'query')->join(',');
        }

        if (config('app.static_url') && !isset(config('app.static_url')['port'])) {
            $url = preg_replace("/static:[0-9]+/", "static", $url);
        }

        return $url;
    }
}

if (!function_exists('to_domain')) {
    function to_domain($url)
    {
        if (empty($url)) return $url;

        return parse_url($url, PHP_URL_SCHEME) . '://' . parse_url($url, PHP_URL_HOST);
    }
}

if (!function_exists('transform_seo')) {
    function transform_seo($model)
    {
        return [
            'seo_meta_title' => $model->seo_meta_title ?? $model->title ?? env('APP_NAME'),
            'seo_slug' => $model->seo_slug ?? $model->slug,
            'seo_meta_description' => $model->seo_meta_description ?? $model->description,
            'seo_meta_keywords' => $model->seo_meta_keywords,
            'seo_meta_robots' => $model->seo_meta_robots,
            'seo_canonical' => $model->seo_canonical,
            'seo_image' => static_url($model->seo_image ?? $model->image_url ?? 'cover.jpg'),
            'seo_schemas' => $model->seo_schemas,
        ];
    }
}

if (!function_exists('generate_code')) {
    function generate_code($length = 15, $characters = 'all'): string
    {
        $characters = [
            'all' => '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'number' => '0123456789',
            'uppercase' => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            'lowercase' => 'abcdefghijklmnopqrstuvwxyz',
        ][$characters];

        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $randomString;
    }
}

if (!function_exists('cache_response')) {
    function cache_response($key, $handle, ...$tags)
    {
        array_unshift($tags, 'cache_response');
        if (config('lada-cache.active', false)) {
            return Illuminate\Support\Facades\Cache::tags($tags)
                ->rememberForever($key, $handle);
        } else {
            return $handle();
        }
    }
}

if (!function_exists('current_admin_id')) {
    function current_admin_id()
    {
        return auth()->guard('admin')->user()->id;
    }
}

if (!function_exists('current_admin')) {
    function current_admin()
    {
        return auth()->guard('admin')->user();
    }
}

if (!function_exists('to_number')) {
    function to_number($number)
    {
        $number = is_numeric($number) ? $number : 0;
        return number_format($number, 0, '.', '.');
    }
}

if (!function_exists('to_money')) {
    function to_money($number, $symbol = '₫')
    {
        return to_number($number) . ' ' . $symbol;
    }
}

if (!function_exists('to_date')) {
    function to_date($date, $format = 'd/m/Y H:i')
    {
        if (empty($date)) return '';

        return ucfirst(Illuminate\Support\Carbon::create($date)
            ->setTimezone(config('app.timezone'))
            ->translatedFormat($format));
    }
}

if (!function_exists('is_localhost')) {
    function is_localhost(): bool
    {
        return in_array(request()->getHost(), ['localhost', '127.0.0.1']);
    }
}

if (!function_exists('current_locale')) {
    function current_locale()
    {
        $default = config('localized-routes.omit_url_prefix_for_locale') ?? config('app.locale');

        if (request()->route() === null) return $default;

        $routeName = request()->route()->getName();
        if (empty($routeName)) return $default;

        $routeNames = explode('.', $routeName);

        if (in_array($routeNames[0], config('app.locales'))) {
            return $routeNames[0];
        }

        if (!in_array($routeNames[0], config('app.locales')) && $routeNames[0] == 'admin' && !in_array('helper', $routeNames)) {
            return request()->session()->get('session_locale') ?? $default;
        }

        $prefix = request()->route()->getPrefix();
        $segments = explode('/', $prefix);

        $lang = last($segments) ? last($segments) : $default;

        if (head($segments) === 'admin') {
            if (count($segments) === 1) {
                $lang = $default;
            }
        }

        if (request()->has('use_locale')) {
            $lang = request()->input('use_locale');
        }

        if (!in_array($lang, config('app.locales'))) {
            return config('app.locale');
        }

        return $lang;
    }
}

if (!function_exists('notification_to')) {
    function notification_to()
    {
        if (!is_localhost()) {
            return settings()->group('notification')->get('notification_production_to', null);
        } else {
            return settings()->group('notification')->get('notification_staging_to', null);
        }
    }
}

if (!function_exists('replace_layout')) {
    function replace_layout($content)
    {
        preg_match_all('/(?<=Embed)[^><]+?(?=])/', $content, $matches);
        foreach ($matches[0] as $match) {
            $content = str_replace("[Embed$match]", "<Embed$match />", $content);
        }
        return $content;
    }
}

if (!function_exists('replace_layout_product')) {
    function replace_layout_product($content)
    {
        return $content;
    }
}

if (!function_exists('transform_richtext')) {
    function transform_richtext($content)
    {
        $content = replace_layout_product($content);

        // add_responsive_iframe
        $content = replace_layout($content);

        // replace_image_url
        if (empty($content)) {
            return $content;
        }

        preg_match_all(
            '/src\s*=\s*"(.+?)"/m',
            $content,
            $matches,
            PREG_SET_ORDER,
            0
        );

        if (empty($matches)) {
            return $content;
        }

        $matches = collect($matches)->unique();

        foreach ($matches as $match) {
            $url = $match[1];
            if (str_contains($url, 'http')) continue;

            $newUrl = static_url(str_replace('/static/', '', $url));
            try {
                $content = str_replace($url, $newUrl, $content);
            } catch (\Exception $exception) {
                logger('transform_richtext');
                logger($exception->getMessage());
                logger($url);
                logger('-------------------');
            }
        }
        return $content;
    }
}

if (!function_exists('setting_bar')) {
    function setting_bar()
    {
        return [
            'general' => config('core.setting.form.general.enable', true),
            'robots_txt' => config('core.setting.form.robots_txt.enable', true),
            'notification' => config('core.setting.form.notification.enable', true),
            'smtp' => config('core.setting.form.smtp.enable', true),
            'custom_vars' => config('core.setting.form.custom_vars.enable', true),
            'info' => config('core.setting.info.enable', true),
            'email' => config('core.setting.email.enable', true)
        ];
    }
}

if (!function_exists('clear_cache')) {
    function clear_cache($tags = [])
    {
        if (config('cache.default') === 'redis') {
            Illuminate\Support\Facades\Cache::tags($tags)->flush();
            Illuminate\Support\Facades\Artisan::call('lada-cache:flush');
        }
        return true;
    }
}

if (!function_exists('utf8_for_xml')) {
    function utf8_for_xml($string)
    {
        return preg_replace('/[^\x{0009}\x{000a}\x{000d}\x{0020}-\x{D7FF}\x{E000}-\x{FFFD}]+/u', ' ', $string);
    }
}
