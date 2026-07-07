<?php

namespace App\Helpers;

use Exception;
use Illuminate\Support\Facades\Http;

use JamstackVietnam\Core\Models\Setting;

class FacebookConversionsAPI
{
    public static function sendConversionEvent($eventName, $eventData)
    {
        try {
            $facebook = Setting::customVariables();

            $appId = $facebook['FACEBOOK_APP_ID'] ?? null;
            $appSecret = $facebook['FACEBOOK_APP_SECRET'] ?? null;
            $accessToken = $facebook['FACEBOOK_CONVERSIONS_API_ACCESS_TOKEN'] ?? null;
            $pixelId = $facebook['FACEBOOK_PIXEL_ID'] ?? null;

            if (empty($appId) || empty($appSecret) || empty($accessToken) || empty($pixelId)) return true;

            Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post('https://graph.facebook.com/v16.0/' . $pixelId . '/events', [
                'data' => [
                    [
                        'event_name' => $eventName,
                        'event_time' => time(),
                        'user_data' => [
                            'client_ip_address' => $_SERVER['REMOTE_ADDR'],
                            'client_user_agent' => $_SERVER['HTTP_USER_AGENT'],
                        ],
                        'custom_data' => $eventData,
                        'event_source_url' => url()->current(),
                        'action_source' => 'website',
                    ],
                ],
                'access_token' => $accessToken,
            ])->json();

        } catch (Exception $e) {
            if (config('app.debug')) throw $e;
        }
    }
}
