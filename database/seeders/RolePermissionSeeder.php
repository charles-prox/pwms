<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Permissions list for PWMU
        $permissions = [
            // User Management (ITMS / Utility Admin)
            'user.view',
            'user.create',
            'user.update',
            'user.activate',
            'user.deactivate',

            // Requests
            'request.create',
            'request.view',
            'request.cancel',
            'request.generate-box-code',

            // Approvals (Supervisor / Admin)
            'request.approve.storage',
            'request.approve.withdrawal',
            'request.approve.return',
            'request.approve.disposal',

            // Warehouse Actions
            'warehouse.receive',
            'warehouse.release',
            'warehouse.return',
            'warehouse.verify',
            'warehouse.update-location',

            // Box & Document View
            'box.view',
            'document.view',
            'rds.view',

            // Report Generation (everyone except ITMS)
            'report.generate',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Fetch updated roles
        $utilityAdmin = Role::firstOrCreate(['name' => 'utility-administrator']);
        $itms = Role::firstOrCreate(['name' => 'itms']);
        $supervisor = Role::firstOrCreate(['name' => 'supervisor']);
        $user = Role::firstOrCreate(['name' => 'user']);
        $viewer = Role::firstOrCreate(['name' => 'viewer']);

        // Assign permissions per role

        // Utility Admin = all permissions
        $utilityAdmin->syncPermissions(Permission::all());

        // ITMS = user management + view only (no report generation)
        $itms->syncPermissions([
            'user.view',
            'user.create',
            'user.update',
            'user.activate',
            'user.deactivate',
            'box.view',
            'document.view',
        ]);

        // Supervisor = full warehouse approval workflow + report
        $supervisor->syncPermissions([
            'request.view',
            'request.approve.storage',
            'request.approve.withdrawal',
            'request.approve.return',
            'request.approve.disposal',
            'box.view',
            'document.view',
            'rds.view',
            'report.generate',
            'request.generate-box-code',
        ]);

        // Standard User = create and view requests only + report
        $user->syncPermissions([
            'request.create',
            'request.view',
            'request.cancel',
            'box.view',
            'document.view',
            'rds.view',
            'report.generate',
            'request.generate-box-code',
        ]);

        // Viewer = read only + report
        $viewer->syncPermissions([
            'request.view',
            'box.view',
            'document.view',
            'rds.view',
            'report.generate',
        ]);
    }
}
