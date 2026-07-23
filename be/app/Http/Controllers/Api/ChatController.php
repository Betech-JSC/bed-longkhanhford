<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use App\Services\GeminiService;
use App\Services\TelegramService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    use ApiResponse;

    private GeminiService $gemini;
    private TelegramService $telegram;

    public function __construct(GeminiService $gemini, TelegramService $telegram)
    {
        $this->gemini = $gemini;
        $this->telegram = $telegram;
    }

    /**
     * POST /api/ai/chat
     *
     * Request: { message: string, session_id?: string }
     * Response: { success: true, data: { reply: string, session_id: string } }
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'session_id' => 'nullable|string|max:64',
        ]);

        $userMessage = trim($request->input('message'));
        $sessionId = $request->input('session_id');

        // Rate limiting: max 20 messages per session per 10 minutes
        if ($sessionId) {
            $session = ChatSession::where('session_id', $sessionId)->first();
            if ($session) {
                $recentMessages = collect($session->messages ?? [])
                    ->filter(fn($msg) =>
                        ($msg['role'] ?? '') === 'user' &&
                        isset($msg['timestamp']) &&
                        now()->diffInMinutes($msg['timestamp']) < 10
                    );

                if ($recentMessages->count() >= 20) {
                    return $this->success([
                        'reply' => 'Bạn đang gửi quá nhiều tin nhắn. Vui lòng chờ một chút hoặc gọi trực tiếp Hotline 0812 86 86 22 nhé!',
                        'session_id' => $sessionId,
                    ]);
                }
            }
        }

        // Get or create session
        if (!$sessionId) {
            $sessionId = 'chat_' . Str::random(32);
        }

        $session = ChatSession::firstOrCreate(
            ['session_id' => $sessionId],
            [
                'messages' => [],
                'lead_score' => 'cold',
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]
        );

        // Add user message to history
        $session->addMessage('user', $userMessage);

        // Get conversation history for context
        $history = $session->getGeminiHistory();
        // Only send last 20 messages for context window management
        $recentHistory = array_slice($history, -20, -1); // exclude the last user message (already in the prompt)

        // Call Gemini API
        $result = $this->gemini->chat($userMessage, $recentHistory);
        $reply = $result['reply'];
        $leadData = $result['lead_data'];

        // Save bot response
        $session->addMessage('assistant', $reply);

        // Process form data if submitted by client
        $formData = $request->input('form_data');
        if ($formData && is_array($formData)) {
            $score = 'hot';
            $session->updateLeadInfo(
                $score,
                array_filter([
                    'name' => $formData['name'] ?? null,
                    'phone' => $formData['phone'] ?? null,
                    'email' => $formData['email'] ?? null,
                    'type' => $formData['type'] ?? null,
                    'date' => $formData['date'] ?? null,
                    'time' => $formData['time'] ?? null,
                    'license_plate' => $formData['license_plate'] ?? null,
                ]),
                $formData['vehicle'] ?? null
            );

            // Send Telegram alert immediately for explicit form submits
            $alertData = array_merge($leadData ?? [], $formData, ['score' => $score]);
            $this->telegram->sendHotLeadAlert($alertData, $sessionId);
            $session->notified = true;
            $session->save();
        } else if ($leadData) {
            $score = $leadData['score'] ?? 'cold';
            $session->updateLeadInfo(
                $score,
                array_filter([
                    'name' => $leadData['name'] ?? null,
                    'phone' => $leadData['phone'] ?? null,
                ]),
                $leadData['vehicle'] ?? null
            );

            // Send Telegram alert for hot leads (only once)
            if (in_array($score, ['hot', 'warm']) && !$session->notified) {
                $sent = $this->telegram->sendHotLeadAlert($leadData, $sessionId);
                if ($sent) {
                    $session->notified = true;
                    $session->save();
                }
            }
        }

        return $this->success([
            'reply' => $reply,
            'session_id' => $sessionId,
        ]);
    }
}
