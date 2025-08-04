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
            ['code' => 'aa_vi', 'name' => 'Administrative Aide VI', 'abbreviation' => 'AA-VI'],
            ['code' => 'ao_i', 'name' => 'Administrative Officer I', 'abbreviation' => 'AO-I'],
            ['code' => 'ao_ii', 'name' => 'Administrative Officer II', 'abbreviation' => 'AO-II'],
            ['code' => 'ao_iii', 'name' => 'Administrative Officer III', 'abbreviation' => 'AO-III'],
            ['code' => 'ao_iv', 'name' => 'Administrative Officer IV', 'abbreviation' => 'AO-IV'],
            ['code' => 'aso_ii', 'name' => 'Administration Services Officer II', 'abbreviation' => 'ASO-II'],
            ['code' => 'asa_c', 'name' => 'Administration Services Assistant C', 'abbreviation' => 'ASA-C'],
            ['code' => 'atty_iv', 'name' => 'Attorney IV', 'abbreviation' => 'ATTY-IV'],
            ['code' => 'csio', 'name' => 'Chief Social Insurance Officer', 'abbreviation' => 'CSIO'],
            ['code' => 'clerk_iii', 'name' => 'Clerk III', 'abbreviation' => 'Clerk-III'],
            ['code' => 'cmt_i', 'name' => 'Computer Maintenance Technologist I', 'abbreviation' => 'CMT-I'],
            ['code' => 'courier', 'name' => 'Courier', 'abbreviation' => 'Courier'],
            ['code' => 'dc_iv', 'name' => 'Division Chief IV', 'abbreviation' => 'DC-IV'],
            ['code' => 'driver_ii', 'name' => 'Driver II', 'abbreviation' => 'DR-II'],
            ['code' => 'ea_ii', 'name' => 'Executive Assistant II', 'abbreviation' => 'EA-II'],
            ['code' => 'fpa_b', 'name' => 'Financial Planning Assistant B', 'abbreviation' => 'FPA-B'],
            ['code' => 'fc_i', 'name' => 'Fiscal Controller I', 'abbreviation' => 'FC-I'],
            ['code' => 'fc_ii', 'name' => 'Fiscal Controller II', 'abbreviation' => 'FC-II'],
            ['code' => 'fc_iii', 'name' => 'Fiscal Controller III', 'abbreviation' => 'FC-III'],
            ['code' => 'fc_iv', 'name' => 'Fiscal Controller IV', 'abbreviation' => 'FC-IV'],
            ['code' => 'fc_iii', 'name' => 'Fiscal Clerk III', 'abbreviation' => 'FC-III'],
            ['code' => 'fe_a', 'name' => 'Fiscal Examiner A', 'abbreviation' => 'FE-A'],
            ['code' => 'hrma', 'name' => 'Human Resource Management Assistant', 'abbreviation' => 'HRMA'],
            ['code' => 'hrmo_i', 'name' => 'Human Resource Management Officer I', 'abbreviation' => 'HRMO-I'],
            ['code' => 'hrmo_iii', 'name' => 'Human Resource Management Officer III', 'abbreviation' => 'HRMO-III'],
            ['code' => 'ito_ii', 'name' => 'Information Technology Officer II', 'abbreviation' => 'ITO-II'],
            ['code' => 'la_i', 'name' => 'Legal Assistant I', 'abbreviation' => 'LA-I'],
            ['code' => 'lr', 'name' => 'Legal Researcher', 'abbreviation' => 'LR'],
            ['code' => 'mo_vii', 'name' => 'Medical Officer VII', 'abbreviation' => 'MO-VII'],
            ['code' => 'ms_i', 'name' => 'Medical Specialist I', 'abbreviation' => 'MS-I'],
            ['code' => 'ms_iv', 'name' => 'Medical Specialist IV', 'abbreviation' => 'MS-IV'],
            ['code' => 'po_i', 'name' => 'Planning Officer I', 'abbreviation' => 'PO-I'],
            ['code' => 'po_ii', 'name' => 'Planning Officer II', 'abbreviation' => 'PO-II'],
            ['code' => 'po_iii', 'name' => 'Planning Officer III', 'abbreviation' => 'PO-III'],
            ['code' => 'pro_i', 'name' => 'Public Relations Officer I', 'abbreviation' => 'PRO-I'],
            ['code' => 'pro_iii', 'name' => 'Public Relations Officer III', 'abbreviation' => 'PRO-III'],
            ['code' => 'rvp', 'name' => 'Regional Vice President', 'abbreviation' => 'RVP'],
            ['code' => 'ssio', 'name' => 'Senior Social Insurance Officer', 'abbreviation' => 'SSIO'],
            ['code' => 'sia_i', 'name' => 'Social Insurance Assistant I', 'abbreviation' => 'SIA-I'],
            ['code' => 'sia_ii', 'name' => 'Social Insurance Assistant II', 'abbreviation' => 'SIA-II'],
            ['code' => 'sio_i', 'name' => 'Social Insurance Officer I', 'abbreviation' => 'SIO-I'],
            ['code' => 'sio_ii', 'name' => 'Social Insurance Officer II', 'abbreviation' => 'SIO-II'],
            ['code' => 'sio_iii', 'name' => 'Social Insurance Officer III', 'abbreviation' => 'SIO-III'],
            ['code' => 'si_ii', 'name' => 'Special Investigator II', 'abbreviation' => 'SI-II'],
            ['code' => 'si_iii', 'name' => 'Special Investigator III', 'abbreviation' => 'SI-III'],
            ['code' => 'si_iv', 'name' => 'Special Investigator IV', 'abbreviation' => 'SI-IV'],
        ]);
    }
}
