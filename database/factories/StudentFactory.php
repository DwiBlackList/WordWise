<?php

namespace Database\Factories;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->name,
            'sprite' => $this->faker->numberBetween(0, 2),
            'teacher_id' => $this->faker->numberBetween(1, 5), // Associate with a random Teacher
            'level' => $this->faker->numberBetween(1, 10), // Random level between 1 and 10
            'total_points' => $this->faker->numberBetween(0, 1000), // Random points between 0 and 1000
        ];
    }
}
