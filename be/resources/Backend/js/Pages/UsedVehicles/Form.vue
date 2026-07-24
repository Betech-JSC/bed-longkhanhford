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
                            label: 'Tên xe đã qua sử dụng',
                            placeholder: 'vd: Ford Ranger Wildtrak 2021',
                        }"
                    />
                    <small v-if="form.id">
                        <span v-for="(item, locale) in form.url" :key="locale">
                            {{ locale }}: <a :href="item" target="_blank" class="link">{{ decodeURI(item) }}</a><br />
                        </span>
                    </small>
                    <Field
                        v-model="form[currentTab].tagline"
                        :field="{
                            type: 'text',
                            name: `tagline_${currentTab}`,
                            label: 'Mô tả ngắn/Thông tin nổi bật',
                            placeholder: 'vd: Đi ít 15,000km, xe cá nhân đi kỹ, bao check hãng',
                        }"
                    />
                    <Field
                        v-model="form[currentTab].description"
                        :field="{
                            type: 'richtext',
                            name: `description_${currentTab}`,
                            label: 'Nội dung giới thiệu chi tiết',
                        }"
                    />
                </div>
            </div>

            <!-- Bộ sưu tập hình ảnh thực tế -->
            <div class="card mt-4">
                <div class="card-header font-bold text-gray-700">Bộ sưu tập hình ảnh thực tế</div>
                <div class="card-body">
                    <Field
                        v-model="form.images"
                        :field="{
                            type: 'file_upload',
                            name: 'images',
                            label: 'Tải lên các hình ảnh thực tế (Nhiều ảnh)',
                            multiple: true,
                        }"
                    />
                </div>
            </div>

            <SeoFields :modelValue="form" @update:modelValue="form = $event" />
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
                        v-model="form.price"
                        :field="{
                            type: 'number',
                            name: 'price',
                            label: 'Giá bán (đ)',
                            placeholder: 'vd: 750000000',
                        }"
                    />
                    <Field
                        v-model="form.year"
                        :field="{
                            type: 'number',
                            name: 'year',
                            label: 'Năm sản xuất',
                            placeholder: 'vd: 2021',
                        }"
                    />
                    <Field
                        v-model="form.odo"
                        :field="{
                            type: 'number',
                            name: 'odo',
                            label: 'Số km đã đi (Odo)',
                            placeholder: 'vd: 35000',
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
                    <Field
                        v-model="form.image"
                        :field="{
                            type: 'file_upload',
                            name: 'image',
                            label: 'Ảnh đại diện xe',
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
                sort_order: 0,
                price: 0,
                year: null,
                odo: null,
                image: null,
                images: [],
                ...item,
            }
            data.images = data.images || []

            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                const fallback = loc === 'vi' ? item : {}
                data[loc] = {
                    title:                trans?.title                ?? fallback.title            ?? '',
                    tagline:              trans?.tagline              ?? fallback.tagline          ?? '',
                    description:          trans?.description          ?? fallback.description      ?? '',
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
    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
    },
}
</script>
