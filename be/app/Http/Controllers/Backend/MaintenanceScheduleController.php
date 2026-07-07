<?php
 
namespace App\Http\Controllers\Backend;
 
use App\Models\MaintenanceSchedule;
use Illuminate\Routing\Controller;
use App\Traits\HasCrudActions;
use Illuminate\Http\Request;
 
class MaintenanceScheduleController extends Controller
{
    use HasCrudActions;
 
    public $model = MaintenanceSchedule::class;

    public function beforeStore(Request $request, array $rules): array
    {
        foreach (['image', 'links'] as $key) {
            if ($request->has($key)) {
                $val = $request->input($key);
                if (is_string($val)) {
                    $decoded = json_decode($val, true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $request->merge([$key => $decoded]);
                    } else {
                        if ($key === 'image') {
                            $request->merge([$key => empty($val) ? null : ['path' => $val]]);
                        } else {
                            $request->merge([$key => []]);
                        }
                    }
                } elseif (is_null($val)) {
                    if ($key === 'image') {
                        $request->merge([$key => null]);
                    } else {
                        $request->merge([$key => []]);
                    }
                }
            }
        }

        return $rules;
    }
}
