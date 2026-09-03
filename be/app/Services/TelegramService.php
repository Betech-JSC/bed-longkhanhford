<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    private string $botToken;
    private string $chatId;
    private bool $enabled;
    private string $baseUrl = 'https://api.telegram.org';

    public function __construct()
    {
        $this->loadConfig();
    }

    /**
     * Nạp cấu hình mới nhất từ Database hoặc .env
     */
    public function loadConfig(): void
    {
        $botToken = '';
        $chatId = '';
        $enabled = true;

        if (function_exists('settings')) {
            // Ưu tiên 1: Đọc từ nhóm 'telegram' do người dùng cấu hình trong CMS Admin
            $botToken = (string) (settings()->group('telegram')->get('telegram_bot_token') ?? '');
            $chatId = (string) (settings()->group('telegram')->get('telegram_chat_id') ?? '');
            $rawEnabled = settings()->group('telegram')->get('telegram_enabled');

            if ($rawEnabled !== null) {
                $enabled = !in_array($rawEnabled, [false, 0, '0', 'false'], true);
            }

            // Ưu tiên 2 (dự phòng): Đọc từ nhóm 'notification'
            if (empty($botToken)) {
                $botToken = (string) (settings()->group('notification')->get('telegram_bot_token') ?? '');
            }
            if (empty($chatId)) {
                $chatId = (string) (settings()->group('notification')->get('telegram_chat_id') ?? '');
            }
        }

        // Ưu tiên 3 (dự phòng cuối): Đọc từ file .env / services.php
        if (empty($botToken)) {
            $botToken = (string) config('services.telegram.bot_token', '');
        }

        if (empty($chatId)) {
            $chatId = (string) config('services.telegram.chat_id', '');
        }

        $this->botToken = trim($botToken);
        $this->chatId = trim($chatId);
        $this->enabled = $enabled;
    }

    /**
     * Gửi thông báo Lead nóng cho Sales team qua Telegram
     */
    public function sendHotLeadAlert(array $leadData, string $sessionId): bool
    {
        // Luôn nạp cấu hình mới nhất từ CSDL
        $this->loadConfig();

        if (!$this->enabled) {
            Log::info('Telegram notification is disabled in settings, skipping lead alert');
            return false;
        }

        if (empty($this->botToken) || empty($this->chatId)) {
            Log::warning('Telegram not configured, skipping lead alert', $leadData);
            return false;
        }

        $title = $leadData['title'] ?? null;
        $type = $leadData['type'] ?? 'general';
        
        if (empty($title)) {
            $title = match ($type) {
                'test_drive' => '🚘 ĐĂNG KÝ LÁI THỬ XE',
                'quote', 'new_car_quote' => '💰 YÊU CẦU BÁO GIÁ XE MỚI',
                'repair_quote' => '🔧 BÁO GIÁ SỬA CHỮA & BẢO DƯỠNG',
                'service_booking' => '🛠️ ĐẶT LỊCH HẸN BẢO DƯỠNG',
                'apply' => '💼 HỒ SƠ ỨNG TUYỂN TUYỂN DỤNG',
                'callback' => '📞 YÊU CẦU GỌI LẠI',
                default => '💬 KHÁCH HÀNG ĐĂNG KÝ MỚI',
            };
        }

        $title = $this->escapeMarkdown($title);
        $source = $this->escapeMarkdown($leadData['source'] ?? ($type === 'chatbot' ? '🤖 AI Chatbot Trực Tuyến' : '🌐 Website Long Khánh Ford'));

        $name = $this->escapeMarkdown($leadData['name'] ?? 'Chưa rõ');
        $phone = str_replace(['`', '\\'], '', (string) ($leadData['phone'] ?? 'Chưa có'));
        $email = $this->escapeMarkdown($leadData['email'] ?? null);
        $vehicle = $this->escapeMarkdown($leadData['vehicle'] ?? null);
        $service = $this->escapeMarkdown($leadData['service'] ?? null);
        $messageText = $leadData['message'] ?? null;
        $licensePlate = $this->escapeMarkdown($leadData['license_plate'] ?? null);
        $mileage = $this->escapeMarkdown($leadData['mileage'] ?? null);
        $appointment = $this->escapeMarkdown($leadData['appointment'] ?? null);
        $location = $this->escapeMarkdown($leadData['location'] ?? null);
        $city = $this->escapeMarkdown($leadData['city'] ?? null);
        $paymentMethod = $this->escapeMarkdown($leadData['payment_method'] ?? null);
        $safeSessionId = str_replace(['`', '\\'], '', (string) $sessionId);

        // Xây dựng nội dung tin nhắn Telegram
        $message = "🔔 *{$title}*\n\n";
        $message .= "📝 *Nguồn tiếp nhận:* {$source}\n";
        $message .= "👤 *Khách hàng:* {$name}\n";
        $message .= "📞 *Số điện thoại:* `{$phone}`\n";

        if (!empty($email)) {
            $message .= "📧 *Email:* {$email}\n";
        }

        if (!empty($vehicle)) {
            $message .= "🚗 *Dòng xe quan tâm:* {$vehicle}\n";
        }

        if (!empty($licensePlate)) {
            $message .= "🔢 *Biển số xe:* `{$licensePlate}`\n";
        }

        if (!empty($appointment)) {
            $message .= "📅 *Thời gian hẹn:* {$appointment}\n";
        }

        if (!empty($location)) {
            $message .= "📍 *Địa điểm làm dịch vụ:* {$location}\n";
        }

        if (!empty($leadData['payment_method'])) {
            $message .= "💳 *Hình thức mua:* {$leadData['payment_method']}\n";
        }

        if (!empty($city)) {
            $message .= "🏙️ *Tỉnh/Thành nhận xe:* {$city}\n";
        }

        if (!empty($service)) {
            $message .= "🛠️ *Dịch vụ / Gói:* {$service}\n";
        }

        if (!empty($mileage)) {
            $message .= "📈 *Số KM hiện tại:* {$mileage} km\n";
        }

        if (!empty($messageText) && trim($messageText) !== '') {
            $cleanMsg = str_replace(['`', '*', '_'], '', trim($messageText));
            $msgLabel = match($type) {
                'service_booking' => 'Nội dung yêu cầu dịch vụ',
                'repair_quote' => 'Mô tả tình trạng xe / Ghi chú',
                'quote', 'new_car_quote' => 'Ghi chú yêu cầu thêm',
                default => 'Nội dung yêu cầu / Lời nhắn',
            };
            $message .= "\n💬 *{$msgLabel}:*\n_{$cleanMsg}_\n";
        }

        $message .= "\n🆔 *Mã phiên (ID):* `{$safeSessionId}`\n";
        $message .= "⏰ " . $this->formatTime() . "\n\n";
        $message .= "💡 _Vui lòng kiểm tra và xử lý liên hệ ngay để hỗ trợ khách hàng!_";

        try {
            $response = Http::timeout(10)->post(
                "{$this->baseUrl}/bot{$this->botToken}/sendMessage",
                [
                    'chat_id' => $this->chatId,
                    'text' => $message,
                    'parse_mode' => 'Markdown',
                    'disable_web_page_preview' => true,
                ]
            );

            if ($response->successful()) {
                Log::info('Telegram lead alert sent', ['session' => $sessionId]);
                return true;
            }

            Log::error('Telegram API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return false;
        } catch (\Throwable $e) {
            Log::error('TelegramService exception', [
                'message' => $e->getMessage(),
            ]);
            return false;
        }
    }

    private function escapeMarkdown(?string $text): string
    {
        if ($text === null || $text === '') {
            return '';
        }
        // Tránh lỗi Telegram Markdown V1 khi gặp ký tự _, *, `, [
        return str_replace(['\\', '_', '*', '`', '['], ['\\\\', '\_', '\*', '\`', '\['], (string) $text);
    }

    private function formatTime(): string
    {
        return now()->timezone('Asia/Ho_Chi_Minh')->format('H:i d/m/Y');
    }
}
