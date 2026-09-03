<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Services\TelegramService;
use App\Http\Controllers\Backend\TelegramSettingController;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TelegramNotificationTest extends TestCase
{
    /**
     * Test Setting model validation rules for telegram
     */
    public function test_setting_rules_for_telegram(): void
    {
        $rules = Setting::rules('telegram');
        $this->assertArrayHasKey('telegram_enabled', $rules);
        $this->assertArrayHasKey('telegram_bot_token', $rules);
        $this->assertArrayHasKey('telegram_chat_id', $rules);
    }

    /**
     * Test TelegramService instantiation and loadConfig
     */
    public function test_telegram_service_load_config(): void
    {
        config([
            'services.telegram.bot_token' => '123456:TEST_BOT_TOKEN',
            'services.telegram.chat_id' => '-100987654321',
        ]);

        $service = new TelegramService();
        $this->assertInstanceOf(TelegramService::class, $service);
    }

    /**
     * Test sending hot lead alert with successful Telegram API response
     */
    public function test_send_hot_lead_alert_success(): void
    {
        Http::fake([
            'https://api.telegram.org/*' => Http::response([
                'ok' => true,
                'result' => [
                    'message_id' => 999,
                ],
            ], 200),
        ]);

        $service = new TelegramService();

        $leadData = [
            'type' => 'test_drive',
            'name' => 'Nguyễn Văn A',
            'phone' => '0901234567',
            'email' => 'test@example.com',
            'vehicle' => 'Ford Ranger Wildtrak 2026',
            'appointment' => '10:00 15/09/2026',
            'location' => 'Showroom Long Khánh Ford',
            'message' => 'Tư vấn lái thử xe bản cao cấp [Đăng ký tư vấn từ popup trang chủ]',
            'city' => 'Đồng Nai',
        ];

        $result = $service->sendHotLeadAlert($leadData, 'TEST-SESSION-001');
        $this->assertTrue($result);

        Http::assertSent(function ($request) {
            $data = $request->data();
            return str_contains($request->url(), 'sendMessage')
                && $data['parse_mode'] === 'Markdown'
                && str_contains($data['text'], 'ĐĂNG KÝ LÁI THỬ XE')
                && str_contains($data['text'], 'Nguyễn Văn A')
                && str_contains($data['text'], '0901234567')
                && str_contains($data['text'], 'Ford Ranger Wildtrak 2026')
                && str_contains($data['text'], 'Website Long Khánh Ford');
        });
    }

    /**
     * Test sending hot lead alert with Markdown special characters escaping
     */
    public function test_markdown_escaping_in_hot_lead_alert(): void
    {
        Http::fake([
            'https://api.telegram.org/*' => Http::response(['ok' => true], 200),
        ]);

        $service = new TelegramService();

        $leadData = [
            'type' => 'repair_quote',
            'name' => 'Trần_Văn*B [VIP]',
            'phone' => '0912345678',
            'vehicle' => 'Ford Everest Titanium 4x4',
            'license_plate' => '60A-123.45',
            'mileage' => '20000',
            'service' => 'Bảo dưỡng định kỳ cấp 20.000km',
            'message' => 'Kiểm tra tiếng kêu `phanh trước` và thay *lọc nhớt*',
        ];

        $result = $service->sendHotLeadAlert($leadData, 'TEST-SESSION-002');
        $this->assertTrue($result);

        Http::assertSent(function ($request) {
            $text = $request->data()['text'];
            return str_contains($text, 'Trần\_Văn\*B \[VIP]')
                && str_contains($text, '60A-123.45')
                && str_contains($text, '20000 km')
                && str_contains($text, 'BÁO GIÁ SỬA CHỮA & BẢO DƯỠNG');
        });
    }

    /**
     * Test TelegramSettingController testConnection method
     */
    public function test_telegram_setting_controller_test_connection(): void
    {
        Http::fake([
            'https://api.telegram.org/bot123456:FAKE_TOKEN/sendMessage' => Http::response([
                'ok' => true,
                'result' => ['message_id' => 101],
            ], 200),
        ]);

        $controller = new TelegramSettingController();
        $request = Request::create('/admin/settings/telegram/test', 'POST', [
            'bot_token' => '123456:FAKE_TOKEN',
            'chat_id' => '-100111222333',
        ]);

        $response = $controller->testConnection($request);
        $data = json_decode($response->getContent(), true);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertTrue($data['success']);
        $this->assertStringContainsString('Kết nối thành công', $data['message']);

        Http::assertSent(function ($req) {
            return str_contains($req->data()['text'], 'LONG KHÁNH FORD - HỆ THỐNG CMS');
        });
    }

    /**
     * Test TelegramSettingController detectChatId method
     */
    public function test_telegram_setting_controller_detect_chat_id(): void
    {
        Http::fake([
            'https://api.telegram.org/bot123456:FAKE_TOKEN/getUpdates' => Http::response([
                'ok' => true,
                'result' => [
                    [
                        'update_id' => 1234567,
                        'message' => [
                            'message_id' => 1,
                            'from' => ['id' => 9999, 'first_name' => 'Admin'],
                            'chat' => [
                                'id' => -10099887766,
                                'title' => 'Nhóm Sales Long Khánh Ford',
                                'type' => 'supergroup',
                            ],
                            'text' => 'test',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $controller = new TelegramSettingController();
        $request = Request::create('/admin/settings/telegram/detect-chat-id', 'POST', [
            'bot_token' => '123456:FAKE_TOKEN',
        ]);

        $response = $controller->detectChatId($request);
        $data = json_decode($response->getContent(), true);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertTrue($data['success']);
        $this->assertEquals('-10099887766', $data['chat_id']);
        $this->assertEquals('Nhóm Sales Long Khánh Ford', $data['title']);
    }

    /**
     * Test TelegramSettingController validation when token is missing
     */
    public function test_telegram_setting_controller_validation_missing_token(): void
    {
        $controller = new TelegramSettingController();
        $request = Request::create('/admin/settings/telegram/test', 'POST', [
            'bot_token' => '',
            'chat_id' => '',
        ]);
        $response = $controller->testConnection($request);
        $this->assertEquals(422, $response->getStatusCode());
    }

    /**
     * Test ContactController store triggers Telegram hot lead alert
     */
    public function test_contact_controller_store_triggers_telegram_alert(): void
    {
        Http::fake([
            'https://api.telegram.org/*' => Http::response(['ok' => true, 'result' => ['message_id' => 888]], 200),
        ]);

        $response = $this->postJson('/api/contacts', [
            'contact' => [
                'type' => 'SERVICE_BOOKING',
                'data' => [
                    'Name' => 'Phạm Văn Long',
                    'Phone' => '0988776655',
                    'Email' => 'longpv@gmail.com',
                    'Họ và tên' => 'Phạm Văn Long',
                    'Số điện thoại' => '0988776655',
                    'Biển số xe' => '60F-999.88',
                    'Thời gian hẹn' => '2026-09-10',
                    'Nội dung yêu cầu dịch vụ' => 'Bảo dưỡng xe định kỳ 10.000km',
                    'Tại' => 'Xưởng dịch vụ Long Khánh Ford',
                ],
            ],
        ]);

        $response->assertStatus(200);

        Http::assertSent(function ($request) {
            $text = $request->data()['text'] ?? '';
            return str_contains($text, 'Phạm Văn Long')
                && str_contains($text, '0988776655')
                && str_contains($text, '60F-999.88')
                && str_contains($text, '10/09/2026')
                && str_contains($text, 'ĐẶT HẸN DỊCH VỤ TRỰC TUYẾN');
        });
    }
}
