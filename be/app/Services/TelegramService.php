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

        $saleChatIds = array_values(array_unique(array_filter(array_map('trim', (array) ($leadData['telegram_chat_ids'] ?? [])))));
        $targetChatIds = !empty($saleChatIds) ? $saleChatIds : array_values(array_unique(array_filter(array_map('trim', explode(',', (string) $this->chatId)))));
        $targetChatIds = array_values(array_unique(array_filter(array_map('trim', $targetChatIds))));
        if (empty($this->botToken) || empty($targetChatIds)) {
            try { Log::warning('Telegram not configured, skipping lead alert', $leadData); } catch (\Throwable $_) {}
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
        $rollingCost = $this->escapeMarkdown($leadData['rolling_cost'] ?? null);
        $safeSessionId = str_replace(['`', '\\'], '', (string) $sessionId);

        // Xây dựng nội dung tin nhắn Telegram
        $message = "🔔 *{$title}*\n\n";
        $message .= "📝 *Nguồn tiếp nhận:* {$source}\n";
        if (!empty($leadData['consultant_name'])) {
            $message .= "👨‍💼 *Cố vấn phụ trách:* " . $this->escapeMarkdown($leadData['consultant_name']) . "\n";
        }
        $message .= "👤 *Khách hàng:* {$name}\n";
        if (in_array($type, ['ldp_click_call', 'ldp_click_zalo'], true)) {
            if (!empty($leadData['consultant_phone'])) {
                $scPhone = str_replace(['`', '\\'], '', (string) $leadData['consultant_phone']);
                $message .= "📱 *SĐT/Zalo Sale nhận liên hệ:* `{$scPhone}`\n";
            }
            if (!empty($leadData['button_position'])) {
                $message .= "🎯 *Vị trí nút bấm:* " . $this->escapeMarkdown($leadData['button_position']) . "\n";
            }
            if (!empty($leadData['page_url'])) {
                $message .= "🔗 *Trang LDP:* " . $this->escapeMarkdown($leadData['page_url']) . "\n";
            }
        } else {
            $message .= "📞 *Số điện thoại:* `{$phone}`\n";
        }

        if (!empty($email)) {
            $message .= "📧 *Email:* {$email}\n";
        }

        if (!empty($vehicle)) {
            $vehLabel = match($type) {
                'test_drive' => 'Dòng xe đăng ký lái thử',
                'rolling_cost' => 'Dòng xe & Phiên bản',
                'used_vehicle' => 'Xe đã qua sử dụng',
                'accessory' => 'Phụ kiện quan tâm',
                'repair_quote' => 'Dòng xe sửa chữa / bảo dưỡng',
                default => 'Dòng xe quan tâm',
            };
            $message .= "🚗 *{$vehLabel}:* {$vehicle}\n";
            if (!empty($rollingCost)) {
                $message .= "💰 *Tổng dự toán lăn bánh:* {$rollingCost}\n";
            }
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

        if (!empty($paymentMethod)) {
            $message .= "💳 *Hình thức mua:* {$paymentMethod}\n";
        }

        if (!empty($city)) {
            $cityLabel = match($type) {
                'rolling_cost' => 'Khu vực đăng ký lăn bánh',
                'test_drive' => 'Khu vực đăng ký lái thử',
                default => 'Tỉnh/Thành phố',
            };
            $message .= "🏙️ *{$cityLabel}:* {$city}\n";
        }

        if (!empty($service)) {
            $srvLabel = match($type) {
                'apply' => 'Thông tin ứng tuyển',
                'accessory' => 'Thông tin lắp đặt',
                'survey' => 'Kết quả đánh giá',
                default => 'Dịch vụ / Gói',
            };
            $message .= "🛠️ *{$srvLabel}:* {$service}\n";
        }

        if (!empty($mileage)) {
            $message .= "📈 *Số KM hiện tại:* {$mileage} km\n";
        }

        if (!empty($messageText) && trim($messageText) !== '') {
            $cleanMsg = str_replace(['`', '*', '_'], '', trim($messageText));
            $msgLabel = match($type) {
                'service_booking' => 'Nội dung yêu cầu dịch vụ',
                'repair_quote' => 'Mô tả tình trạng xe / Ghi chú',
                'quote', 'new_car_quote', 'rolling_cost', 'test_drive', 'used_vehicle', 'accessory' => 'Ghi chú của khách hàng',
                'apply' => 'Lời nhắn ứng viên',
                'survey' => 'Ý kiến đóng góp thêm',
                default => 'Nội dung yêu cầu / Lời nhắn',
            };
            $message .= "\n💬 *{$msgLabel}:*\n_{$cleanMsg}_\n";
        }

        $message .= "\n🆔 *Mã phiên (ID):* `{$safeSessionId}`\n";
        $message .= "⏰ " . $this->formatTime() . "\n\n";
        $message .= "💡 _Vui lòng kiểm tra và xử lý liên hệ ngay để hỗ trợ khách hàng!_";

        foreach (array_slice($targetChatIds, 1) as $extraChatId) {
            try {
                Http::timeout(10)->post("{$this->baseUrl}/bot{$this->botToken}/sendMessage", [
                    'chat_id' => $extraChatId,
                    'text' => $message,
                    'parse_mode' => 'Markdown',
                    'disable_web_page_preview' => true,
                ]);
            } catch (\Throwable $e) {
                try { Log::warning('Telegram extra chat_id error: ' . $e->getMessage()); } catch (\Throwable $_) {}
            }
        }

        try {
            $response = Http::timeout(10)->post(
                "{$this->baseUrl}/bot{$this->botToken}/sendMessage",
                [
                    'chat_id' => $targetChatIds[0],
                    'text' => $message,
                    'parse_mode' => 'Markdown',
                    'disable_web_page_preview' => true,
                ]
            );

            if ($response->successful()) {
                try { Log::info('Telegram lead alert sent', ['session' => $sessionId]); } catch (\Throwable $_) {}
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
