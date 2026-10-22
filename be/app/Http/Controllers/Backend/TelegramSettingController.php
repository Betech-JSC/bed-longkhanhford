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
            : ((function_exists('settings') ? (settings()->group('telegram')->get('telegram_bot_token') ?: settings()->group('notification')->get('telegram_bot_token')) : null) ?: config('services.telegram.bot_token'));

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
            : ((function_exists('settings') ? (settings()->group('telegram')->get('telegram_bot_token') ?: settings()->group('notification')->get('telegram_bot_token')) : null) ?: config('services.telegram.bot_token'));

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
            $rawKnown = \Illuminate\Support\Facades\DB::table('settings')->where('group', 'telegram')->where('name', 'telegram_known_chats')->value('val');
            $known = is_string($rawKnown) ? (json_decode($rawKnown, true) ?: []) : [];
            foreach (\App\Models\Vehicle\LandingPage::with('salesConsultant')->whereNotNull('telegram_chat_id')->where('telegram_chat_id', '!=', '')->get() as $lp) {
                $cid = trim((string) $lp->telegram_chat_id);
                if (!isset($known[$cid])) $known[$cid] = ['chat_id' => $cid, 'telegram_name' => 'Telegram'];
                if ($lp->salesConsultant) {
                    $known[$cid]['consultant_name'] = $lp->salesConsultant->name;
                    $known[$cid]['sales_consultant_id'] = $lp->sales_consultant_id;
                }
            }
            foreach ($updates as $u) {
                $c = $u['message']['chat'] ?? $u['my_chat_member']['chat'] ?? $u['channel_post']['chat'] ?? null;
                if ($c && isset($c['id'])) {
                    $cid = (string) $c['id'];
                    $tgName = trim(($c['first_name'] ?? '') . ' ' . ($c['last_name'] ?? '')) ?: ($c['title'] ?? ($c['username'] ?? 'Tài khoản cá nhân'));
                    $known[$cid] = array_merge($known[$cid] ?? [], ['chat_id' => $cid, 'telegram_name' => $tgName, 'username' => $c['username'] ?? null]);
                }
            }
            if ($request->boolean('only_list')) {
                \Illuminate\Support\Facades\DB::table('settings')->updateOrInsert(['group' => 'telegram', 'name' => 'telegram_known_chats'], ['val' => json_encode($known, JSON_UNESCAPED_UNICODE)]);
                return response()->json(['success' => true, 'known_chats' => array_values($known)]);
            }
            if ($selId = $request->input('selected_chat_id')) {
                $updates = [['message' => ['chat' => ['id' => $selId, 'first_name' => $known[$selId]['telegram_name'] ?? 'Telegram']]]];
            }
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
            $ldpId = $request->input('landing_page_id');
            $scId = $request->input('sales_consultant_id') ?: ($ldpId ? \App\Models\Vehicle\LandingPage::where('id', $ldpId)->value('sales_consultant_id') : null);
            $consultantName = $scId ? \App\Models\Vehicle\SalesConsultant::where('id', $scId)->value('name') : ($known[$chatId]['consultant_name'] ?? null);
            $existingScId = $known[$chatId]['sales_consultant_id'] ?? null;
            $existingOwner = $known[$chatId]['consultant_name'] ?? 'Sale khác';
            if ($existingScId && $scId && (string) $existingScId !== (string) $scId) {
                return response()->json([
                    'success' => false,
                    'known_chats' => array_values($known),
                    'message' => "⛔ Chặn bảo mật: Mã Chat ID {$chatId} đã được khóa riêng cho cố vấn {$existingOwner}. Không thể gắn sang trang của cố vấn khác!",
                ], 422);
            }
            if ($consultantName) {
                $known[$chatId]['consultant_name'] = $consultantName;
                $known[$chatId]['sales_consultant_id'] = $scId;
            }
            \Illuminate\Support\Facades\DB::table('settings')->updateOrInsert(['group' => 'telegram', 'name' => 'telegram_known_chats'], ['val' => json_encode($known, JSON_UNESCAPED_UNICODE)]);
            $tgName = $known[$chatId]['telegram_name'] ?? ($chat['title'] ?? ($chat['first_name'] ?? 'Telegram'));
            $title = $consultantName ? "{$consultantName} (Tele: {$tgName})" : $tgName;
            if ($ldpId) {
                \App\Models\Vehicle\LandingPage::where('id', $ldpId)->update(['telegram_chat_id' => $chatId]);
            }
            return response()->json([
                'success' => true,
                'chat_id' => $chatId,
                'title' => $title,
                'consultant_name' => $consultantName,
                'telegram_name' => $tgName,
                'known_chats' => array_values($known),
                'message' => $consultantName ? "Đã gắn Chat ID {$chatId} cho cố vấn {$consultantName} (Tele: {$tgName})" : "Tìm thấy Chat ID: {$chatId} ({$tgName})",
            ]);
            $title = $chat['title'] ?? ($chat['first_name'] ?? ($chat['username'] ?? 'Tài khoản cá nhân'));
            if ($ldpId = $request->input('landing_page_id')) {
                \App\Models\Vehicle\LandingPage::where('id', $ldpId)->update(['telegram_chat_id' => $chatId]);
            }

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
