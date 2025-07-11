<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define floor options
        $floors = ['ground', 'mezzanine'];

        foreach ($floors as $floor) {
            for ($rack = 1; $rack <= 36; $rack++) {
                for ($bay = 1; $bay <= 3; $bay++) {
                    for ($level = 1; $level <= 4; $level++) {
                        Location::create([
                            'floor' => $floor,
                            'rack' => $rack,
                            'bay' => $bay,
                            'level' => $level,
                            'office_id' => null,
                        ]);
                    }
                }
            }
        }


        $this->command->info('✅ Location seeding completed!');
    }
}
