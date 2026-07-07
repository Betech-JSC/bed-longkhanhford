<?php

namespace Database\Factories\Product;

use App\Models\Product\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'status' => Product::STATUS_ACTIVE,
            'is_featured' => $this->faker->boolean(20),
            'is_new' => $this->faker->boolean(10),
            'is_stock' => true,
            'view_count' => $this->faker->numberBetween(0, 1000),
            'position' => $this->faker->numberBetween(0, 100),
            'sku' => $this->faker->unique()->ean8(),
            'price' => $this->faker->numberBetween(50, 5000) * 1000,
            'old_price' => $this->faker->numberBetween(5100, 10000) * 1000,
            'stock_quantity' => $this->faker->numberBetween(10, 100),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'updated_at' => now(),
            
            // Global JSON fields
            'images' => [
                ['path' => 'demo/products/1.jpg', 'alt' => 'Product Image 1'],
                ['path' => 'demo/products/2.jpg', 'alt' => 'Product Image 2'],
            ],
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Product $product) {
            $locales = ['vi', 'en'];
            
            foreach ($locales as $locale) {
                $title = $this->faker->sentence(4);
                
                $product->translations()->create([
                    'locale' => $locale,
                    'title' => $title . " ($locale)",
                    'title_en' => $title . " (EN)",
                    'slug' => Str::slug($title) . '-' . $locale . '-' . Str::random(5),
                    'description' => $this->faker->paragraph(),
                    'content' => $this->faker->text(),
                    'specification' => $this->faker->text(),
                    'title_overview' => 'Tổng quan sản phẩm',
                    'content_overview' => $this->faker->paragraph(),
                    'harvest_season' => 'Tháng 5 - Tháng 7',
                    'product_process' => $this->faker->paragraph(),
                    
                    // Translatable Image Fields
                    'image' => ['path' => 'demo/products/1.jpg', 'alt' => 'Main Image ' . $locale],
                    'banner' => [['image' => ['path' => 'demo/products/banner.jpg'], 'link' => '#']],
                    'image_harvest_season' => ['path' => 'demo/products/harvest.jpg', 'alt' => 'Harvest ' . $locale],
                    'images_characteristics' => [['path' => 'demo/products/char1.jpg'], ['path' => 'demo/products/char2.jpg']],
                    'images_product_process' => [
                        ['path' => 'demo/products/process1.jpg', 'alt' => 'Step 1'],
                        ['path' => 'demo/products/process2.jpg', 'alt' => 'Step 2'],
                        ['path' => 'demo/products/process3.jpg', 'alt' => 'Step 3']
                    ],
                    'images_package_specification' => [['path' => 'demo/products/package.jpg']],
                    'images_preservation_methods' => [['path' => 'demo/products/method.jpg']],

                    'seo_meta_title' => $title,
                    'seo_meta_description' => $this->faker->sentence(),
                ]);
            }
        });
    }
}
