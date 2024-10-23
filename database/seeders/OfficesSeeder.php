<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Office;

class OfficesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Office::insert(
            [
                // id=1
                [
                    'name' => 'Management Services Division',
                    'acronym' => 'MSD',
                    'address' => '6th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'division',
                    'pro_code' => 15,
                    'parent_id' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=2
                [
                    'name' => 'Health Care Delivery Management Division',
                    'acronym' => 'HCDMD',
                    'address' => '5th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'division',
                    'pro_code' => 15,
                    'parent_id' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=3
                [
                    'name' => 'Field Operations Division',
                    'acronym' => 'FOD',
                    'address' => '4th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'division',
                    'pro_code' => 15,
                    'parent_id' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=4
                [
                    'name' => 'Office of the Regional Vice President',
                    'acronym' => 'ORVP',
                    'address' => '8th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'division',
                    'pro_code' => 15,
                    'parent_id' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=5
                [
                    'name' => 'Office of the MSD Chief',
                    'acronym' => 'OMSD',
                    'address' => '6th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'division office',
                    'pro_code' => 15,
                    'parent_id' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=6
                [
                    'name' => 'Administrative Services Section',
                    'acronym' => 'ASS',
                    'address' => '6th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'section',
                    'pro_code' => 15,
                    'parent_id' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=7
                [
                    'name' => 'Funds Management Section',
                    'acronym' => 'FMS',
                    'address' => '6th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'section',
                    'pro_code' => 15,
                    'parent_id' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=8
                [
                    'name' => 'Office of the HCDMD Chief',
                    'acronym' => 'OHCDMD',
                    'address' => '5th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'division office',
                    'pro_code' => 15,
                    'parent_id' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=9
                [
                    'name' => 'Benefit Administration Section',
                    'acronym' => 'BAS',
                    'address' => '5th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'section',
                    'pro_code' => 15,
                    'parent_id' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=10
                [
                    'name' => 'Accreditation and Quality Assurance Section',
                    'acronym' => 'AQAS',
                    'address' => '5th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'section',
                    'pro_code' => 15,
                    'parent_id' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=11
                [
                    'name' => 'PhilHealth Customer Assistance, Relations and Empowerment Staff',
                    'acronym' => 'PCARES',
                    'address' => '5th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'section',
                    'pro_code' => 15,
                    'parent_id' => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=12
                [
                    'name' => 'Office of the FOD Division Chief',
                    'acronym' => 'OFOD',
                    'address' => '4th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'division office',
                    'pro_code' => 15,
                    'parent_id' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=13
                [
                    'name' => 'Membership and Marketing Section',
                    'acronym' => 'MMS',
                    'address' => '4th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'section',
                    'pro_code' => 15,
                    'parent_id' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=14
                [
                    'name' => 'Collection and Premium Accounts Management Section',
                    'acronym' => 'CPAMS',
                    'address' => '4th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'section',
                    'pro_code' => 15,
                    'parent_id' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=15
                [
                    'name' => 'Local Health Insurance Office - Bukidnon',
                    'acronym' => 'LHIO-BUKIDNON',
                    'address' => 'GF Candelaria Bldg., Sayre Hi-way, Hagkol Valeciana City Bukidnon',
                    'type' => 'office',
                    'pro_code' => 15,
                    'parent_id' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=16
                [
                    'name' => 'Local Health Insurance Office - Iligan',
                    'acronym' => 'LHIO-ILIGAN',
                    'address' => 'GF Gonzales - Gimeno Bldg. 4 Macapagal Avenue Tubod Iligan City',
                    'type' => 'office',
                    'pro_code' => 15,
                    'parent_id' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=17
                [
                    'name' => 'Local Health Insurance Office - Ozamiz',
                    'acronym' => 'LHIO-OZAMIZ',
                    'address' => 'J-ME Building, Rizal Ave. cor Capistrano St. Ozamis City',
                    'type' => 'office',
                    'pro_code' => 15,
                    'parent_id' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=18
                [
                    'name' => 'Local Health Insurance Office - Cagayan de Oro',
                    'acronym' => 'LHIO-CDO',
                    'address' => 'South Concourse, Limketkai , Claro M. Recto Ave, Cagayan de Oro',
                    'type' => 'office',
                    'pro_code' => 15,
                    'parent_id' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=19
                [
                    'name' => 'Local Health Insurance Office - Gingoog',
                    'acronym' => 'LHIO-GINGOOG',
                    'address' => 'RRM Barro Bldg., Jadol-Tuto sts., Gingoog City',
                    'type' => 'office',
                    'pro_code' => 15,
                    'parent_id' => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=20
                [
                    'name' => 'Legal Office',
                    'acronym' => 'LEGAL',
                    'address' => '7th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'section',
                    'pro_code' => 15,
                    'parent_id' => 4,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=21
                [
                    'name' => 'Information Technology Management Section',
                    'acronym' => 'ITMS',
                    'address' => '8th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'section',
                    'pro_code' => 15,
                    'parent_id' => 4,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=22
                [
                    'name' => 'General Services Unit',
                    'acronym' => 'GSU',
                    'address' => '6th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'unit',
                    'pro_code' => 15,
                    'parent_id' => 6,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=23
                [
                    'name' => 'Human Resouce Unit',
                    'acronym' => 'HRU',
                    'address' => '6th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'unit',
                    'pro_code' => 15,
                    'parent_id' => 6,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=24
                [
                    'name' => 'Comptrollership Unit',
                    'acronym' => 'CU',
                    'address' => '6th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'unit',
                    'pro_code' => 15,
                    'parent_id' => 7,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=25
                [
                    'name' => 'Cash Management Unit',
                    'acronym' => 'CMU',
                    'address' => '6th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'unit',
                    'pro_code' => 15,
                    'parent_id' => 7,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=26
                [
                    'name' => 'PhilHealth Business Center - Maramag',
                    'acronym' => 'PBC-MARAMAG',
                    'address' => '3/F, Centro Supersales Bldg., Agrosite, South Poblacion, Maramag, Bukidnon',
                    'type' => 'business center',
                    'pro_code' => 15,
                    'parent_id' => 15,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=27
                [
                    'name' => 'PhilHealth Business Center - Malaybalay',
                    'acronym' => 'PBC-MALAYBALAY',
                    'address' => 'Old Provincial Hospital, Capitol Compound, Malaybalay, Bukidnon',
                    'type' => 'business center',
                    'pro_code' => 15,
                    'parent_id' => 15,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=28
                [
                    'name' => 'PhilHealth Business Center - Tubod',
                    'acronym' => 'PBC-TUBOD',
                    'address' => 'LNPH Cmpd, Upper Sagadan, Baroy, Lanao del Norte',
                    'type' => 'business center',
                    'pro_code' => 15,
                    'parent_id' => 16,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=29
                [
                    'name' => 'PhilHealth Business Center - Maranding',
                    'acronym' => 'PBC-MARANDING',
                    'address' => 'LNPH Cmpd, Upper Sagadan, Baroy, Lanao del Norte',
                    'type' => 'business center',
                    'pro_code' => 15,
                    'parent_id' => 16,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=30
                [
                    'name' => 'PhilHealth Business Center - Oroquieta',
                    'acronym' => 'PBC-OROQUIETA',
                    'address' => 'Sobong Building, Barrientos Street, Layawan, Oroquieta City',
                    'type' => 'business center',
                    'pro_code' => 15,
                    'parent_id' => 17,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=31
                [
                    'name' => 'PhilHealth Business Center - Tangub',
                    'acronym' => 'PBC-TANGUB',
                    'address' => 'Doña Maria D. Tan Memorial Hospital, Pertig Street, Mantic, Tangub City',
                    'type' => 'business center',
                    'pro_code' => 15,
                    'parent_id' => 17,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=32
                [
                    'name' => 'PhilHealth Business Center - Carmen',
                    'acronym' => 'PBC-CARMEN',
                    'address' => 'No. 105 G/F, Stary Building, Max Suneil Street, Barangay Carmen, Cagayan de Oro City',
                    'type' => 'business center',
                    'pro_code' => 15,
                    'parent_id' => 18,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=33
                [
                    'name' => 'PhilHealth Business Center - Camiguin',
                    'acronym' => 'PBC-CAMIGUIN',
                    'address' => 'Dychauco Arcade, Gen. B. Aranas Street, Barangay Poblacion, Mambajao, Camiguin',
                    'type' => 'business center',
                    'pro_code' => 15,
                    'parent_id' => 19,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=34
                [
                    'name' => 'Public Affairs Unit',
                    'acronym' => 'PAU',
                    'address' => '8th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'unit',
                    'pro_code' => 15,
                    'parent_id' => 4,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                // id=35
                [
                    'name' => 'Planning and Research Unit',
                    'acronym' => 'PRU',
                    'address' => '8th floor, Gateway Tower II, Limketkai, Cagayan de Oro City',
                    'type' => 'unit',
                    'pro_code' => 15,
                    'parent_id' => 4,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]
        );
    }
}
