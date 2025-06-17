<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class PositionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('positions')->insert([
            [
                'code' => 'sia_i',
                'name' => 'Social Insurance Assistant I',
                'abbreviation' => 'SIA-I',
            ],
            [
                'code' => 'ao_i',
                'name' => 'Admin Officer I',
                'abbreviation' => 'AO-I',
            ],
            [
                'code' => 'ao_ii',
                'name' => 'Admin Officer II',
                'abbreviation' => 'AO-II',
            ],
        ]);
    }
}
