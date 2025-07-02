<?php

namespace Database\Seeders;

use App\Models\Box;
use App\Models\Request;
use App\Models\Office;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BoxSeeder extends Seeder
{
    public function run(): void
    {
        $requests = Request::all();
        $offices = Office::all();

        if ($requests->isEmpty() || $offices->isEmpty()) {
            $this->command->warn('No requests or offices found. Please seed them first.');
            return;
        }

        foreach (range(1, 20) as $i) {
            $office = $offices->random();
            $request = $requests->random();

            $isPermanent = fake()->boolean(30); // 30% chance it's permanent
            $disposalDate = $isPermanent ? null : fake()->dateTimeBetween('+1 month', '+10 years')->format('Y-m-d');

            Box::create([
                'box_code'       => 'BX-' . strtoupper(Str::random(5)) . '-' . $i,
                'request_id'     => $request->id,
                'remarks'        => fake()->optional()->sentence(),
                'status'         => ['stored', 'withdrawn', 'returned', 'disposed'][rand(0, 3)],
                'office_id'      => $office->id,
                'priority_level' => ['Low', 'Medium', 'High'][rand(0, 2)],
                'disposal_date'  => $disposalDate,
                'is_permanent'   => $isPermanent,
            ]);
        }
    }
}
