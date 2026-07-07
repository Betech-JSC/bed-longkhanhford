<?php

namespace JamstackVietnam\Core\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    public $rules = [
        'group' => 'nullable',
        'name' => 'nullable',
    ];

    public static function rules($id)
    {
        return [
            'general' => [
                'general_business_name' => 'required',
                'general_site_name' => 'nullable',
                'general_email' => 'nullable',

                'general_phone' => 'nullable',
                'general_fb_link' => 'nullable',
                'general_instagram_link' => 'nullable',
                'general_youtube_link' => 'nullable',
                'general_twitter_link' => 'required',
                'general_linkedin_link' => 'nullable',
                'general_zalo_link' => 'nullable',
                'general_message_fb_link' => 'nullable',

                'homepage_introduce_title' => 'nullable',
                'homepage_introduce_description' => 'nullable',
                'homepage_introduce_image' => 'nullable',
                'homepage_introduce_video' => 'nullable',

                'seo_title_separator' => 'nullable',
                'seo_meta_title' => 'nullable|max:170',
                'seo_meta_description' => 'nullable|max:255',
                'seo_meta_keywords' => 'nullable',
                'seo_meta_robots' => 'nullable',
                'seo_canonical' => 'nullable',
                'seo_image' => 'nullable',
                'seo_schemas' => 'nullable',

                'inject_head' => 'nullable',
                'inject_body_start' => 'nullable',
                'inject_body_end' => 'nullable',
            ],
            'smtp' => [
                'mail_from_address' => 'required|email',
                'mail_from_name' => 'required',
                'mail_username' => 'required',
                'mail_password' => 'required',
                'mail_host' => 'required',
                'mail_port' => 'required',
                'mail_encryption' => 'nullable',
            ],
            'notification' => [
                'notification_production_to' => 'required',
                'notification_staging_to' => 'required',
            ],
            'robots_txt' => [
                'robots_txt'  => 'required',
            ],
            'custom_vars' => [
                'custom_vars'  => 'nullable',
            ]
        ][$id] ?? [];
    }

    public static function customVariables($publicOnly = null)
    {
        $settings = cache_response('custom_vars', function () {
            $settings = settings()->group('custom_vars')->all()->first();
            $settings = collect(json_decode($settings, true));

            return $settings;
        }, 'settings');

        if (!is_null($publicOnly)) {
            $settings = $settings->where('is_public', $publicOnly);
        }

        $settings = $settings->pluck('value', 'key')->toArray();

        return $settings;
    }
}
