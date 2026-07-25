<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Support\Str;
use Illuminate\Routing\Controller;
use JamstackVietnam\Core\Models\Role;
use JamstackVietnam\Core\Traits\HasCrudActions;
use Illuminate\Support\Facades\Route;

class RoleController extends Controller
{
    use HasCrudActions;

    public $model = Role::class;

    private function folder()
    {
        return "@Core/" . Str::studly($this->getTable());
    }

    private function afterForm($item)
    {
        if (empty($item->id)) {
            $item = new Role();
        }

        return [
            ...$item->toArray(),
            'permissions' => Role::getPermissions($item)
        ];
    }

    private function afterStore($request, $item)
    {
        $permissions = [];
        if ($request->has('permissions') && is_array($request->input('permissions'))) {
            foreach ($request->input('permissions') as $actions) {
                $permissions = array_merge(
                    $permissions,
                    collect($actions)->filter(fn($action) => $action)->keys()->toArray()
                );
            }
        }

        foreach ($permissions as $permissionName) {
            \Spatie\Permission\Models\Permission::firstOrCreate([
                'name' => $permissionName,
                'guard_name' => 'admin',
            ]);
        }

        $item->syncPermissions($permissions);
    }
}
