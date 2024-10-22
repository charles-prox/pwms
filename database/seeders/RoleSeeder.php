<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin role
        Role::create([
            'name' => 'super-admin',
            'description' => 'Has unrestricted access to all features and functionalities.'
        ]);

        // Create Admin role
        Role::create([
            'name' => 'admin',
            'description' => 'Has access to admin functionalities with some restrictions.'
        ]);

        // Create User role
        Role::create([
            'name' => 'user',
            'description' => 'Regular user with basic access to the application.'
        ]);

        // Create Viewer/Guest role
        Role::create([
            'name' => 'viewer',
            'description' => 'Limited access to view data or reports.'
        ]);

        // Create Property Accountable Officer(PAO) role
        Role::create([
            'name' => 'regional-document-custodian',
            'description' => 'Officer responsible for warehouse managment.'
        ]);
    }
}
