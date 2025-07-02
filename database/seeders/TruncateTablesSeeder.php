<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TruncateTablesSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks
        DB::statement('SET session_replication_role = replica'); // PostgreSQL version of "SET FOREIGN_KEY_CHECKS=0" (MySQL)

        DB::table('documents')->truncate();
        DB::table('boxes')->truncate();
        DB::table('requests')->truncate();

        DB::statement('SET session_replication_role = DEFAULT');
    }
}
