<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Admin;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Http;

class GeminiPostGenerationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_admin_can_generate_post_using_ai()
    {
        // 1. Setup API key in configuration
        config(['services.gemini.api_key' => 'test_api_key_post']);
        config(['services.gemini.model' => 'gemini-2.0-flash']);

        // 2. Create Admin user and authenticate
        $admin = Admin::create([
            'name' => 'Test Editor',
            'email' => 'editor-test@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'status' => Admin::STATUS_ACTIVE,
            'google2fa_ts' => now()->timestamp,
        ]);

        // 3. Fake HTTP requests to Gemini returning a valid JSON string
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => "{\n  \"title\": \"Mẫu xe Ford Territory 2026 Mới Nhất\",\n  \"description\": \"Tìm hiểu chi tiết về giá xe và ưu đãi hấp dẫn cho dòng Ford Territory 2026 tại Đồng Nai.\",\n  \"content\": \"<h2>Giới thiệu chung</h2><p>Ford Territory 2026 là dòng xe SUV hoàn hảo cho gia đình...</p>\"\n}"]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        // 4. Send request to Post AI API
        $response = $this->actingAs($admin, 'admin')->postJson('/admin/posts/generate-ai', [
            'topic' => 'Giới thiệu Ford Territory 2026',
            'tone' => 'chuyên nghiệp',
            'language' => 'vi',
            'keywords' => 'ford territory, ford dong nai',
            'outline' => '1. Mở bài, 2. Thông số, 3. Kết bài'
        ]);

        // 5. Assertions
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'data' => [
                'title' => 'Mẫu xe Ford Territory 2026 Mới Nhất',
                'description' => 'Tìm hiểu chi tiết về giá xe và ưu đãi hấp dẫn cho dòng Ford Territory 2026 tại Đồng Nai.',
                'content' => '<h2>Giới thiệu chung</h2><p>Ford Territory 2026 là dòng xe SUV hoàn hảo cho gia đình...</p>'
            ]
        ]);

        // 6. Assert HTTP call payload properties
        Http::assertSent(function ($request) {
            $body = $request->data();
            $promptText = $body['contents'][0]['parts'][0]['text'] ?? '';
            
            return str_contains($promptText, 'Giới thiệu Ford Territory 2026') &&
                   str_contains($promptText, 'chuyên nghiệp') &&
                   str_contains($promptText, 'ford territory, ford dong nai') &&
                   str_contains($promptText, '1. Mở bài, 2. Thông số, 3. Kết bài');
        });
    }

    public function test_post_generation_fails_validation_without_topic()
    {
        $admin = Admin::create([
            'name' => 'Test Editor 2',
            'email' => 'editor-test2@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'status' => Admin::STATUS_ACTIVE,
            'google2fa_ts' => now()->timestamp,
        ]);

        $response = $this->actingAs($admin, 'admin')->postJson('/admin/posts/generate-ai', [
            'tone' => 'chuyên nghiệp'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['topic']);
    }
}
