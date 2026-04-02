<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::factory()->create([
            'name' => 'Pramil',
            'email' => 'admin@vectorshuttle.co.nz',
            'password' => Hash::make('pramil@321'),
            'role' => 'admin',
        ]);

        // Create Manager User
        User::factory()->create([
            'name' => 'Madushi',
            'email' => 'manager@vectorshuttle.co.nz',
            'password' => Hash::make('madushi@321'),
            'role' => 'manager',
        ]);
    }
}
