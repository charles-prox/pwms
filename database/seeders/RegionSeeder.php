<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('regions')->insert([
            'name' => 'PhilHealth Regional Office X',
            'address' => 'Cagayan de Oro City',
            'pro_office' => '10',
            'pro_code' => '15',
        ]);
    }
}
