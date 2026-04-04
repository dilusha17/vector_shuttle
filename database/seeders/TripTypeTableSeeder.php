<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TripTypeTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['name' => 'Arrival'],
            ['name' => 'Departure'],
            ['name' => 'One-Way'],
            ['name' => 'Two-Way'],
        ];

        foreach ($types as $type) {
            DB::table('trip_type')->insertOrIgnore($type);
        }
    }
}
