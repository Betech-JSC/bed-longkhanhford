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

                <!-- Thông tin cơ bản (dịch theo locale) -->
                <div class="card-body mt-4">
                    <p class="text-sm font-semibold text-gray-500 uppercase mb-3">Thông tin phụ kiện</p>

                    <Field v-model="form[currentTab].title" :field="{
                        type: 'text',
                        name: `title_${currentTab}`,
                        label: 'Tên phụ kiện',
                        placeholder: 'vd: Thanh Giá Nóc Ford Everest',
                    }" />
                    <Field v-model="form[currentTab].description" :field="{
                        type: 'richtext',
                        name: `description_${currentTab}`,
                        label: 'Mô tả',
                    }" />
                </div>
            </div>

            <!-- Nội dung chi tiết (dịch theo locale) -->
            <div class="card mt-4">
                <div class="card-header">Nội dung chi tiết</div>
                <div class="card-body">
                    <Field v-model="form[currentTab].compatibility_text" :field="{
                        type: 'textarea',
                        name: `compatibility_text_${currentTab}`,
                        label: 'Tương thích (xe phù hợp)',
                        placeholder: 'Nội dung mô tả tính tương thích với các dòng xe...',
                    }" />
                    <Field v-model="form[currentTab].safety_text" :field="{
                        type: 'textarea',
                        name: `safety_text_${currentTab}`,
                        label: 'Thông tin an toàn',
                        placeholder: 'Hướng dẫn an toàn khi sử dụng...',
                    }" />
                    <Field v-model="form[currentTab].product_desc_text" :field="{
                        type: 'richtext',
                        name: `product_desc_text_${currentTab}`,
                        label: 'Mô tả sản phẩm chi tiết',
                    }" />
                </div>
            </div>

            <!-- Ảnh & Thư viện ảnh -->
            <div class="card mt-4">
                <div class="card-header">Hình ảnh & Thư viện ảnh</div>
                <div class="card-body">
                    <Field v-model="form.image" :field="{
                        type: 'file_upload',
                        name: 'image',
                        label: 'Ảnh đại diện (Thumbnail danh sách)',
                    }" />
                    <Field v-model="form.images" :field="{
                        type: 'file_upload',
                        name: 'images',
                        label: 'Thư viện ảnh chi tiết',
                        multiple: true,
                    }" />
                    <Field v-model="form.brochure_url" :field="{
                        type: 'text',
                        name: 'brochure_url',
                        label: 'Đường dẫn tài liệu / PDF (Link liên kết ngoài)',
                        placeholder: 'vd: https://domain.com/catalog.pdf',
                    }" />
                    <Field v-model="form.brochure_file" :field="{
                        type: 'file_upload',
                        name: 'brochure_file',
                        label: 'Tải lên file tài liệu / PDF (PDF)',
                        accept: 'application/pdf',
                    }" />
                </div>
            </div>

            <!-- Dòng xe tương thích (Many-to-Many Select) -->
            <div class="card mt-4">
                <div class="card-header">Dòng xe tương thích</div>
                <div class="card-body">
                    <Field v-model="form.vehicles" :field="{
                        type: 'select_multiple',
                        name: 'vehicles',
                        label: false,
                        labelBy: 'title',
                        source: {
                            model: 'App\\Models\\Vehicle\\Vehicle',
                            method: 'get',
                            only: ['id', 'title'],
                        },
                    }" />
                </div>
            </div>

            <!-- Tính năng nổi bật (Dynamic List) -->
            <div class="card mt-4">
                <div class="card-header">Tính năng nổi bật</div>
                <div class="card-body">
                    <div v-for="(feature, index) in form.features" :key="index" class="flex gap-2 items-center mb-2">
                        <Field v-model="form.features[index]" :field="{
                            type: 'text',
                            name: 'feature_' + index,
                            label: false,
                            placeholder: 'vd: Chất liệu cao cấp, Chống nước...',
                        }" class="flex-1" />
                        <button type="button" class="text-red-500 text-sm font-semibold hover:underline shrink-0" @click="removeFeature(index)">✕</button>
                    </div>
                    <div v-if="!form.features || form.features.length === 0" class="text-sm text-gray-400 italic mb-3">
                        Chưa có tính năng nào
                    </div>
                    <button type="button" class="btn btn-secondary btn-sm" @click="addFeature">
                        + Thêm tính năng
                    </button>
                </div>
            </div>

            <!-- SEO Settings -->
            <SeoFields :modelValue="form[currentTab]" @update:modelValue="form[currentTab] = $event" />

        </template>

        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field v-model="form.categories" :field="{
                        type: 'select_multiple',
                        name: 'categories',
                        label: 'Danh mục phụ kiện',
                        labelBy: 'title',
                        source: {
                            model: 'App\\Models\\Vehicle\\AccessoryCategory',
                            method: 'get',
                            only: ['id', 'title'],
                        },
                    }" />

                    <Field v-model="form.brand_id" :field="{
                        type: 'select_single',
                        name: 'brand_id',
                        label: 'Thương hiệu sản xuất',
                        labelBy: 'title',
                        source: {
                            model: 'App\\Models\\Brand\\Brand',
                            method: 'get',
                            only: ['id', 'title'],
                        },
                    }" />

                    <Field v-model="form.code" :field="{
                        type: 'text',
                        name: 'code',
                        label: 'Mã sản phẩm',
                        placeholder: 'vd: EXTS-301',
                    }" />

                    <Field v-model="form.price" :field="{
                        type: 'money',
                        name: 'price',
                        label: 'Giá (đ)',
                    }" />

                    <Field v-model="form.status" :field="{
                        type: 'radio_list',
                        name: 'status',
                        label: 'Trạng thái',
                        options: schema.columns.status.list,
                    }" />

                    <Field v-model="form.sort_order" :field="{
                        type: 'number',
                        name: 'sort_order',
                        label: 'Thứ tự hiển thị',
                    }" />
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
export default {
    props: ['item', 'schema', 'data'],

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
                price: 0,
                code: '',
                brand_id: item.brand_id ? item.brand_id.toString() : null,
                categories: [],
                image: null,
                images: [],
                fit_vehicles: [],
                vehicles: [],
                features: [],
                brochure_url: '',
                brochure_file: null,
                ...item,
            }

            // Ensure arrays
            if (!Array.isArray(data.fit_vehicles)) data.fit_vehicles = []
            if (!Array.isArray(data.vehicles)) data.vehicles = []
            if (!Array.isArray(data.features)) data.features = []
            if (!Array.isArray(data.images)) data.images = []

            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                const fallback = loc === 'vi' ? item : {}
                data[loc] = {
                    title:              trans?.title              ?? fallback.title              ?? '',
                    slug:               trans?.slug               ?? fallback.slug               ?? '',
                    description:        trans?.description        ?? fallback.description        ?? '',
                    compatibility_text: trans?.compatibility_text ?? fallback.compatibility_text ?? '',
                    safety_text:        trans?.safety_text        ?? fallback.safety_text        ?? '',
                    product_desc_text:  trans?.product_desc_text  ?? fallback.product_desc_text  ?? '',
                    // SEO fields
                    seo_meta_title:       trans?.seo_meta_title       ?? '',
                    seo_slug:             trans?.seo_slug             ?? '',
                    seo_meta_description: trans?.seo_meta_description ?? '',
                    seo_meta_keywords:    trans?.seo_meta_keywords    ?? '',
                    seo_meta_robots:      trans?.seo_meta_robots      ?? '',
                    seo_canonical:        trans?.seo_canonical        ?? '',
                    seo_image:            trans?.seo_image            ?? '',
                    seo_schemas:          trans?.seo_schemas          ?? '',
                }
            })
            return data
        },

        addFitVehicle() {
            if (!this.formData.fit_vehicles) this.formData.fit_vehicles = []
            this.formData.fit_vehicles.push('')
        },

        removeFitVehicle(index) {
            if (this.formData.fit_vehicles) {
                this.formData.fit_vehicles.splice(index, 1)
            }
        },

        addFeature() {
            if (!this.formData.features) this.formData.features = []
            this.formData.features.push('')
        },

        removeFeature(index) {
            if (this.formData.features) {
                this.formData.features.splice(index, 1)
            }
        },
    },
}
</script>
