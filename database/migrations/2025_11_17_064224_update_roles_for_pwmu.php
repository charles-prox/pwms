<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\Models\Role;

return new class extends Migration
{
    public function up(): void
    {
        $rolesMap = [
            'super-admin' => [
                'name' => 'utility-administrator',
                'description' => 'Oversees the entire PWMU environment. Manages utility configurations, user accounts, and permissions. Ensures utility integrity, compliance, and overall security.'
            ],
            'admin' => [
                'name' => 'itms',
                'description' => 'Manages administrative functions such as user account creation, data backup, server maintenance, and monitoring utility storage. Supports users and ensures policy compliance.'
            ],
            'regional-document-custodian' => [
                'name' => 'supervisor',
                'description' => 'Primary officer responsible for warehouse operations in regional offices. Supervises document custody, transfers, and compliance with storage protocols. Approves and processes storage, withdrawals, returns, and disposals.'
            ],
            'user' => [
                'name' => 'user',
                'description' => 'Handles day-to-day document management activities. Submits requests for document storage, withdrawal, return, or disposal. Views assigned boxes and document statuses.'
            ],
            'viewer' => [
                'name' => 'viewer',
                'description' => 'Primarily monitors utility activity without making changes. Provides oversight for data visibility and reporting.'
            ],
        ];

        foreach ($rolesMap as $oldName => $newData) {
            $role = Role::where('name', $oldName)->first();

            if ($role) {
                // Update existing role
                $role->name = $newData['name'];
                $role->description = $newData['description'];
                $role->save();
            } else {
                // Create new role if it doesn't exist
                Role::create($newData);
            }
        }
    }

    public function down(): void
    {
        // Optional: revert to old roles if needed
        $rolesMap = [
            'utility-administrator' => 'super-admin',
            'itms' => 'admin',
            'supervisor' => 'regional-document-custodian',
            // user and viewer remain the same
        ];

        foreach ($rolesMap as $newName => $oldName) {
            $role = Role::where('name', $newName)->first();
            if ($role) {
                $role->name = $oldName;
                $role->save();
            }
        }
    }
};
