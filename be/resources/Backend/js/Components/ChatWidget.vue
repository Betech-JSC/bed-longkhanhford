<template>
    <div class="fixed bottom-6 right-6 z-[9999] font-sans">
        <!-- Floating Chat Button -->
        <button
            @click="toggleChat"
            type="button"
            class="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#003478] to-[#0562D2] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none relative group"
            aria-label="Chat với trợ lý AI"
        >
            <!-- Pulse ring effect -->
            <span class="absolute inline-flex h-full w-full rounded-full bg-[#0562D2] opacity-40 animate-ping group-hover:animate-none"></span>
            
            <svg
                v-if="!isOpen"
                class="w-6 h-6 relative z-10 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
            </svg>
            <svg
                v-else
                class="w-6 h-6 relative z-10 rotate-90 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>

        <!-- Chat Window -->
        <div
            v-if="isOpen"
            class="fixed bottom-24 right-6 w-[360px] sm:w-[380px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right"
        >
            <!-- Header -->
            <div class="bg-gradient-to-r from-[#003478] to-[#0562D2] p-4 text-white flex items-center justify-between shadow-md">
                <div class="flex items-center space-x-3">
                    <!-- Ford Logo Avatar -->
                    <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center p-1 overflow-hidden" style="width: 40px; height: 40px; min-width: 40px; min-height: 40px; flex-shrink: 0;">
                        <img src="/ford_logo.svg" alt="Ford Logo" class="w-8 h-8 object-contain" style="width: 32px; height: 32px; min-width: 32px; min-height: 32px; object-fit: contain;" />
                    </div>
                    <div>
                        <h4 class="font-bold text-sm leading-tight tracking-wide">Trợ Lý AI Đồng Nai Ford</h4>
                        <div class="flex items-center space-x-1.5 mt-0.5">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span class="text-[10px] text-white/80 font-medium">Sẵn sàng hỗ trợ</span>
                        </div>
                    </div>
                </div>
                <button
                    @click="closeChat"
                    type="button"
                    class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors cursor-pointer"
                >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            <!-- Messages List -->
            <div
                ref="messageBox"
                class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin"
            >
                <!-- Welcome Message -->
                <div class="flex items-start space-x-2.5">
                    <div class="w-8 h-8 rounded-full bg-[#003478] flex items-center justify-center flex-shrink-0 p-0.5 overflow-hidden" style="width: 32px; height: 32px; min-width: 32px; min-height: 32px; flex-shrink: 0;">
                        <img src="/ford_logo.svg" alt="Ford Logo" class="w-6 h-6 object-contain" style="width: 24px; height: 24px; min-width: 24px; min-height: 24px; object-fit: contain;" />
                    </div>
                    <div class="max-w-[75%] bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-xs">
                        <p class="text-xs text-gray-800 leading-relaxed font-medium">
                            Xin chào! Tôi là Trợ lý AI của Đồng Nai Ford. Tôi có thể giúp bạn kiểm tra thông tin xe, phụ kiện hoặc hỗ trợ các vấn đề vận hành trên CMS. Bạn cần hỗ trợ gì hôm nay?
                        </p>
                    </div>
                </div>

                <!-- Chat History -->
                <div
                    v-for="(msg, idx) in messages"
                    :key="idx"
                    class="flex items-start space-x-2.5"
                    :class="{ 'justify-end space-x-reverse': msg.role === 'user' }"
                >
                    <!-- Avatar for Bot -->
                    <div
                        v-if="msg.role !== 'user'"
                        class="w-8 h-8 rounded-full bg-[#003478] flex items-center justify-center flex-shrink-0 p-0.5 overflow-hidden"
                        style="width: 32px; height: 32px; min-width: 32px; min-height: 32px; flex-shrink: 0;"
                    >
                        <img src="/ford_logo.svg" alt="Ford Logo" class="w-6 h-6 object-contain" style="width: 24px; height: 24px; min-width: 24px; min-height: 24px; object-fit: contain;" />
                    </div>

                    <!-- Message Bubble -->
                    <div
                        class="max-w-[75%] p-3 shadow-xs"
                        :class="[
                            msg.role === 'user'
                                ? 'bg-[#0562D2] text-white rounded-2xl rounded-tr-none'
                                : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none'
                        ]"
                    >
                        <p class="text-xs leading-relaxed font-medium whitespace-pre-line">{{ msg.content }}</p>
                    </div>
                </div>

                <!-- Typing Indicator -->
                <div v-if="isTyping" class="flex items-start space-x-2.5">
                    <div class="w-8 h-8 rounded-full bg-[#003478] flex items-center justify-center flex-shrink-0 p-0.5 overflow-hidden" style="width: 32px; height: 32px; min-width: 32px; min-height: 32px; flex-shrink: 0;">
                        <img src="/ford_logo.svg" alt="Ford Logo" class="w-6 h-6 object-contain" style="width: 24px; height: 24px; min-width: 24px; min-height: 24px; object-fit: contain;" />
                    </div>
                    <div class="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center space-x-1.5 h-[34px]">
                        <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 0ms"></span>
                        <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 150ms"></span>
                        <span class="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style="animation-delay: 300ms"></span>
                    </div>
                </div>
            </div>

            <!-- Footer Input Form -->
            <form
                @submit.prevent="sendMessage"
                class="p-3 bg-white border-t border-gray-100 flex items-center space-x-2"
            >
                <input
                    v-model="inputMessage"
                    type="text"
                    placeholder="Nhập câu hỏi của bạn..."
                    class="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-[#0562D2] focus:bg-white transition"
                    :disabled="isTyping"
                    ref="messageInput"
                />
                <button
                    type="submit"
                    class="flex items-center justify-center w-9 h-9 rounded-full bg-[#0562D2] hover:bg-[#003478] text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition shrink-0 cursor-pointer border-0"
                    :disabled="!inputMessage.trim() || isTyping"
                >
                    <svg class="w-4 h-4 transform rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: "ChatWidget",
    data() {
        return {
            isOpen: false,
            inputMessage: "",
            messages: [],
            isTyping: false,
            sessionId: null,
        };
    },
    mounted() {
        // Load session and history from localStorage
        if (typeof window !== "undefined") {
            this.sessionId = localStorage.getItem("admin-chat-session");
            const storedMessages = localStorage.getItem("admin-chat-messages");
            if (storedMessages) {
                try {
                    this.messages = JSON.parse(storedMessages);
                } catch (e) {
                    console.error("Error loading chat history:", e);
                }
            }
        }
    },
    methods: {
        toggleChat() {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                this.$nextTick(() => {
                    this.scrollToBottom();
                    if (this.$refs.messageInput) {
                        this.$refs.messageInput.focus();
                    }
                });
            }
        },
        closeChat() {
            this.isOpen = false;
        },
        sendMessage() {
            const text = this.inputMessage.trim();
            if (!text || this.isTyping) return;

            // Add user message
            this.messages.push({ role: "user", content: text });
            this.inputMessage = "";
            this.saveHistory();
            this.scrollToBottom();

            // Set typing
            this.isTyping = true;
            this.scrollToBottom();

            // Call Laravel AI Chat API
            this.$axios
                .post(this.route("api.ai.chat"), {
                    message: text,
                    session_id: this.sessionId || undefined,
                })
                .then((res) => {
                    this.isTyping = false;
                    const reply = res.data?.data?.reply || res.data?.reply || "Tôi không nhận được phản hồi từ hệ thống.";
                    const newSessionId = res.data?.data?.session_id || res.data?.session_id;

                    if (newSessionId && newSessionId !== this.sessionId) {
                        this.sessionId = newSessionId;
                        localStorage.setItem("admin-chat-session", newSessionId);
                    }

                    // Add bot message
                    this.messages.push({ role: "assistant", content: reply });
                    this.saveHistory();
                    this.scrollToBottom();
                    
                    this.$nextTick(() => {
                        if (this.$refs.messageInput) {
                            this.$refs.messageInput.focus();
                        }
                    });
                })
                .catch((err) => {
                    this.isTyping = false;
                    console.error("AI Chat error:", err);
                    this.messages.push({
                        role: "assistant",
                        content: "Đã xảy ra lỗi kết nối với trợ lý AI. Vui lòng kiểm tra lại đường truyền mạng hoặc thử lại sau nhé!",
                    });
                    this.saveHistory();
                    this.scrollToBottom();
                });
        },
        saveHistory() {
            if (typeof window !== "undefined") {
                localStorage.setItem("admin-chat-messages", JSON.stringify(this.messages));
            }
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const box = this.$refs.messageBox;
                if (box) {
                    box.scrollTop = box.scrollHeight;
                }
            });
        },
    },
};
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
