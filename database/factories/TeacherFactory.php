<?php

namespace Database\Factories;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TeacherFactory extends Factory
{
    protected $model = Teacher::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->name,
            'sprite' => $this->faker->numberBetween(0, 2),
            'bio' => $this->faker->paragraph, // Generate a random paragraph for bio
        ];
    }
}

