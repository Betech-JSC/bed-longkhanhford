<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\UsedVehicle\UsedVehicle;
use App\Traits\HasCrudActions;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;

class UsedVehicleController extends Controller
{
    use HasCrudActions;

    public $model = UsedVehicle::class;

    public $with = [
        'form' => ['translations'],
    ];

    private function beforeStore(Request $request, array $rules): array
    {
        // Xử lý các trường JSON dạng mảng (image, images)
        $arrayKeys = [
            'image',
            'images',
        ];

        foreach ($arrayKeys as $key) {
            if ($request->has($key)) {
                $val = $request->input($key);
                if (is_string($val)) {
                    $decoded = json_decode($val, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $request->merge([$key => $decoded]);
                    } else {
                        $request->merge([$key => empty($val) ? [] : [$val]]);
                    }
                } elseif (is_null($val)) {
                    $request->merge([$key => []]);
                }
            }
        }

        return $rules;
    }
}
