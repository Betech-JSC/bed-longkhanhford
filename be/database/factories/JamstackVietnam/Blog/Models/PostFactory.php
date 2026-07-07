<?php

namespace Database\Factories\JamstackVietnam\Blog\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use JamstackVietnam\Blog\Models\Post;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        $title = $this->faker->text(rand(10, 30));
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'status' =>  array_rand(Post::STATUS_LIST),
            'description' => $this->faker->text,
            'content' => $this->faker->randomHtml(3, 10),
            'is_featured' => rand(0, 1),
            'published_at' => now(),
            'view_count' => rand(1, 100),
            'locale' => 'vi'
        ];
    }
}
