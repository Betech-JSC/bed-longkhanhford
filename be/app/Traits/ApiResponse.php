<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

trait ApiResponse
{
    protected function success($data = [], $message = 'OK', $status = 200)
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message,
        ], $status);
    }

    protected function empty(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Not Found',
        ], 404);
    }

    /**
     * @return JsonResponse
     */
    public function delete(): JsonResponse
    {
        return response()->json('', 204);
    }

    protected function failure($message, $status = 400, $errors = null)
    {
        $status = $status === 'error_account_not_logged_in' ? 401 : $status;
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    protected function cache_response($handle, $tags = ['api'])
    {
        $fullUrl = app()->getLocale() . request()->fullUrl();
        if (env('CACHE_RESPONSE_API', true) && strlen($fullUrl) < 300) {
            return Cache::tags($tags)->rememberForever(
                $fullUrl,
                $handle
            );
        } else {
            return $handle();
        }
    }
}
