<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header border-b-0 pb-0">
                    <ul class="flex border-b">
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'vi' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'vi'">Tiếng Việt</a>
                        </li>
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'en' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'en'">English</a>
                        </li>
                    </ul>
                </div>
                <div class="card-body mt-4">
                    <Field
                        v-model="form[currentTab].title"
                        :field="{
                            type: 'text',
                            name: `title_${currentTab}`,
                            label: 'Tiêu đề dịch vụ',
                        }"
                    />
                    <small v-if="form.id">
                        <span v-for="(item, locale) in form.url" :key="locale">
                            {{ locale }}: <a :href="item" target="_blank" class="link">{{ decodeURI(item) }}</a><br />
                        </span>
                    </small>
                    <Field
                        v-model="form[currentTab].description"
                        :field="{
                            type: 'textarea',
                            name: `description_${currentTab}`,
                            label: 'Mô tả ngắn',
                        }"
                    />
                    <Field
                        v-model="form[currentTab].content"
                        :field="{
                            type: 'richtext',
                            name: `content_${currentTab}`,
                            label: 'Nội dung chi tiết',
                        }"
                    />
                    <Field
                        v-model="form.custom_link"
                        :field="{
                            type: 'text',
                            name: 'custom_link',
                            label: 'Liên kết ngoài / Tùy chỉnh (vd: /san-pham hoặc /lien-he?reason=...). Để trống nếu dùng trang chi tiết mặc định.',
                        }"
                    />
                </div>
            </div>

            <!-- Cấu hình Tabs nội dung -->
            <div class="card mt-4">
                <div class="card-header font-bold text-gray-700">Cấu hình nội dung phân theo Tabs ({{ currentTab === 'vi' ? 'Tiếng Việt' : 'English' }})</div>
                <div class="card-body space-y-4">
                    <Field
                        v-model="form.is_content_by_tab"
                        :field="{
                            type: 'radio_list',
                            name: 'is_content_by_tab',
                            label: 'Hiển thị nội dung chi tiết theo Tabs',
                            options: [
                                { id: true, label: 'Bật' },
                                { id: false, label: 'Tắt' },
                            ]
                        }"
                    />
                    
                    <div v-if="form.is_content_by_tab" class="space-y-4 mt-4">
                        <div v-for="(tab, index) in form[currentTab].content_by_tab" :key="index" class="border rounded-xl p-4 bg-gray-50 border-gray-200 relative">
                            <button type="button" class="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline" @click="confirmRemoveTabItem(form, index)">✕ Xóa Tab</button>
                            <p class="font-bold text-gray-700 text-sm mb-3">Tab #{{ index + 1 }}</p>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Field v-model="form[currentTab].content_by_tab[index].title" :field="{
                                    type: 'text',
                                    name: `tab_title_${currentTab}_${index}`,
                                    label: 'Tiêu đề Tab',
                                    placeholder: 'vd: Hướng dẫn / Quy trình',
                                }" />
                                <Field v-model="form[currentTab].content_by_tab[index].title_content" :field="{
                                    type: 'text',
                                    name: `tab_title_content_${currentTab}_${index}`,
                                    label: 'Tiêu đề phụ của nội dung',
                                    placeholder: 'vd: Chi tiết các bước thực hiện',
                                }" />
                            </div>
                            <Field v-model="form[currentTab].content_by_tab[index].content" :field="{
                                type: 'richtext',
                                name: `tab_content_${currentTab}_${index}`,
                                label: 'Nội dung Tab',
                            }" />
                        </div>
                        <button type="button" class="btn btn-secondary btn-sm" @click="form[currentTab].content_by_tab.push({ title: '', title_content: '', content: '' })">
                            + Thêm Tab mới
                        </button>
                    </div>
                </div>
            </div>

            <!-- Cấu hình Ưu điểm & Lợi ích -->
            <div class="card mt-4">
                <div class="card-header font-bold text-gray-700">Cấu hình ưu điểm & Lợi ích (Benefits)</div>
                <div class="card-body space-y-4">
                    <Field
                        v-model="form[currentTab].benefit_title"
                        :field="{
                            type: 'text',
                            name: `benefit_title_${currentTab}`,
                            label: 'Tiêu đề phần Lợi ích (' + (currentTab === 'vi' ? 'Tiếng Việt' : 'English') + ')',
                            placeholder: 'vd: Ưu điểm nổi bật',
                        }"
                    />
                    
                    <Field
                        v-model="form.benefit_image"
                        :field="{
                            type: 'file_upload',
                            name: 'benefit_image',
                            label: 'Ảnh minh họa Lợi ích (Dùng chung cho cả 2 ngôn ngữ)',
                            multiple: false,
                        }"
                    />

                    <div class="space-y-4 mt-4">
                        <div v-for="(benefit, index) in form[currentTab].benefits" :key="index" class="border rounded-xl p-4 bg-gray-50 border-gray-200 relative">
                            <button type="button" class="absolute top-2 right-2 text-red-500 text-xs font-semibold hover:underline" @click="confirmRemoveBenefitItem(form, index)">✕ Xóa lợi ích</button>
                            <p class="font-bold text-gray-700 text-sm mb-3">Lợi ích #{{ index + 1 }}</p>
                            
                            <Field v-model="form[currentTab].benefits[index].title" :field="{
                                type: 'text',
                                name: `benefit_item_title_${currentTab}_${index}`,
                                label: 'Tiêu đề ngắn',
                                placeholder: 'vd: Kỹ thuật viên chuyên nghiệp',
                            }" />
                            <Field v-model="form[currentTab].benefits[index].description" :field="{
                                type: 'textarea',
                                name: `benefit_item_desc_${currentTab}_${index}`,
                                label: 'Mô tả chi tiết',
                            }" />
                        </div>
                        <button type="button" class="btn btn-secondary btn-sm" @click="form[currentTab].benefits.push({ title: '', description: '' })">
                            + Thêm Lợi ích mới
                        </button>
                    </div>
                </div>
            </div>

            <!-- Cấu hình bộ ảnh trượt sliders -->
            <div class="card mt-4">
                <div class="card-header font-bold text-gray-700">Bộ sưu tập ảnh trượt (Sliders)</div>
                <div class="card-body">
                    <Field
                        v-model="form.sliders"
                        :field="{
                            type: 'file_upload',
                            name: 'sliders',
                            label: 'Tải lên nhiều ảnh (Dùng chung cho cả 2 ngôn ngữ)',
                            multiple: true,
                        }"
                    />
                </div>
            </div>

            <SeoFields :modelValue="form" :locale="currentTab" @update:modelValue="form = $event" />
        </template>
        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
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
                        v-model="form.position"
                        :field="{
                            type: 'number',
                            name: 'position',
                            label: 'Thứ tự hiển thị',
                        }"
                    />
                    <Field
                        v-model="form.image"
                        :field="{
                            type: 'file_upload',
                            name: 'image',
                            label: 'Ảnh đại diện dịch vụ',
                            multiple: false,
                        }"
                    />
                    <Field
                        v-model="form.banner_image"
                        :field="{
                            type: 'file_upload',
                            name: 'banner_image',
                            label: 'Ảnh Banner chi tiết dịch vụ',
                            multiple: false,
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
            currentTab: 'vi',
            formData: this.initFormData(this.item),
        }
    },
    methods: {
        initFormData(item) {
            const data = {
                status: 'ACTIVE',
                position: 0,
                image: null,
                banner_image: null,
                benefit_image: null,
                sliders: [],
                is_content_by_tab: false,
                custom_link: '',
                ...item,
            }
            data.sliders = data.sliders || []
            
            // Ép kiểu boolean cho is_content_by_tab để tương thích với radio_list
            if (typeof data.is_content_by_tab === 'string') {
                data.is_content_by_tab = data.is_content_by_tab === 'true' || data.is_content_by_tab === '1'
            } else {
                data.is_content_by_tab = !!data.is_content_by_tab
            }
            
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                const fallback = loc === 'vi' ? item : {}
                data[loc] = {
                    title:            trans?.title            ?? fallback.title            ?? '',
                    description:      trans?.description      ?? fallback.description      ?? '',
                    content:          trans?.content          ?? fallback.content          ?? '',
                    benefit_title:    trans?.benefit_title    ?? fallback.benefit_title    ?? '',
                    content_by_tab:   trans?.content_by_tab   ?? fallback.content_by_tab   ?? [],
                    benefits:         trans?.benefits         ?? fallback.benefits         ?? [],
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
        confirmRemoveTabItem(form, index) {
            if (confirm('Bạn có thực sự muốn xoá đối tượng này?')) {
                form[this.currentTab].content_by_tab.splice(index, 1)
            }
        },
        confirmRemoveBenefitItem(form, index) {
            if (confirm('Bạn có thực sự muốn xoá đối tượng này?')) {
                form[this.currentTab].benefits.splice(index, 1)
            }
        },
    },
    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
    },
}
</script>
