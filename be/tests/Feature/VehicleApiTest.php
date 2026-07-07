<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class VehicleApiTest extends TestCase
{
    use DatabaseTransactions;

    public function test_can_get_vehicle_with_layout_blocks()
    {
        $category = VehicleCategory::create([
            'status' => 'ACTIVE',
            'sort_order' => 1
        ]);
        $category->fill([
            'vi' => ['title' => 'SUV', 'slug' => 'suv'],
        ])->save();

        $vehicle = Vehicle::create([
            'category_id' => $category->id,
            'type' => 'suv',
            'base_price' => 700000000,
            'status' => 'ACTIVE',
            'layout_blocks' => [
                [
                    'type' => 'HeroBanner',
                    'data' => [
                        'title' => 'Ford Territory Test',
                        'background_image' => 'uploads/test.png'
                    ]
                ]
            ]
        ]);
        $vehicle->fill([
            'vi' => [
                'title' => 'Ford Territory Test',
                'slug' => 'ford-territory-test',
            ]
        ])->save();

        $response = $this->getJson('/api/vehicles/ford-territory-test');

        $response->assertStatus(200);
        $response->assertJsonPath('data.layout_blocks.0.type', 'HeroBanner');
        $response->assertJsonPath('data.layout_blocks.0.data.background_image', static_url('test.png'));
    }

    public function test_can_update_vehicle_layout_blocks()
    {
        $category = VehicleCategory::create([
            'status' => 'ACTIVE',
            'sort_order' => 1
        ]);
        $category->fill([
            'vi' => ['title' => 'SUV', 'slug' => 'suv'],
        ])->save();

        $vehicle = Vehicle::create([
            'category_id' => $category->id,
            'type' => 'suv',
            'base_price' => 700000000,
            'status' => 'ACTIVE',
            'layout_blocks' => []
        ]);
        $vehicle->fill([
            'vi' => [
                'title' => 'Ford Territory Test',
                'slug' => 'ford-territory-test',
            ]
        ])->save();

        $newLayout = [
            [
                'type' => 'AccordionFAQs',
                'data' => [
                    'faqs' => [
                        ['q' => 'Hoi?', 'a' => 'Dap.']
                    ]
                ]
            ]
        ];

        $response = $this->putJson("/api/vehicles/ford-territory-test/layout", [
            'layout_blocks' => $newLayout
        ]);

        $response->assertStatus(200);
        $this->assertEquals($newLayout, $vehicle->refresh()->layout_blocks);
    }

    public function test_can_upload_image()
    {
        $file = UploadedFile::fake()->image('avatar.jpg');

        $response = $this->postJson('/api/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'path',
            'url'
        ]);

        $path = $response->json('path');
        if (file_exists(public_path($path))) {
            unlink(public_path($path));
        }
    }

    public function test_vehicle_360_images_are_sorted_naturally()
    {
        $controller = new \App\Http\Controllers\Backend\VehicleController();
        $reflector = new \ReflectionClass(\App\Http\Controllers\Backend\VehicleController::class);
        $method = $reflector->getMethod('sort360Images');
        $method->setAccessible(true);

        // Test with array format containing paths
        $inputArray = [
            ['path' => '02.jpg'],
            ['path' => '10.jpg'],
            ['path' => '01.jpg'],
            ['path' => '2.jpg'],
        ];
        $expectedArray = [
            ['path' => '01.jpg'],
            ['path' => '02.jpg'],
            ['path' => '2.jpg'],
            ['path' => '10.jpg'],
        ];

        $sortedArray = $method->invokeArgs($controller, [$inputArray]);
        $this->assertEquals($expectedArray, array_values($sortedArray));

        // Test with simple string paths
        $inputStrings = [
            '/uploads/02.jpg',
            '/uploads/10.jpg',
            '/uploads/01.jpg',
            '/uploads/2.jpg',
        ];
        $expectedStrings = [
            '/uploads/01.jpg',
            '/uploads/02.jpg',
            '/uploads/2.jpg',
            '/uploads/10.jpg',
        ];

        $sortedStrings = $method->invokeArgs($controller, [$inputStrings]);
        $this->assertEquals($expectedStrings, array_values($sortedStrings));
    }

    public function test_file_manager_tree_preserves_numeric_keys()
    {
        // Set up dummy directory structure on local disk
        $disk = \Illuminate\Support\Facades\Storage::fake('uploads');
        
        $disk->makeDirectory('vehicles/mustang/360/exterior');
        $disk->makeDirectory('vehicles/mustang/360/interior');

        $file = new \App\Models\File('/', 'uploads');
        $tree = $file->tree();

        $this->assertCount(1, $tree);
        $this->assertEquals('File Manager', $tree[0]['name']);
        
        // Traverse down the tree to check "360"
        $children = $tree[0]['children'];
        $this->assertCount(1, $children);
        $this->assertEquals('vehicles', $children[0]['name']);

        $vehiclesChildren = $children[0]['children'];
        $this->assertCount(1, $vehiclesChildren);
        $this->assertEquals('mustang', $vehiclesChildren[0]['name']);

        $mustangChildren = $vehiclesChildren[0]['children'];
        // Ensure "360" is the ONLY folder under mustang and is not duplicated or re-keyed to 361/362...
        $this->assertCount(1, $mustangChildren);
        $this->assertEquals('360', $mustangChildren[0]['name']);
        
        $threeSixtyChildren = $mustangChildren[0]['children'];
        $this->assertCount(2, $threeSixtyChildren);
        
        $childNames = collect($threeSixtyChildren)->pluck('name')->toArray();
        sort($childNames);
        $this->assertEquals(['exterior', 'interior'], $childNames);
    }

    public function test_file_store_preserves_relative_directories()
    {
        $disk = \Illuminate\Support\Facades\Storage::fake('uploads');
        
        $file1 = UploadedFile::fake()->image('01.jpg');
        $file2 = UploadedFile::fake()->image('02.jpg');
        
        $files = [$file1, $file2];
        $relativePaths = [
            'exterior/molten-magenta/01.jpg',
            'interior/02.jpg',
        ];

        $fileModel = new \App\Models\File('/', 'uploads');
        $result = $fileModel->store($files, $relativePaths);

        $this->assertCount(2, $result['successFiles']);
        
        // Assert that directories were created and files placed correctly
        $disk->assertExists('exterior/molten-magenta/01.webp'); // Since it is converted to webp
        $disk->assertExists('interior/02.webp'); // Since it is converted to webp
    }
}

