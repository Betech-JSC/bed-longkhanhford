<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\History;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class HistoryFactory extends Factory
{
    protected $model = History::class;

    public function definition(): array
    {
        $title = $this->faker->text(rand(10, 30));
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'status' =>  History::STATUS_ACTIVE,
            'description' => $this->faker->text,
            'content' => $this->faker->randomHtml(3, 10),
            'year' => rand(1990, 2023),
            'locale' => 'vi'
        ];
    }
}
