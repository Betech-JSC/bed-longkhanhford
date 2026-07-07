<?php

namespace Database\Factories\JamstackVietnam\Job\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use JamstackVietnam\Job\Models\Job;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class JobFactory extends Factory
{
    protected $model = Job::class;

    public function definition(): array
    {
        $title = $this->faker->text(rand(10, 30));
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'status' =>  array_rand(Job::STATUS_LIST),
            'content' => $this->faker->randomHtml(3, 10),
            'published_at' => now(),
            'expected_time' => now(),
            'working_position' => $this->faker->text(rand(10, 30)),
            'work_address' => $this->faker->text(rand(10, 30)),
            'working_time' => $this->faker->text(rand(10, 30)),
            'locale' => 'vi'
        ];
    }
}
