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
                            name: `name_${currentTab}`,
                            label: 'Họ và tên',
                            placeholder: 'vd: Đinh Thị Bích Ly',
                        }"
                    />

                    <!-- Chức danh -->
                    <Field
                        v-model="form[currentTab].job_title"
                        :field="{
                            type: 'text',
                            name: `job_title_${currentTab}`,
                            label: 'Chức danh',
                            placeholder: 'vd: Cố vấn bán hàng / Cố vấn dịch vụ',
                        }"
                    />

                    <!-- Tiểu sử ngắn -->
                    <Field
                        v-model="form[currentTab].short_bio"
                        :field="{
                            type: 'textarea',
                            name: `short_bio_${currentTab}`,
                            label: 'Giới thiệu ngắn',
                        }"
                    />

                    <!-- Tiểu sử đầy đủ -->
                    <Field
                        v-model="form[currentTab].bio"
                        :field="{
                            type: 'richtext',
                            name: `bio_${currentTab}`,
                            label: 'Thông tin chi tiết / Giới thiệu bản thân',
                        }"
                    />
                </div>
            </div>

            <!-- Gallery -->
            <div class="card mt-4">
                <div class="card-header">Thư viện ảnh hoạt động</div>
                <div class="card-body">
                    <div
                        v-for="(item, index) in form.gallery"
                        :key="index"
                        class="border rounded p-3 mb-3 bg-gray-50"
                    >
                        <div class="flex justify-between items-center mb-2">
                            <strong>Ảnh {{ index + 1 }}</strong>
                            <button
                                type="button"
                                class="text-red-500 text-sm font-semibold hover:underline"
                                @click="removeGalleryItem(index)"
                            >Xoá</button>
                        </div>
                        <Field
                            v-model="form.gallery[index].image"
                            :field="{
                                type: 'file_upload',
                                name: 'gallery_image_' + index,
                                label: 'Ảnh',
                            }"
                        />
                        <Field
                            v-model="form.gallery[index].caption"
                            :field="{
                                type: 'text',
                                name: 'gallery_caption_' + index,
                                label: 'Mô tả ảnh (tuỳ chọn)',
                            }"
                        />
                    </div>
                    <button
                        type="button"
                        class="btn btn-outline-primary btn-sm"
                        @click="addGalleryItem"
                    >+ Thêm ảnh gallery</button>
                </div>
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
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
export default {
    props: ['item', 'schema'],

    data() {
        return {
            currentTab: this.getCurrentLocale?.() ?? 'vi',
            formData: this.initFormData(this.item),
        }
    },

    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
    },

    methods: {
        initFormData(item) {
            const data = {
                status: 'ACTIVE',
                sort_order: 0,
                gallery: [],
                department: 'sales',
                phone: '',
                zalo_url: '',
                facebook_url: '',
                cover_image: null,
                ...item,
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

        addGalleryItem() {
            if (!this.formData.gallery) this.formData.gallery = []
            this.formData.gallery.push({ image: null, caption: '' })
        },

        removeGalleryItem(index) {
            this.formData.gallery.splice(index, 1)
        },
    },
}
</script>
