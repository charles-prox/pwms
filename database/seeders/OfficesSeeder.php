<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class OfficesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create an instance of Faker
        $faker = Faker::create();

        // Define the number of offices you want to seed
        $numberOfOffices = 10;

        // Seed offices
        for ($i = 0; $i < $numberOfOffices; $i++) {
            // Generate office data
            $officeData = [
                'name' => $faker->company,
                'address' => $faker->optional()->address,
                'acronym' => $faker->optional()->lexify('???'),
                'type' => $faker->randomElement(['department', 'section', 'unit']),
                'parent_id' => null, // Set parent_id to null initially
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Insert the office data
            $officeId = DB::table('offices')->insertGetId($officeData);

            // Optionally, set parent_id for child offices
            if ($i > 0) {
                $parentOfficeId = rand(1, $i); // Randomly select a parent office ID
                DB::table('offices')->where('id', $officeId)->update(['parent_id' => $parentOfficeId]);
            }
        }
    }
}
