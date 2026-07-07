<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
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
                    <Field
                        v-model="form[currentTab].title"
                        :field="{
                            type: 'text',
                            name: `title_${currentTab}`,
                            label: 'Tên danh mục phụ kiện',
                            placeholder: 'vd: Phụ Kiện Ngoại Thất',
                        }"
                    />
                </div>
            </div>

            <!-- Trường không dịch (dùng chung) -->
            <div class="card mt-4">
                <div class="card-header">Thông tin chung</div>
                <div class="card-body">
                    <Field
                        v-model="form.image"
                        :field="{
                            type: 'file_upload',
                            name: 'image',
                            label: 'Ảnh danh mục',
                        }"
                    />
                </div>
            </div>

            <!-- SEO Settings -->
            <SeoFields :modelValue="form[currentTab]" @update:modelValue="form[currentTab] = $event" />
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
                        v-model="form.sort_order"
                        :field="{
                            type: 'number',
                            name: 'sort_order',
                            label: 'Thứ tự hiển thị',
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
                image: null,
                ...item,
            }
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                data[loc] = {
                    title: trans ? trans.title : (loc === 'vi' ? (item.title ?? '') : ''),
                    slug:  trans ? trans.slug  : (loc === 'vi' ? (item.slug  ?? '') : ''),
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
    },
}
</script>
