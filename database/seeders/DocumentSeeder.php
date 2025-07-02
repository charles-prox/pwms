<?php

namespace Database\Seeders;

use App\Models\Box;
use App\Models\Document;
use App\Models\RDS;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        $boxes = Box::all();
        $rdsItems = RDS::all();
        $users = User::all();

        if ($boxes->isEmpty() || $rdsItems->isEmpty() || $users->isEmpty()) {
            $this->command->warn('Please seed boxes, RDS items, and users first.');
            return;
        }

        foreach ($boxes as $box) {
            $documentsCount = rand(2, 5); // number of documents per box

            foreach (range(1, $documentsCount) as $i) {
                $addedBy = $users->random();
                $fromDate = fake()->dateTimeBetween('-5 years', '-1 year');
                $toDate = fake()->dateTimeBetween($fromDate, 'now');
                $isPermanent = fake()->boolean(20); // 20% chance permanent
                $disposalDate = $isPermanent ? null : fake()->dateTimeBetween('+1 year', '+3 years')->format('Y-m-d');

                Document::create([
                    'document_code'       => 'DOC-' . strtoupper(Str::random(6)),
                    'description'         => fake()->optional()->sentence(6),
                    'box_id'              => $box->id,
                    'rds_id'              => $rdsItems->random()->id,
                    'document_date_from'  => $fromDate->format('Y-m-d'),
                    'document_date_to'    => $toDate->format('Y-m-d'),
                    'disposal_date'       => $disposalDate,
                    'status'              => ['active', 'archived', 'pending'][rand(0, 2)],
                    'added_by'            => $addedBy->hris_id,
                    'is_permanent'        => $isPermanent,
                ]);
            }
        }
    }
}
