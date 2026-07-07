<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramService
{
    private string $botToken;
    private string $chatId;
    private string $baseUrl = 'https://api.telegram.org';

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token', '');
        $this->chatId = config('services.telegram.chat_id', '');
    }

    /**
     * Gửi thông báo Lead nóng cho Sales team qua Telegram
     */
    public function sendHotLeadAlert(array $leadData, string $sessionId): bool
    {
        if (empty($this->botToken) || empty($this->chatId)) {
            Log::warning('Telegram not configured, skipping lead alert', $leadData);
            return false;
        }

        $score = strtoupper($leadData['score'] ?? 'WARM');
        $scoreEmoji = match ($score) {
            'HOT' => '🔥🔥🔥',
            'WARM' => '🟠',
            default => '🔵',
        };

        $name = $leadData['name'] ?? 'Chưa rõ';
        $phone = $leadData['phone'] ?? 'Chưa có';
        $vehicle = $leadData['vehicle'] ?? 'Chưa xác định';
        $type = $leadData['type'] ?? 'general';
        
        $typeLabel = match ($type) {
            'test_drive' => '🚘 ĐĂNG KÝ LÁI THỬ',
            'quote' => '💰 YÊU CẦU BÁO GIÁ',
            'service_booking' => '🛠️ ĐẶT LỊCH HẸN BẢO DƯỠNG',
            'callback' => '📞 YÊU CẦU GỌI LẠI',
            default => '💬 LEAD HỘI THOẠI KHÁCH HÀNG',
        };

        $message = "{$scoreEmoji} *{$typeLabel} TỪ AI CHATBOT*\n\n";
        $message .= "👤 *Khách hàng:* {$name}\n";
        $message .= "📞 *SĐT:* `{$phone}`\n";
        
        if (!empty($leadData['email'])) {
            $message .= "📧 *Email:* {$leadData['email']}\n";
        }
        
        $message .= "🚗 *Xe quan tâm:* {$vehicle}\n";

        if ($type === 'service_booking') {
            $date = $leadData['date'] ?? 'N/A';
            $time = $leadData['time'] ?? 'N/A';
            $plate = $leadData['license_plate'] ?? 'Chưa rõ';
            $message .= "📅 *Ngày hẹn:* {$date}\n";
            $message .= "⏰ *Giờ hẹn:* {$time}\n";
            $message .= "🔢 *Biển số xe:* {$plate}\n";
        }

        $message .= "📊 *Mức độ:* {$score}\n";
        $message .= "🆔 *Session:* `{$sessionId}`\n\n";
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

    private function formatTime(): string
    {
        return now()->timezone('Asia/Ho_Chi_Minh')->format('H:i d/m/Y');
    }
}
