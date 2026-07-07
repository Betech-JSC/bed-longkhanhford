<?php

namespace App\Models;

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

                'general_logo' => 'nullable',
                'general_logo_footer' => 'nullable',
                'general_favicon' => 'nullable',

                'general_company_address' => 'nullable',
                'general_company_phone' => 'nullable',
                'general_company_hotline' => 'nullable',
                'general_company_map_iframe' => 'nullable',
                'general_company_tax_code' => 'nullable',
                'general_company_working_hours' => 'nullable',
                'general_company_copyright' => 'nullable',

                'social_facebook' => 'nullable',
                'social_youtube' => 'nullable',
                'social_zalo' => 'nullable',

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
            ],
            'installment' => [
                'installment_rate_year_1' => 'required|numeric|min:0|max:30',
                'installment_rate_subsequent' => 'required|numeric|min:0|max:30',
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
