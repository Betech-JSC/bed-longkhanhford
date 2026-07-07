<?php

namespace JamstackVietnam\Core\Database\Seeders;

use JamstackVietnam\Core\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            ['name' => 'Super Admin', 'guard_name' => 'admin'],
            ['name' => 'Editor', 'guard_name' => 'admin']
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate($role);
        }

        $this->createAdmin();
        $this->createPermissions();
    }

    private function createAdmin()
    {
        Admin::query()->firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'status' => 1,
                'name' => 'Admin',
                'password' => Hash::make('admin@gmail.com')
            ]
        );
    }


    public static function createPermissions()
    {
        $permissions = [];
        $locale = config('app.locale');

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
                $permissions[] = str_replace("$locale.admin.", "admin.", $name);
            }
        }

        $unusedPermissions = Permission::pluck('name')->diff($permissions);
        Permission::whereIn('name', $unusedPermissions)->delete();

        foreach ($permissions as $permission) {
            Permission::updateOrCreate([
                'name' => $permission,
                'guard_name' => 'admin'
            ]);
        }

        $role = Role::first()->syncPermissions($permissions);
        Admin::first()->assignRole($role);
    }
}
