<?php

namespace Database\Seeders;

use App\Models\Division;
use App\Models\Employee;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Rudianto Sihombing',
            'email' => 'rudi97278@gmail.com',
            'password' => 'password'
        ]);

        Division::insert([
            [
                'name' => 'SIL',
            ],
            [
                'name' => 'NIL',
            ],
            [
                'name' => 'GSA',
            ],
            [
                'name' => 'GSO',
            ]
        ]);

        Employee::create([
            'name' => 'Rudi',
            'division_id' => 1,
            'type' => Employee::VENDOR,
            'is_active' => true,
            'breakfast' => Employee::MEAL,
            'lunch' => Employee::MEAL,
            'dinner' => Employee::MEAL,
            'is_claim_save' => false
        ]);
    }
}
