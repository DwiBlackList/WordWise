<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Teacher::factory()->count(5)->create();
        // Student::factory()->count(100)->create();

        // Create admin users
        User::factory()->create([
            'name' => 'Lunar Interactive',
            'email' => 'lunarinteractive@gmail.com',
            'password' => Hash::make('lunarinteractivestartup'),
            'role' => 'admins',
        ]);
        
    }

}
