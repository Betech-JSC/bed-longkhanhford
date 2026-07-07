<?php

if (!function_exists('lang_path_group')) {
    /**
     * @param string $path
     * @return string
     */
    function lang_path_group($path = '', $prefix = 'Frontend/')
    {
        return resource_path($prefix . 'lang' . ($path !== '' ? DIRECTORY_SEPARATOR . $path : ''));
    }
}
