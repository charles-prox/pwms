<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Officer;
use App\Models\Position;
use App\Models\Office;

class OfficerSeeder extends Seeder
{
    public function run()
    {
        // Define officers with their details
        $officers = [
            [
                'first_name' => 'Maria Rhodella',
                'middle_initial' => 'S',
                'last_name' => 'Monsanto',
                'extension' => null,
                'office_code' => 'OFOD',
            ],
            [
                'first_name' => 'Anna Alia',
                'middle_initial' => 'B',
                'last_name' => 'Lucman',
                'extension' => null,
                'office_code' => 'ASS',
            ],
            [
                'first_name' => 'Gladys',
                'middle_initial' => 'A',
                'last_name' => 'Eltanal',
                'extension' => null,
                'office_code' => 'GSU',
            ],
            [
                'first_name' => 'Anna Junaynah',
                'middle_initial' => 'A',
                'last_name' => 'Macalbe',
                'extension' => null,
                'office_code' => 'HRU',
            ],
            [
                'first_name' => 'Mary Kay',
                'middle_initial' => 'J',
                'last_name' => 'Uy',
                'extension' => null,
                'office_code' => 'OMSD',
            ],
            [
                'first_name' => 'Maria Teresa',
                'middle_initial' => 'B',
                'last_name' => 'Amahoy',
                'extension' => null,
                'office_code' => 'FMS',
            ],
            [
                'first_name' => 'Dexter',
                'middle_initial' => 'S',
                'last_name' => 'Latosa',
                'extension' => null,
                'office_code' => 'CMU',
            ],
            [
                'first_name' => 'Jonathan',
                'middle_initial' => 'T',
                'last_name' => 'Ortigoza',
                'extension' => 'Dr',
                'office_code' => 'OHCDMD',
            ],
            [
                'first_name' => 'Eznairah',
                'middle_initial' => 'A',
                'last_name' => 'Lao',
                'extension' => 'Dr',
                'office_code' => 'BAS',
            ],
            [
                'first_name' => 'Mae Desiree',
                'middle_initial' => 'L',
                'last_name' => 'Yap',
                'extension' => 'Dr',
                'office_code' => 'AQAS',
            ],
            [
                'first_name' => 'Khalid',
                'middle_initial' => 'M',
                'last_name' => 'Asum',
                'extension' => null,
                'office_code' => 'CPAMS',
            ],
            [
                'first_name' => 'Romulo Jr',
                'middle_initial' => 'M',
                'last_name' => 'Lapuz',
                'extension' => null,
                'office_code' => 'LHIO-BUKIDNON',
            ],
            [
                'first_name' => 'Patrick',
                'middle_initial' => null,
                'last_name' => 'Penaranda',
                'extension' => null,
                'office_code' => 'LHIO-ILIGAN',
            ],
            [
                'first_name' => 'Gerion',
                'middle_initial' => 'K',
                'last_name' => 'Cabang',
                'extension' => null,
                'office_code' => 'LHIO-OZAMIZ',
            ],
            [
                'first_name' => 'Marlon Niño',
                'middle_initial' => 'S',
                'last_name' => 'Arrabaca',
                'extension' => null,
                'office_code' => 'LHIO-CDO',
            ],
            [
                'first_name' => 'Antonio Jr',
                'middle_initial' => 'A',
                'last_name' => 'Arnaiz',
                'extension' => null,
                'office_code' => 'LHIO-GINGOOG',
            ],
            [
                'first_name' => 'Delio II',
                'middle_initial' => 'A',
                'last_name' => 'Aseron',
                'extension' => null,
                'office_code' => 'ORVP',
            ],
            [
                'first_name' => 'Ian Alfredo',
                'middle_initial' => 'T',
                'last_name' => 'Magno',
                'extension' => 'Atty',
                'office_code' => 'LEGAL',
            ],
            [
                'first_name' => 'Reynaldo Dennis',
                'middle_initial' => 'P',
                'last_name' => 'Rimando',
                'extension' => null,
                'office_code' => 'ITMS',
            ],
            [
                'first_name' => 'Merlyn',
                'middle_initial' => 'H',
                'last_name' => 'Ybañez',
                'extension' => null,
                'office_code' => 'PAU',
            ],
            [
                'first_name' => 'Anshari',
                'middle_initial' => 'M',
                'last_name' => 'Mangondato',
                'extension' => null,
                'office_code' => 'PRU',
            ],
            [
                'first_name' => 'Cherry',
                'middle_initial' => 'M',
                'last_name' => 'Serina',
                'extension' => null,
                'office_code' => 'GSU',
                'position_name' => 'Regional Document Custodian',
                'position_code' => 'rdc',
            ],
        ];

        foreach ($officers as $data) {
            // Retrieve the office by code
            $office = Office::where('acronym', $data['office_code'])->first();

            if (!$office) {
                $this->command->error("Office with code {$data['office_code']} not found.");
                continue;
            }

            // Determine position name and code
            if (isset($data['position_name']) && isset($data['position_code'])) {
                $positionName = $data['position_name'];
                $positionCode = $data['position_code'];
            } else {
                $positionPrefix = match (true) {
                    $office->type === 'division' && $office->acronym === 'ORVP' => 'RVP',
                    $office->type === 'division office' => 'Chief',
                    default => 'Head',
                };
                $positionName = "{$positionPrefix}, {$office->name}";
                $positionCode = strtolower(
                    preg_replace(
                        '/\s+/',
                        '_',                       // replace multiple spaces with one _
                        str_replace(
                            ' ',
                            ' ',                        // keep actual spaces
                            preg_replace(
                                '/[^a-zA-Z0-9 ]+/',
                                '',     // remove all non-alphanumeric except space
                                $positionName
                            )
                        )
                    )
                );
            }

            // Create or retrieve the position
            $position = Position::firstOrCreate(
                ['code' => $positionCode],
                ['name' => $positionName]
            );

            // Create the officer
            $officer = Officer::create([
                'first_name' => $data['first_name'],
                'middle_initial' => $data['middle_initial'],
                'last_name' => $data['last_name'],
                'extension' => $data['extension'],
                'office_id' => $office->id,
            ]);

            // Attach the officer to the position
            $officer->positions()->attach($position->id);
        }
    }
}
