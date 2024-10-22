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
        /* 
        This role usually has unrestricted access to all features and 
        functionalities of the admin dashboard, including user 
        management, settings, and content management. 
        */
        Role::create(['name' => 'super-admin']);

        // Create Admin role
        /*         
        Admins often have similar permissions to super admins but may 
        have restrictions on certain sensitive operations or settings.
        */
        Role::create(['name' => 'admin']);

        // Create User role
        /* Regular users or the end users who uses the application regularly */
        Role::create(['name' => 'user']);

        // Create Viewer/Guest role
        /* 
        This role could represent users who have limited access to the dashboard, 
        perhaps only being able to view data or reports without the ability to make changes.
        */
        Role::create(['name' => 'viewer']);
    }
}
