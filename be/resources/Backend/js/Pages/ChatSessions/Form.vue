<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <!-- Lead Extracted Information Card -->
            <div class="card mb-6">
                <div class="card-header flex items-center justify-between">
                    <span>Thông tin Lead khai thác</span>
                    <span 
                        v-if="form.lead_score === 'hot'" 
                        class="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded uppercase"
                    >
                        🔥 HOT LEAD
                    </span>
                </div>
                <div class="card-body grid grid-cols-2 gap-4">
                    <div>
                        <div class="text-xs text-gray-500 font-semibold mb-1">Họ và tên khách hàng</div>
                        <div class="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                            {{ form.contact_info?.name || '—' }}
                        </div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-500 font-semibold mb-1">Số điện thoại</div>
                        <div class="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                            {{ form.contact_info?.phone || '—' }}
                        </div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-500 font-semibold mb-1">Email</div>
                        <div class="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                            {{ form.contact_info?.email || '—' }}
                        </div>
                    </div>
                    <div>
                        <div class="text-xs text-gray-500 font-semibold mb-1">Dòng xe quan tâm</div>
                        <div class="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                            {{ form.interested_vehicle || '—' }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Interactive Form Submission Details -->
            <div v-if="formData.contact_info?.type" class="card mb-6 border-blue-200">
                <div class="card-header bg-blue-50 text-blue-900 flex items-center justify-between py-2 px-4">
                    <span class="font-bold flex items-center text-sm">
                        <svg class="w-4 h-4 mr-1.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Thông tin đăng ký qua Form Tương tác
                    </span>
                    <span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {{ getFormTypeLabel(formData.contact_info.type) }}
                    </span>
                </div>
                <div class="card-body grid grid-cols-2 gap-4">
                    <div v-if="formData.contact_info.type === 'service_booking'">
                        <div class="text-xs text-gray-500 font-semibold mb-1">Biển số xe</div>
                        <div class="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                            {{ formData.contact_info.license_plate || '—' }}
                        </div>
                    </div>
                    <div v-if="formData.contact_info.type === 'service_booking'">
                        <div class="text-xs text-gray-500 font-semibold mb-1">Dòng xe bảo dưỡng</div>
                        <div class="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                            {{ formData.contact_info.vehicle || '—' }}
                        </div>
                    </div>
                    <div v-if="formData.contact_info.type === 'service_booking'">
                        <div class="text-xs text-gray-500 font-semibold mb-1">Ngày hẹn</div>
                        <div class="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                            {{ formData.contact_info.date ? formatDate(formData.contact_info.date) : '—' }}
                        </div>
                    </div>
                    <div v-if="formData.contact_info.type === 'service_booking'">
                        <div class="text-xs text-gray-500 font-semibold mb-1">Giờ hẹn</div>
                        <div class="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                            {{ formData.contact_info.time || '—' }}
                        </div>
                    </div>
                    
                    <!-- For lead drive / quote / callback -->
                    <div v-if="formData.contact_info.type !== 'service_booking' && formData.contact_info.vehicle">
                        <div class="text-xs text-gray-500 font-semibold mb-1">Dòng xe đăng ký</div>
                        <div class="text-sm font-medium text-gray-900 bg-gray-50 p-2.5 rounded border border-gray-100">
                            {{ formData.contact_info.vehicle }}
                        </div>
                    </div>
                    <div v-if="formData.contact_info.type !== 'service_booking'">
                        <div class="text-xs text-gray-500 font-semibold mb-1">Hình thức đăng ký</div>
                        <div class="text-sm font-medium text-blue-900 bg-blue-50/50 p-2.5 rounded border border-blue-100/30">
                            {{ getFormTypeLabel(formData.contact_info.type) }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chat History Thread -->
            <div class="card">
                <div class="card-header">Lịch sử hội thoại</div>
                <div class="card-body bg-gray-50 rounded-b-lg max-h-[500px] overflow-y-auto p-4 space-y-4">
                    <template v-if="form.messages && form.messages.length">
                        <div 
                            v-for="(msg, idx) in form.messages" 
                            :key="idx"
                            :class="['flex gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start']"
                        >
                            <div :class="['max-w-[80%] rounded-lg p-3 shadow-sm text-sm border', 
                                msg.role === 'user' 
                                    ? 'bg-blue-600 text-white border-blue-700' 
                                    : 'bg-white text-gray-800 border-gray-200'
                            ]">
                                <div class="text-[10px] opacity-75 mb-1 font-bold">
                                    {{ msg.role === 'user' ? 'Khách hàng' : 'Trợ lý AI' }} • {{ formatTime(msg.timestamp) }}
                                </div>
                                <div class="whitespace-pre-line leading-relaxed" v-html="formatContent(msg.content)"></div>
                            </div>
                        </div>
                    </template>
                    <div v-else class="text-center py-8 text-gray-400">
                        Chưa có lịch sử hội thoại
                    </div>
                </div>
            </div>
        </template>

        <template #aside="{ form }">
            <!-- Metadata & Actions -->
            <div class="card">
                <div class="card-header">Phân loại & Trạng thái</div>
                <div class="card-body space-y-4">
                    <Field
                        v-model="form.lead_score"
                        :field="{
                            type: 'radio_list',
                            name: 'lead_score',
                            label: 'Phân loại Lead',
                            options: [
                                { id: 'hot', label: '🔥 Nóng (Hot Lead)' },
                                { id: 'warm', label: '⚡ Ấm (Warm)' },
                                { id: 'cold', label: '❄️ Lạnh (Cold)' }
                            ]
                        }"
                    />

                    <Field
                        v-model="form.notified"
                        :field="{
                            type: 'checkbox',
                            name: 'notified',
                            label: 'Đã báo Telegram cho Sale',
                        }"
                    />

                    <hr class="border-gray-200 my-4" />

                    <div>
                        <div class="text-xs text-gray-500 font-semibold mb-1">IP Address</div>
                        <div class="text-sm font-medium text-gray-700">{{ form.ip_address || 'N/A' }}</div>
                    </div>

                    <div>
                        <div class="text-xs text-gray-500 font-semibold mb-1">User Agent</div>
                        <div class="text-sm text-gray-600 break-all select-all text-xs">{{ form.user_agent || 'N/A' }}</div>
                    </div>

                    <div>
                        <div class="text-xs text-gray-500 font-semibold mb-1">Bắt đầu lúc</div>
                        <div class="text-sm font-medium text-gray-700">{{ form.formatted_created_at }}</div>
                    </div>
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
import dayjs from 'dayjs';

export default {
    props: ['item', 'schema'],
    data() {
        return {
            formData: {
                lead_score: 'cold',
                notified: false,
                ...this.item,
            },
        }
    },
    methods: {
        formatTime(timestamp) {
            if (!timestamp) return '';
            return dayjs(timestamp).format('HH:mm DD/MM/YYYY');
        },
        formatContent(content) {
            if (!content) return '';
            return content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/• (.*?)(?=\n|$)/g, '<span class="inline-flex gap-1 items-start"><span class="text-blue-500">•</span><span>$1</span></span>');
        },
        getFormTypeLabel(type) {
            const labels = {
                test_drive: 'Đăng ký lái thử',
                quote: 'Yêu cầu báo giá',
                callback: 'Yêu cầu gọi lại',
                service_booking: 'Đặt lịch bảo dưỡng/Sửa chữa'
            };
            return labels[type] || type;
        },
        formatDate(date) {
            if (!date) return '';
            return dayjs(date).format('DD/MM/YYYY');
        }
    }
}
</script>
