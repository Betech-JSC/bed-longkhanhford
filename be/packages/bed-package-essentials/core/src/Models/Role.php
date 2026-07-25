<?php

namespace JamstackVietnam\Core\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory;

    public $fillable = [
        'name',
        'guard_name'
    ];

    public $rules = [
        'name' => 'required|max:255',
    ];

    public static function getRoles()
    {
        $query = self::query();
        if (!current_admin()->hasRole('Super Admin')) {
            $query->whereNot('name', 'Super Admin');
        }
        return $query->get();
    }

    public static function getPermissions($role)
    {
        $permissions = [];
        $locale = config('app.locale');
        $rolePermissions = $role->getPermissionNames()->toArray();

        foreach (Route::getRoutes()->getRoutes() as $route) {
            $action = $route->getAction();
            $name = $route->getName();

            if (
                $name && isset($action['controller']) &&
                (Str::startsWith($name, 'admin.') ||
                    Str::startsWith($name, "$locale.admin.")) &&
                !Str::startsWith($name, 'admin.helper') &&
                !str_contains($action['controller'], 'Controllers\Auth')
            ) {
                $fullAction = str_replace("$locale.admin.", "admin.", $name);
                $parts = explode('.', $fullAction);
                if (count($parts) < 2) continue;
                $tables = $parts[1];

                // Auto-create permission in DB if it does not exist
                \Spatie\Permission\Models\Permission::firstOrCreate([
                    'name' => $fullAction,
                    'guard_name' => 'admin',
                ]);

                $permissions[$tables][$fullAction] = in_array($fullAction, $rolePermissions);
            }
        }
        return $permissions;
    }
}
