<?php

namespace Database\Factories\JamstackVietnam\Blog\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use JamstackVietnam\Blog\Models\PostCategory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class PostCategoryFactory extends Factory
{
    protected $model = PostCategory::class;

    public function definition(): array
    {
        $title = $this->faker->text(rand(10, 30));
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'status' =>  array_rand(PostCategory::STATUS_LIST),
            'view_count' => rand(1, 100),
            'locale' => 'vi'
        ];
    }
}
