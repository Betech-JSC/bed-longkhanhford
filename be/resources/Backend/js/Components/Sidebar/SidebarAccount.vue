<template>
    <div class="flex flex-shrink-0 px-5 py-2 bg-gray-800">
        <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
                <Avatar
                    :label="admin && admin.name ? admin.name.charAt(0) : 'JAM'"
                    shape="circle"
                    class="text-white bg-primary"
                />
                <div class="ml-3">
                    <div class="text-sm text-white">
                        {{ admin ? admin.name : "" }}
                    </div>
                    <div
                        @click="showAdminForm = true"
                        class="text-xs text-gray-400 cursor-pointer hover:text-gray-300 hover:underline"
                    >
                        {{ tt('models.admins.change_password') }}
                    </div>

                    <Form
                        v-model="adminForm"
                        v-slot="{ form }"
                        class="card"
                        :config="{
                            resource: 'admins',
                            showActions: false,
                            showFlashMessages: false,
                            addGrid: false,
                        }"
                    >
                        <Dialog
                            :header="tt('models.admins.update_information')"
                            v-model:visible="showAdminForm"
                            :breakpoints="{
                                '960px': '75vw',
                                '640px': '90vw',
                            }"
                            :style="{ width: '50vw' }"
                            :draggable="false"
                        >
                            <Field
                                v-model="adminForm.name"
                                :field="{
                                    type: 'text',
                                    name: 'name',
                                }"
                            />
                            <div class="mt-6 field-row">
                                <Field
                                    v-model="form.password"
                                    :field="{
                                        type: 'password',
                                        name: 'password',
                                    }"
                                />
                                <Field
                                    v-model="form.password_confirmation"
                                    :field="{
                                        type: 'password',
                                        name: 'password_confirmation',
                                    }"
                                />
                            </div>
                            <template #footer>
                                <Button
                                    :label="tt('models.admins.cancel')"
                                    @click="showAdminForm = false"
                                />
                                <Button
                                    :label="tt('models.admins.save')"
                                    icon="pi pi-check"
                                    @click="submitAdminForm"
                                    class="btn-primary"
                                    autofocus
                                />
                            </template>
                        </Dialog>
                    </Form>
                </div>
            </div>
            <div class="flex items-center gap-1.5">
                <!-- System Notifications Icon -->
                <div class="relative">
                    <button
                        @click="showNotifications = !showNotifications"
                        type="button"
                        class="relative flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all focus:outline-none cursor-pointer"
                        title="Thông báo hệ thống"
                    >
                        <ph-bell-duotone class="w-8 h-8 p-1 text-gray-400 hover:text-white" />
                        <span
                            v-if="unreadCount > 0"
                            class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-gray-800 animate-pulse"
                        >
                            {{ unreadCount }}
                        </span>
                    </button>

                    <!-- Notification Dialog Modal -->
                    <Dialog
                        header="Thông báo hệ thống"
                        v-model:visible="showNotifications"
                        :breakpoints="{
                            '960px': '75vw',
                            '640px': '90vw',
                        }"
                        :style="{ width: '440px' }"
                        :draggable="false"
                    >
                        <!-- Header Tabs & Actions -->
                        <div class="flex items-center justify-between pb-3 mb-3 border-b border-gray-200">
                            <div class="flex items-center gap-2">
                                <button
                                    @click="activeTab = 'all'"
                                    class="px-2.5 py-1 text-xs font-semibold rounded-md transition-colors"
                                    :class="activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
                                >
                                    Tất cả ({{ notifications.length }})
                                </button>
                                <button
                                    @click="activeTab = 'unread'"
                                    class="px-2.5 py-1 text-xs font-semibold rounded-md transition-colors"
                                    :class="activeTab === 'unread' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
                                >
                                    Chưa đọc ({{ unreadCount }})
                                </button>
                            </div>
                            <button
                                v-if="unreadCount > 0"
                                @click="markAllAsRead"
                                class="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
                            >
                                Đánh dấu đã đọc
                            </button>
                        </div>

                        <!-- Notifications List -->
                        <div class="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                            <div
                                v-for="item in filteredNotifications"
                                :key="item.id"
                                @click="handleNotificationClick(item)"
                                class="p-3 rounded-lg border transition-all cursor-pointer flex gap-3 items-start"
                                :class="item.read ? 'bg-gray-50 border-gray-100 opacity-75' : 'bg-blue-50/50 border-blue-100 hover:bg-blue-50'"
                            >
                                <div class="p-2 rounded-full flex-shrink-0 mt-0.5" :class="getBadgeBg(item.type)">
                                    <ph-bell-ringing-duotone v-if="item.type === 'lead'" class="w-4 h-4 text-blue-600" />
                                    <ph-wrench-duotone v-else-if="item.type === 'service'" class="w-4 h-4 text-amber-600" />
                                    <ph-check-circle-duotone v-else class="w-4 h-4 text-emerald-600" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between gap-2 mb-0.5">
                                        <h5 class="text-xs font-bold text-gray-900 truncate">{{ item.title }}</h5>
                                        <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ item.time }}</span>
                                    </div>
                                    <p class="text-xs text-gray-600 line-clamp-2 leading-relaxed">{{ item.message }}</p>
                                </div>
                                <span v-if="!item.read" class="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></span>
                            </div>

                            <div v-if="filteredNotifications.length === 0" class="py-8 text-center text-xs text-gray-400">
                                Không có thông báo nào.
                            </div>
                        </div>

                        <template #footer>
                            <Button
                                label="Đóng"
                                @click="showNotifications = false"
                                class="p-button-text p-button-sm"
                            />
                        </template>
                    </Dialog>
                </div>

                <Link
                    class="flex-shrink-0 rounded hover:bg-gray-900/50"
                    method="post"
                    :href="route('admin.logout')"
                    :title="tt('models.admins.logout')"
                >
                    <ph-sign-out-duotone
                        class="w-10 h-10 p-1 text-gray-400 hover:text-white"
                    />
                </Link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["admin"],
    data() {
        return {
            adminForm: this.$inertia.form(this.getEmptyForm()),
            showAdminForm: false,
            showNotifications: false,
            activeTab: 'all',
            notifications: [
                {
                    id: 1,
                    title: "Yêu cầu đăng ký lái thử mới",
                    message: "Khách hàng Nguyễn Văn A vừa gửi yêu cầu đăng ký lái thử xe Ford Everest.",
                    time: "5 phút trước",
                    read: false,
                    type: "lead",
                    url: "/admin/contacts"
                },
                {
                    id: 2,
                    title: "Đơn đặt hẹn dịch vụ bảo dưỡng",
                    message: "Khách hàng Trần Thị B đặt lịch bảo dưỡng xe định kỳ 10,000km.",
                    time: "30 phút trước",
                    read: false,
                    type: "service",
                    url: "/admin/contacts"
                },
                {
                    id: 3,
                    title: "Hệ thống đã sao lưu dữ liệu",
                    message: "Bản sao lưu dữ liệu hệ thống định kỳ đã hoàn tất tự động.",
                    time: "2 giờ trước",
                    read: true,
                    type: "system",
                    url: null
                }
            ]
        };
    },
    computed: {
        unreadCount() {
            return this.notifications.filter(n => !n.read).length;
        },
        filteredNotifications() {
            if (this.activeTab === 'unread') {
                return this.notifications.filter(n => !n.read);
            }
            return this.notifications;
        }
    },
    methods: {
        markAllAsRead() {
            this.notifications.forEach(n => n.read = true);
        },
        handleNotificationClick(item) {
            item.read = true;
            if (item.url) {
                this.showNotifications = false;
                this.$inertia.visit(item.url);
            }
        },
        getBadgeBg(type) {
            if (type === 'lead') return 'bg-blue-100 text-blue-600';
            if (type === 'service') return 'bg-amber-100 text-amber-600';
            return 'bg-emerald-100 text-emerald-600';
        },
        submitAdminForm() {
            this.$axios
                .put(this.route(`admin.admins.changePassword`), this.adminForm)
                .then((res) => {
                    this.adminForm.reset();
                    this.showAdminForm = false;
                    this.$toast.add({
                        severity: "success",
                        summary: this.tt('models.admins.success'),
                        detail: this.tt('models.admins.update_success'),
                        life: 2000,
                    });
                    window.location.href = window.location.href;
                })
                .catch(({ response }) => {
                    this.$toast.add({
                        severity: "error",
                        summary: this.tt('models.admins.error'),
                        detail: response.data.message,
                        life: 2000,
                    });
                });
        },

        getEmptyForm() {
            return {
                id: this.admin?.id,
                name: this.admin?.name,
                password: null,
                password_confirmation: null,
            };
        },
    },
};
</script>
