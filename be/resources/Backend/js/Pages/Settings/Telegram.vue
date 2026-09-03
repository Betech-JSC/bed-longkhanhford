<template layout>
    <Head :title="tt('Cấu hình Telegram')" />
    <WrapSetting>
        <Form
            v-model="formData"
            v-slot="{ form }"
            :config="{ canDestroy: false, addGrid: false, resource: 'settings' }"
        >
            <div class="card mb-4">
                <div class="card-header flex items-center justify-between">
                    <span>{{ tt('Cấu hình Telegram Bot & Nhóm nhận thông báo') }}</span>
                    <span class="text-xs font-normal text-gray-500">Cảnh báo Hot Lead tức thì cho Sales</span>
                </div>
                <div class="card-body">
                    <Field
                        v-model="form.telegram_enabled"
                        :field="{
                            type: 'checkbox',
                            name: 'telegram_enabled',
                            label: 'Bật tự động gửi thông báo qua Telegram khi có Lead mới',
                            help: 'Khi bật, hệ thống sẽ tự động gửi thông báo Lead từ Website và AI Chatbot vào nhóm Telegram.',
                        }"
                    />
                    <hr class="my-4 border-gray-200" />
                    <Field
                        v-model="form.telegram_bot_token"
                        :field="{
                            type: 'text',
                            name: 'telegram_bot_token',
                            label: 'Telegram Bot Token',
                            placeholder: 'Ví dụ: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz',
                            help: 'Mã API Token được cấp từ @BotFather trên Telegram khi tạo Bot.',
                        }"
                    />
                    <Field
                        v-model="form.telegram_chat_id"
                        :field="{
                            type: 'text',
                            name: 'telegram_chat_id',
                            label: 'Telegram Chat ID / Username kênh',
                            placeholder: 'Ví dụ: -100123456789 (ID nhóm) hoặc ID cá nhân',
                            help: 'ID của nhóm chat Sales hoặc ID người nhận. Không điền tên @bot vào đây.',
                        }"
                    />

                    <!-- Nút lấy Chat ID tự động -->
                    <div class="flex flex-wrap items-center gap-2.5 mb-4 -mt-2">
                        <Button
                            type="button"
                            :icon="isDetecting ? 'pi pi-spin pi-spinner' : 'pi pi-bolt'"
                            :label="isDetecting ? 'Đang tìm ID...' : 'Lấy Chat ID tự động'"
                            class="p-button-sm p-button-warning p-button-outlined whitespace-nowrap"
                            style="padding: 0.35rem 0.75rem; font-size: 0.78rem;"
                            :loading="isDetecting"
                            :disabled="isDetecting || !form.telegram_bot_token"
                            @click="handleDetectChatId(form)"
                        />
                        <span class="text-xs text-gray-400 italic">
                            (Nhắn 1 tin bất kỳ cho bot rồi bấm nút này để hệ thống tự điền ID)
                        </span>
                    </div>

                    <!-- Nút kiểm tra kết nối -->
                    <div class="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-3">
                        <Button
                            type="button"
                            icon="pi pi-send"
                            :label="isTesting ? 'Đang gửi kiểm tra...' : 'Gửi tin nhắn thử nghiệm (Test)'"
                            class="p-button-sm p-button-info p-button-outlined whitespace-nowrap"
                            style="padding: 0.4rem 0.85rem; font-size: 0.8rem;"
                            :loading="isTesting"
                            :disabled="isTesting || !form.telegram_bot_token || !form.telegram_chat_id"
                            @click="handleTestConnection(form)"
                        />
                        <span class="text-xs text-gray-500">
                            Bấm để gửi 1 tin nhắn test thử nghiệm đến nhóm/kênh Telegram của bạn.
                        </span>
                    </div>
                </div>
            </div>

            <!-- Card hướng dẫn sử dụng -->
            <div class="card bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <div class="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-2">
                    <i class="pi pi-info-circle"></i>
                    <span>Hướng dẫn cài đặt nhanh:</span>
                </div>
                <ol class="list-decimal list-inside text-xs text-blue-900 space-y-1.5 leading-relaxed pl-1">
                    <li>
                        <strong>Tạo Bot:</strong> Mở Telegram, tìm bot <code>@BotFather</code> &rarr; gõ <code>/newbot</code>, đặt tên và username cho bot &rarr; copy mã <strong>HTTP API Token</strong> dán vào ô <em>Telegram Bot Token</em> ở trên.
                    </li>
                    <li>
                        <strong>Tạo Nhóm hoặc Kênh:</strong> Tạo nhóm Telegram cho đội ngũ Sales &rarr; <strong>Thêm Bot vừa tạo vào nhóm</strong> (hoặc nếu gửi cá nhân thì bấm <code>START</code> trong khung chat với bot).
                    </li>
                    <li>
                        <strong>Lấy Chat ID:</strong> Thêm bot <code>@userinfobot</code> vào nhóm để xem Chat ID (dạng số âm như <code>-100...</code>), hoặc đặt username cho nhóm dạng <code>@ten_nhom</code> rồi nhập vào ô <em>Telegram Chat ID</em> (hoặc nhắn 1 tin cho bot rồi bấm nút <em>Lấy Chat ID tự động</em>).
                    </li>
                    <li>
                        <strong>Lưu & Kiểm tra:</strong> Bấm <strong>Lưu</strong> ở góc trên &rarr; bấm <strong>Gửi tin nhắn thử nghiệm</strong> để xác nhận bot hoạt động.
                    </li>
                </ol>
            </div>

            <Field
                class="hidden"
                disabled
                v-model="form.id"
                :field="{ default: 'telegram' }"
            />
        </Form>
    </WrapSetting>
</template>

<script>
import WrapSetting from "@Core/Components/WrapSetting.vue";
import axios from "axios";

export default {
    components: { WrapSetting },
    props: ["item", "schema"],
    data() {
        const isEnabled = this.item?.telegram_enabled !== undefined
            ? (this.item.telegram_enabled === true || this.item.telegram_enabled === 1 || this.item.telegram_enabled === '1' || this.item.telegram_enabled === 'true')
            : true;
        return {
            isTesting: false,
            isDetecting: false,
            formData: {
                telegram_bot_token: "",
                telegram_chat_id: "",
                ...this.item,
                telegram_enabled: isEnabled,
            },
        };
    },
    methods: {
        async handleDetectChatId(form) {
            if (!form.telegram_bot_token) {
                this.$toast.add({
                    severity: "warn",
                    summary: "Thiếu Bot Token",
                    detail: "Vui lòng nhập Telegram Bot Token trước khi tìm Chat ID.",
                    life: 3000,
                });
                return;
            }

            this.isDetecting = true;
            try {
                let detectUrl = "/admin/settings/telegram/detect-chat-id";
                try {
                    if (typeof this.route === "function" && this.route().t?.routes && (this.route().t.routes["admin.settings.telegram.detect"] || this.route().t.routes["vi.admin.settings.telegram.detect"])) {
                        detectUrl = this.route("admin.settings.telegram.detect");
                    }
                } catch (e) {}

                const client = this.$axios || axios;
                const response = await client.post(detectUrl, {
                    bot_token: form.telegram_bot_token,
                });

                if (response.data?.success && response.data?.chat_id) {
                    form.telegram_chat_id = response.data.chat_id;
                    this.$toast.add({
                        severity: "success",
                        summary: "Đã tìm thấy!",
                        detail: response.data.message || `Đã tự động điền Chat ID: ${response.data.chat_id}`,
                        life: 5000,
                    });
                } else {
                    this.$toast.add({
                        severity: "warn",
                        summary: "Chưa có tin nhắn mới",
                        detail: response.data?.message || "Vui lòng gửi 1 tin nhắn cho bot trước.",
                        life: 6000,
                    });
                }
            } catch (error) {
                const msg = error.response?.data?.message || error.message || "Không thể tìm Chat ID tự động.";
                this.$toast.add({
                    severity: "warn",
                    summary: "Thông báo",
                    detail: msg,
                    life: 6000,
                });
            } finally {
                this.isDetecting = false;
            }
        },

        async handleTestConnection(form) {
            if (!form.telegram_bot_token) {
                this.$toast.add({
                    severity: "warn",
                    summary: "Thiếu thông tin",
                    detail: "Vui lòng nhập Telegram Bot Token trước.",
                    life: 3000,
                });
                return;
            }
            if (!form.telegram_chat_id) {
                this.$toast.add({
                    severity: "warn",
                    summary: "Thiếu thông tin",
                    detail: "Vui lòng nhập Telegram Chat ID trước.",
                    life: 3000,
                });
                return;
            }

            this.isTesting = true;
            try {
                let testUrl = "/admin/settings/telegram/test";
                try {
                    if (typeof this.route === "function" && this.route().t?.routes && (this.route().t.routes["admin.settings.telegram.test"] || this.route().t.routes["vi.admin.settings.telegram.test"])) {
                        testUrl = this.route("admin.settings.telegram.test");
                    }
                } catch (e) {
                    // use fallback
                }

                const client = this.$axios || axios;
                const response = await client.post(testUrl, {
                    bot_token: form.telegram_bot_token,
                    chat_id: form.telegram_chat_id,
                });

                if (response.data?.success) {
                    this.$toast.add({
                        severity: "success",
                        summary: "Thành công!",
                        detail: response.data.message || "Đã gửi tin nhắn thử nghiệm tới Telegram!",
                        life: 4000,
                    });
                } else {
                    this.$toast.add({
                        severity: "error",
                        summary: "Gửi thất bại",
                        detail: response.data?.message || "Không thể gửi tin nhắn kiểm tra.",
                        life: 5000,
                    });
                }
            } catch (error) {
                const msg = error.response?.data?.message || error.message || "Có lỗi xảy ra khi gọi Telegram API.";
                this.$toast.add({
                    severity: "error",
                    summary: "Lỗi kiểm tra",
                    detail: msg,
                    life: 5000,
                });
            } finally {
                this.isTesting = false;
            }
        },
    },
};
</script>
