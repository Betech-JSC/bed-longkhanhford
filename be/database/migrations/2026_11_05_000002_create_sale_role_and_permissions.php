<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $saleRole = Role::firstOrCreate([
            'name' => 'Sale',
            'guard_name' => 'admin',
        ]);

        $permissions = [
            'admin.landing-pages.index',
            'admin.landing-pages.form',
            'admin.landing-pages.store',
            'admin.landing-pages.destroy',
            'admin.landing-pages.duplicate',
            'admin.sales-consultants.index',
            'admin.sales-consultants.form',
            'admin.sales-consultants.store',
            'admin.contacts.index',
            'admin.contacts.form',
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate([
                'name' => $perm,
                'guard_name' => 'admin',
            ]);
        }

        $saleRole->syncPermissions($permissions);
    }

    public function down(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $saleRole = Role::where('name', 'Sale')->where('guard_name', 'admin')->first();
        if ($saleRole) {
            $saleRole->delete();
        }
    }
};
