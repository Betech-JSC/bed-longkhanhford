<?php

namespace App\Models;

use App\Models\BaseModel;
use App\Traits\Searchable;

class ChatSession extends BaseModel
{
    use Searchable;
    protected $fillable = [
        'session_id',
        'messages',
        'lead_score',
        'contact_info',
        'interested_vehicle',
        'ip_address',
        'user_agent',
        'notified',
    ];

    protected $casts = [
        'messages' => 'array',
        'contact_info' => 'array',
        'notified' => 'boolean',
    ];

    protected $searchable = [
        'columns' => [
            'chat_sessions.session_id' => 10,
            'chat_sessions.interested_vehicle' => 8,
            'chat_sessions.lead_score' => 5,
        ],
    ];

    /**
     * Thêm message vào conversation history
     */
    public function addMessage(string $role, string $content): void
    {
        $messages = $this->messages ?? [];
        $messages[] = [
            'role' => $role,
            'content' => $content,
            'timestamp' => now()->toISOString(),
        ];

        // Giữ tối đa 50 messages per session để tránh token overflow
        if (count($messages) > 50) {
            $messages = array_slice($messages, -50);
        }

        $this->messages = $messages;
        $this->save();
    }

    /**
     * Cập nhật thông tin lead
     */
    public function updateLeadInfo(string $score, ?array $contactInfo = null, ?string $vehicle = null): void
    {
        $this->lead_score = $score;

        if ($contactInfo) {
            $existing = $this->contact_info ?? [];
            $this->contact_info = array_merge($existing, $contactInfo);
        }

        if ($vehicle) {
            $this->interested_vehicle = $vehicle;
        }

        $this->save();
    }

    /**
     * Lấy conversation history dạng Gemini API format
     */
    public function getGeminiHistory(): array
    {
        $messages = $this->messages ?? [];
        $history = [];

        foreach ($messages as $msg) {
            $history[] = [
                'role' => $msg['role'] === 'user' ? 'user' : 'model',
                'parts' => [['text' => $msg['content']]],
            ];
        }

        return $history;
    }

    /**
     * Scope: Chỉ lấy Hot Leads chưa thông báo
     */
    public function scopeUnnotifiedHotLeads($query)
    {
        return $query->where('lead_score', 'hot')
                     ->where('notified', false);
    }
}
