<template layout>
    <Form v-model="formData">
        <template #default="{ form }">

            <!-- ===== LOCALE TABS ===== -->
            <div class="card">
                <div class="card-header border-b-0 pb-0">
                    <ul class="flex border-b">
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'vi' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'vi'">🇻🇳 Tiếng Việt</a>
                        </li>
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'en' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'en'">🇬🇧 English</a>
                        </li>
                    </ul>
                </div>
                <div class="card-body mt-4">

                    <!-- Tên -->
                    <Field
                        v-model="form[currentTab].name"
                        :field="{
                            type: 'text',
                            name: `${currentTab}.name`,
                            label: 'Họ và tên',
                            placeholder: 'vd: Đinh Thị Bích Ly',
                        }"
                    />

                    <!-- Chức danh -->
                    <Field
                        v-model="form[currentTab].job_title"
                        :field="{
                            type: 'text',
                            name: `${currentTab}.job_title`,
                            label: 'Chức danh',
                            placeholder: 'vd: Cố vấn bán hàng / Cố vấn dịch vụ',
                        }"
                    />

                    <!-- Tiểu sử ngắn -->
                    <Field
                        v-model="form[currentTab].short_bio"
                        :field="{
                            type: 'textarea',
                            name: `${currentTab}.short_bio`,
                            label: 'Giới thiệu ngắn',
                        }"
                    />

                    <!-- Tiểu sử đầy đủ -->
                    <Field
                        v-model="form[currentTab].bio"
                        :field="{
                            type: 'richtext',
                            name: `${currentTab}.bio`,
                            label: 'Thông tin chi tiết / Giới thiệu bản thân',
                        }"
                    />
                </div>
            </div>

            <TrackingConfigCard
                :config="form.tracking_config"
                :consultant-name="form[currentTab]?.name || form.vi?.name || ''"
            />

            <!-- Gallery -->
            <div class="card mt-4">
                <div class="card-header font-bold text-gray-900 flex flex-wrap items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span>📸 Kho hình ảnh giao xe / Thư viện ảnh của chính chủ</span>
                        <span class="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                            {{ form.gallery?.length || 0 }} ảnh
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button
                            type="button"
                            class="btn btn-primary btn-sm !py-1 !px-2.5 text-xs flex items-center gap-1 shadow-sm"
                            @click="openGalleryFileManager(form)"
                        >📸 Chọn nhiều ảnh</button>
                        <button
                            type="button"
                            class="btn btn-outline-secondary btn-sm !py-1 !px-2 text-xs"
                            title="Thêm 1 ô trống thủ công"
                            @click="addEmptyGalleryItem(form)"
                        >+ 1 ô</button>
                        <button
                            v-if="form.gallery && form.gallery.length > 0"
                            type="button"
                            class="text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-2.5 py-1 rounded border border-gray-300 transition"
                            @click="isGalleryCollapsed = !isGalleryCollapsed"
                        >
                            {{ isGalleryCollapsed ? '▼ Mở rộng' : '▲ Thu gọn' }}
                        </button>
                    </div>
                </div>
                <div v-show="!isGalleryCollapsed" class="card-body">
                    <p class="text-xs text-gray-500 mb-3">
                        Các hình ảnh tải lên tại đây sẽ hiển thị độc quyền tại mục <strong>Tri ân khách hàng (Bàn giao xe)</strong> trên trang Landing Page của riêng cố vấn này. Khung danh sách có thanh cuộn riêng để không làm dài trang.
                    </p>
                    <div
                        v-if="!form.gallery || form.gallery.length === 0"
                        class="text-center py-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-xs"
                    >
                        Chưa có ảnh giao xe nào. Bấm nút <strong>"📸 Chọn nhiều ảnh"</strong> ở phía trên để tải lên hoặc chọn hàng loạt.
                    </div>
                    <div
                        v-else
                        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto pr-1"
                    >
                        <div
                            v-for="(item, index) in form.gallery"
                            :key="index"
                            class="border border-gray-200 rounded-lg p-2.5 bg-gray-50 flex flex-col justify-between shadow-sm"
                        >
                            <div class="flex justify-between items-center mb-1.5 pb-1 border-b border-gray-200">
                                <span class="text-xs font-bold text-gray-700">Ảnh giao xe #{{ index + 1 }}</span>
                                <button
                                    type="button"
                                    class="text-red-500 text-xs font-semibold hover:underline"
                                    @click="removeGalleryItem(index, form)"
                                >Xoá</button>
                            </div>
                            <div class="gallery-compact-upload">
                                <Field
                                    v-model="form.gallery[index].image"
                                    :field="{
                                        type: 'file_upload',
                                        name: 'gallery_image_' + index,
                                        label: 'Hình ảnh',
                                    }"
                                />
                            </div>
                            <div class="mt-1">
                                <Field
                                    v-model="form.gallery[index].caption"
                                    :field="{
                                        type: 'text',
                                        name: 'gallery_caption_' + index,
                                        label: 'Chú thích ngắn',
                                        placeholder: 'VD: Giao xe Ford Everest...',
                                    }"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <FileManager
                    v-if="showGalleryFileManager"
                    v-model:show="showGalleryFileManager"
                    :multiple="true"
                    @onSelect="onSelectGalleryImages($event, form)"
                />
            </div>
        </template>

        <template #aside="{ form }">
            <!-- Ảnh đại diện -->
            <div class="card">
                <div class="card-body">
                    <Field
                        v-model="form.avatar"
                        :field="{
                            type: 'file_upload',
                            name: 'avatar',
                            label: 'Ảnh chân dung cố vấn (Avatar)',
                        }"
                    />
                </div>
            </div>

            <!-- Ảnh bìa -->
            <div class="card mt-4">
                <div class="card-body">
                    <Field
                        v-model="form.cover_image"
                        :field="{
                            type: 'file_upload',
                            name: 'cover_image',
                            label: 'Ảnh bìa (Cover Image)',
                        }"
                    />
                </div>
            </div>

            <!-- Phân loại & Thứ tự -->
            <div class="card mt-4">
                <div class="card-body">
                    <Field
                        v-model="form.department"
                        :field="{
                            type: 'dropdown',
                            name: 'department',
                            label: 'Phòng ban',
                            options: [
                                { id: 'sales', label: 'Phòng Bán Hàng (Sales)' },
                                { id: 'service', label: 'Phòng Dịch Vụ (Service)' },
                                { id: 'marketing', label: 'Phòng Marketing' },
                                { id: 'technical', label: 'Phòng Kỹ Thuật' },
                                { id: '1', label: 'Phòng 1' },
                                { id: '2', label: 'Phòng 2' },
                                { id: '3', label: 'Phòng 3' },
                            ],
                            emptyLabel: '-- Chọn phòng ban --',
                        }"
                    />

                    <Field
                        v-model="form.status"
                        :field="{
                            type: 'radio_list',
                            name: 'status',
                            label: 'Trạng thái',
                            options: schema.columns.status.list,
                        }"
                    />

                    <Field
                        v-model="form.sort_order"
                        :field="{
                            type: 'number',
                            name: 'sort_order',
                            label: 'Thứ tự hiển thị',
                        }"
                    />
                </div>
            </div>

            <!-- Thông tin liên hệ -->
            <div class="card mt-4">
                <div class="card-header">Thông tin liên hệ</div>
                <div class="card-body">
                    <Field
                        v-model="form.email"
                        :field="{
                            type: 'text',
                            name: 'email',
                            label: 'Email công việc',
                            placeholder: 'vd: example@longkhanhford.com.vn',
                        }"
                    />

                    <Field
                        v-model="form.phone"
                        :field="{
                            type: 'text',
                            name: 'phone',
                            label: 'Số điện thoại',
                            placeholder: 'vd: 0901234567',
                        }"
                    />

                    <Field
                        v-model="form.zalo_url"
                        :field="{
                            type: 'text',
                            name: 'zalo_url',
                            label: 'Đường dẫn Zalo',
                            placeholder: 'vd: https://zalo.me/...',
                        }"
                    />

                    <Field
                        v-model="form.facebook_url"
                        :field="{
                            type: 'text',
                            name: 'facebook_url',
                            label: 'Đường dẫn Facebook',
                            placeholder: 'vd: https://facebook.com/...',
                        }"
                    />

                    <Field
                        v-model="form.fanpage_url"
                        :field="{
                            type: 'text',
                            name: 'fanpage_url',
                            label: 'Đường dẫn Fanpage',
                            placeholder: 'vd: https://facebook.com/fanpage...',
                        }"
                    />

                    <Field
                        v-model="form.custom_domain"
                        :field="{
                            type: 'text',
                            name: 'custom_domain',
                            label: 'Tên miền riêng của Sale (nếu có)',
                            placeholder: 'vd: tuanford.com (không chứa http:// hoặc https://)',
                        }"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
import TrackingConfigCard, { normalizeTrackingConfig } from './TrackingConfigCard.vue'
import FileManager from "@/Components/FileManager.vue"

export default {
    components: { TrackingConfigCard, FileManager },
    props: ['item', 'schema'],

    data() {
        return {
            currentTab: this.getCurrentLocale?.() ?? 'vi',
            isGalleryCollapsed: false,
            showGalleryFileManager: false,
            formData: this.initFormData(this.item),
        }
    },

    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
    },

    methods: {
        initFormData(item = {}) {
            const data = {
                status: 'ACTIVE',
                sort_order: 0,
                gallery: [],
                department: 'sales',
                email: '',
                phone: '',
                zalo_url: '',
                facebook_url: '',
                fanpage_url: '',
                custom_domain: '',
                avatar: null,
                cover_image: null,
                ...item,
            }
            if (!data.department) {
                data.department = 'sales'
            }
            if (!data.status) {
                data.status = 'ACTIVE'
            }
            if (data.sort_order === null || data.sort_order === undefined) {
                data.sort_order = 0
            }
            data.tracking_config = normalizeTrackingConfig(data.tracking_config)
            if (!Array.isArray(data.gallery)) {
                data.gallery = []
            }
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                data[loc] = {
                    name:      trans ? (trans.name      ?? '') : (loc === 'vi' ? (item.name      ?? '') : ''),
                    slug:      trans ? (trans.slug      ?? '') : (loc === 'vi' ? (item.slug      ?? '') : ''),
                    job_title: trans ? (trans.job_title ?? '') : (loc === 'vi' ? (item.job_title ?? '') : ''),
                    short_bio: trans ? (trans.short_bio ?? '') : (loc === 'vi' ? (item.short_bio ?? '') : ''),
                    bio:       trans ? (trans.bio       ?? '') : (loc === 'vi' ? (item.bio       ?? '') : ''),
                }
            })
            return data
        },

        openGalleryFileManager() {
            this.isGalleryCollapsed = false
            this.showGalleryFileManager = true
        },

        addEmptyGalleryItem(form) {
            this.isGalleryCollapsed = false
            const target = form?.gallery ?? this.formData.gallery
            if (target) target.push({ image: null, caption: '' })
        },

        addGalleryItem() {
            this.openGalleryFileManager()
        },

        onSelectGalleryImages(files, form) {
            this.showGalleryFileManager = false
            if (!files || (Array.isArray(files) && files.length === 0)) return
            const list = Array.isArray(files) ? files : [files]
            const target = form?.gallery ?? this.formData.gallery
            if (!target) return
            list.forEach(file => {
                target.push({ image: file, caption: '' })
            })
        },

        removeGalleryItem(index, form) {
            const target = form?.gallery ?? this.formData.gallery
            if (target && target.length > index) {
                target.splice(index, 1)
            }
        },
    },
}
</script>

<style scoped>
.gallery-compact-upload :deep(img) {
    max-height: 110px;
    object-fit: cover;
}
</style>
