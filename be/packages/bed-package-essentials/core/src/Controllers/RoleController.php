<?php

namespace JamstackVietnam\Core\Controllers;

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
        foreach ($request->input('permissions') as $actions) {
            $permissions = array_merge(
                $permissions,
                collect($actions)->filter(fn ($action) => $action)->keys()->toArray()
            );
        }
        $item->syncPermissions($permissions);
    }
}
