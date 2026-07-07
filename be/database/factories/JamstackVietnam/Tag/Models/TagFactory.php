<?php

namespace Database\Factories\JamstackVietnam\Tag\Models;

use Illuminate\Database\Eloquent\Factories\Factory;
use JamstackVietnam\Tag\Models\Tag;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class TagFactory extends Factory
{
    protected $model = Tag::class;

    public function definition(): array
    {
        $title = $this->faker->text(rand(10, 30));
        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'status' =>  array_rand(Tag::STATUS_LIST),
            'type' => Tag::TYPE_BLOG,
            'locale' => 'vi'
        ];
    }
}
