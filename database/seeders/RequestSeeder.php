<?php

namespace Database\Seeders;

use App\Models\Request;
use App\Models\Office;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequestSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::whereNotNull('office_id')->get();

        if ($users->isEmpty()) {
            $this->command->warn('No users with office_id found. Please seed users with valid office_id first.');
            return;
        }

        $types = ['Storage', 'Withdrawal', 'Return', 'Disposal'];
        $formYear = now()->year;

        foreach ($types as $type) {
            // Get the current max sequence for this type + year
            $maxSequence = DB::table('requests')
                ->where('request_type', $type)
                ->where('form_year', $formYear)
                ->max('form_sequence') ?? 0;

            foreach (range(1, 3) as $i) { // create 3 per type
                $sequence = $maxSequence + $i;
                $formNumber = "{$type[0]}-{$formYear}-" . str_pad($sequence, 3, '0', STR_PAD_LEFT);

                $creator = $users->random();
                $updater = $users->random();

                Request::create([
                    'form_number'   => $formNumber,
                    'request_type'  => $type,
                    'status'        => 'submitted',
                    'is_draft'      => false,
                    'office_id'     => $creator->office_id, // ensure it's tied to the user
                    'created_by'    => $creator->id,
                    'updated_by'    => $updater->id,
                    'submitted_at'  => now()->subDays(rand(1, 30)),
                    'form_year'     => $formYear,
                    'form_sequence' => $sequence,
                    'pdf_path'      => "storage/requests/sample_{$formNumber}.pdf",
                ]);
            }
        }
    }
}
