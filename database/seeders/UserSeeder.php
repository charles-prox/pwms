<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use App\Models\User; // Adjust the namespace if needed

class UserSeeder extends Seeder
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

        // Retrieve all office IDs
        $officeIds = DB::table('offices')->pluck('id');

        // Define the number of users you want to seed
        $numberOfUsers = 150;

        // Loop to create and insert dummy users
        for ($i = 0; $i < $numberOfUsers; $i++) {
            // Generate a random office ID from the retrieved IDs
            $officeId = $faker->randomElement($officeIds);
            // Generate a random 8-digit hris_id containing only numbers
            $hrisId = $faker->numberBetween(10000000, 99999999);

            $user = User::create([
                'hris_id' => $hrisId,
                'user_id' => $faker->unique()->uuid,
                'first_name' => $faker->firstName,
                'middle_name' => $faker->optional()->firstName,
                'last_name' => $faker->lastName,
                'email' => $faker->unique()->safeEmail,
                'position' => $faker->jobTitle,
                'contact_no' => $faker->phoneNumber,
                'employment_status' => $faker->randomElement(['regular', 'casual', 'contractual']),
                'office_id' => $officeId, // Use the randomly selected office ID
                'email_verified_at' => now(),
                'password' => Hash::make('password'), // Default password for all users
                'remember_token' => Str::random(10),
            ]);
            // Assign roles
            $user->syncRoles("user");
        }
    }
}
