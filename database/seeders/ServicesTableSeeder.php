<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServicesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            ['key' => 'shared',     'name' => 'Shared Airport Transfer'],
            ['key' => 'private',    'name' => 'Private Airport Transfer'],
            ['key' => 'cityToCity', 'name' => 'City to City Transfer'],
            ['key' => 'event',      'name' => 'Event Transport'],
        ];

        foreach ($services as $service) {
            DB::table('services')->insertOrIgnore($service);
        }
    }
}
