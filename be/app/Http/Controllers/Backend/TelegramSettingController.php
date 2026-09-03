<?php

namespace App\Http\Controllers\Backend;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TelegramSettingController extends Controller
{
    public function testConnection(Request $request)
    {
        $botToken = $request->has('bot_token') 
            ? $request->input('bot_token') 
            : ((function_exists('settings') ? settings()->group('telegram')->get('telegram_bot_token') : null) ?: config('services.telegram.bot_token'));

        $chatId = $request->has('chat_id') 
            ? $request->input('chat_id') 
            : ((function_exists('settings') ? settings()->group('telegram')->get('telegram_chat_id') : null) ?: config('services.telegram.chat_id'));

        $botToken = trim((string) $botToken);
        $chatId = trim((string) $chatId);

        if (empty($botToken)) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập Telegram Bot Token trước khi kiểm tra.',
            ], 422);
        }

        if (empty($chatId)) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập Telegram Chat ID trước khi kiểm tra.',
            ], 422);
        }

        $now = now()->timezone('Asia/Ho_Chi_Minh')->format('H:i:s d/m/Y');
        $message = "🔔 *[LONG KHÁNH FORD - HỆ THỐNG CMS]*\n\n"
                 . "✅ *Kiểm tra kết nối Telegram Bot thành công!*\n"
                 . "🤖 Hệ thống đã sẵn sàng tự động gửi cảnh báo Lead nóng (Hot Lead) từ Website và AI Chatbot về kênh này.\n\n"
                 . "⏰ *Thời gian kiểm tra:* `{$now}`";

        try {
            $response = Http::timeout(10)->post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'Markdown',
                'disable_web_page_preview' => true,
            ]);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Kết nối thành công! Tin nhắn kiểm tra đã được gửi đến Telegram.',
                ]);
            }

            $errorData = $response->json();
            $description = $errorData['description'] ?? ('Mã lỗi HTTP: ' . $response->status());

            return response()->json([
                'success' => false,
                'message' => 'Telegram phản hồi lỗi: ' . $description,
            ], 400);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể kết nối tới máy chủ Telegram: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function detectChatId(Request $request)
    {
        $botToken = $request->has('bot_token') 
            ? $request->input('bot_token') 
            : ((function_exists('settings') ? settings()->group('telegram')->get('telegram_bot_token') : null) ?: config('services.telegram.bot_token'));

        $botToken = trim((string) $botToken);

        if (empty($botToken)) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng nhập Telegram Bot Token trước khi tìm Chat ID.',
            ], 422);
        }

        try {
            $response = Http::timeout(10)->get("https://api.telegram.org/bot{$botToken}/getUpdates");
            if (!$response->successful()) {
                $err = $response->json()['description'] ?? $response->body();
                return response()->json([
                    'success' => false,
                    'message' => 'Lỗi kết nối Telegram API: ' . $err,
                ], 400);
            }

            $updates = $response->json()['result'] ?? [];
            if (empty($updates)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chưa thấy tin nhắn mới nào gửi cho bot. Bạn hãy vào Telegram gửi 1 chữ (ví dụ: "hi" hoặc "test") cho bot rồi bấm lại nút này nhé!',
                ], 404);
            }

            // Lấy update mới nhất có chứa chat
            $chat = null;
            for ($i = count($updates) - 1; $i >= 0; $i--) {
                $u = $updates[$i];
                $c = $u['message']['chat'] 
                  ?? $u['my_chat_member']['chat'] 
                  ?? $u['channel_post']['chat'] 
                  ?? null;
                if ($c && isset($c['id'])) {
                    $chat = $c;
                    break;
                }
            }

            if (!$chat) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không thể tìm thấy thông tin chat. Bạn hãy nhắn 1 tin nhắn bất kỳ cho bot rồi thử lại.',
                ], 404);
            }

            $chatId = (string) $chat['id'];
            $title = $chat['title'] ?? ($chat['first_name'] ?? ($chat['username'] ?? 'Tài khoản cá nhân'));

            return response()->json([
                'success' => true,
                'chat_id' => $chatId,
                'title' => $title,
                'message' => "Tìm thấy Chat ID: {$chatId} ({$title})",
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi kết nối: ' . $e->getMessage(),
            ], 500);
        }
    }
}
