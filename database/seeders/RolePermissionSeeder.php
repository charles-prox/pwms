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
        $utilityAdmin = Role::firstOrCreate(
            ['name' => 'utility-administrator'],
            ['description' => 'Oversees the entire PWMU environment. Manages utility configurations, user accounts, and permissions. Ensures utility integrity, compliance, and overall security.']
        );
        $itms = Role::firstOrCreate(
            ['name' => 'itms'],
            ['description' => 'Manages administrative functions such as user account creation, data backup, server maintenance, and monitoring utility storage. Supports users and ensures policy compliance.']
        );
        $supervisor = Role::firstOrCreate(
            ['name' => 'supervisor'],
            ['description' => 'Primary officer responsible for warehouse operations in regional offices. Supervises document custody, transfers, and compliance with storage protocols. Approves and processes storage, withdrawals, returns, and disposals.']
        );
        $user = Role::firstOrCreate(
            ['name' => 'user'],
            ['description' => 'Handles day-to-day document management activities. Submits requests for document storage, withdrawal, return, or disposal. Views assigned boxes and document statuses.']
        );
        $viewer = Role::firstOrCreate(
            ['name' => 'viewer'],
            ['description' => 'Primarily monitors utility activity without making changes. Provides oversight for data visibility and reporting.']
        );

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
