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

        // Loop through all racks (1-36)
        for ($rack = 1; $rack <= 36; $rack++) {
            // Each rack has 3 bays
            for ($bay = 1; $bay <= 3; $bay++) {
                // Each bay has 4 levels
                for ($level = 1; $level <= 4; $level++) {
                    Location::create([
                        'floor' => $floors[array_rand($floors)], // Assign random floor
                        'rack' => $rack,
                        'bay' => $bay,
                        'level' => $level,
                        'office_id' => null, // Set office_id as NULL, manually assigned later
                    ]);
                }
            }
        }

        $this->command->info('✅ Location seeding completed!');
    }
}
