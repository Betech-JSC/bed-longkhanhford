<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleCategory;
use App\Models\Vehicle\VehicleVersion;
use App\Models\Service;
use App\Services\GeminiService;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;

class GeminiChatTest extends TestCase
{
    use DatabaseTransactions;

    public function test_system_prompt_includes_database_vehicles_and_services()
    {
        // 1. Create a category
        $category = VehicleCategory::create([
            'status' => 'ACTIVE',
            'sort_order' => 1
        ]);
        $category->fill([
            'vi' => ['title' => 'Test Category', 'slug' => 'test-category'],
        ])->save();

        // 2. Create a vehicle with custom Vietnamese title
        $vehicle = Vehicle::create([
            'category_id' => $category->id,
            'type' => 'suv',
            'base_price' => 500000000,
            'status' => 'ACTIVE',
            'sort_order' => 99,
        ]);
        $vehicle->fill([
            'vi' => [
                'title' => 'Ford Test Raptor 2026',
                'slug' => 'ford-test-raptor-2026',
                'tagline' => 'Dong xe kiem thu AI',
                'description' => 'Mo ta doc nhat vo nhi de check AI prompt'
            ]
        ])->save();

        // 3. Create a version for the vehicle
        $version = new VehicleVersion([
            'vehicle_id' => $vehicle->id,
            'price' => 650000000,
            'specs' => [
                'engine' => 'Dong co Xang Sieu Cap',
                'power' => '999 Hp',
            ],
            'status' => 'ACTIVE',
            'sort_order' => 1
        ]);
        $version->fill([
            'vi' => ['name' => 'Raptor VVIP Pro Max']
        ])->save();

        // 4. Create an active service
        $service = Service::create([
            'status' => 'ACTIVE',
            'position' => 99,
        ]);
        $service->fill([
            'vi' => [
                'title' => 'Dich vu rua xe bang nuoc dua',
                'description' => 'Rua xe sieu sach thom ngon tu thien nhien'
            ]
        ])->save();

        // 5. Invoke getSystemPrompt on GeminiService
        $serviceInstance = new GeminiService();
        $reflector = new \ReflectionClass(GeminiService::class);
        $method = $reflector->getMethod('getSystemPrompt');
        $method->setAccessible(true);
        $prompt = $method->invoke($serviceInstance);

        // 6. Assertions
        $this->assertStringContainsString('Ford Test Raptor 2026', $prompt);
        $this->assertStringContainsString('Dong xe kiem thu AI', $prompt);
        $this->assertStringContainsString('Mo ta doc nhat vo nhi de check AI prompt', $prompt);
        $this->assertStringContainsString('Raptor VVIP Pro Max', $prompt);
        $this->assertStringContainsString('650.000.000đ', $prompt);
        $this->assertStringContainsString('Động cơ: Dong co Xang Sieu Cap', $prompt);
        $this->assertStringContainsString('Công suất: 999 Hp', $prompt);
        $this->assertStringContainsString('Dich vu rua xe bang nuoc dua', $prompt);
        $this->assertStringContainsString('Rua xe sieu sach thom ngon tu thien nhien', $prompt);
    }

    public function test_ai_chat_api_sends_dynamic_prompt_to_gemini()
    {
        // 1. Setup API key in configuration
        config(['services.gemini.api_key' => 'test_api_key_123']);
        config(['services.gemini.model' => 'gemini-2.5-flash']);

        // 2. Create custom vehicle and service
        $category = VehicleCategory::create(['status' => 'ACTIVE']);
        $category->fill(['vi' => ['title' => 'Test Cat', 'slug' => 'test-cat']])->save();

        $vehicle = Vehicle::create([
            'category_id' => $category->id,
            'type' => 'pickup',
            'base_price' => 400000000,
            'status' => 'ACTIVE'
        ]);
        $vehicle->fill([
            'vi' => [
                'title' => 'Ranger AI Special',
                'slug' => 'ranger-ai-special',
                'tagline' => 'AI Tagline',
                'description' => 'AI Description'
            ]
        ])->save();

        $service = Service::create(['status' => 'ACTIVE']);
        $service->fill([
            'vi' => [
                'title' => 'Bao tri dong co AI',
                'description' => 'Bao tri sieu phan luu'
            ]
        ])->save();

        // 3. Fake HTTP requests to Gemini
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'Chào bạn! Tôi có thể giúp gì cho bạn?']
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        // 4. Send request to Chat API
        $response = $this->postJson('/api/ai/chat', [
            'message' => 'Xin chào, Ranger AI Special giá bao nhiêu?',
        ]);

        // 5. Assert API response structure
        $response->assertStatus(200);
        $response->assertJsonPath('data.reply', 'Chào bạn! Tôi có thể giúp gì cho bạn?');

        // 6. Assert HTTP call payload contains database records
        Http::assertSent(function ($request) {
            $body = $request->data();
            $systemInstruction = $body['system_instruction']['parts'][0]['text'] ?? '';
            
            return str_contains($systemInstruction, 'Ranger AI Special') &&
                   str_contains($systemInstruction, 'Bao tri dong co AI') &&
                   str_contains($systemInstruction, 'Bao tri sieu phan luu') &&
                   str_contains($systemInstruction, 'AI Description');
        });
    }
}
