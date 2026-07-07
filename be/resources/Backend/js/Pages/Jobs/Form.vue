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
                    <!-- ===== Thông tin chung ===== -->
                    <p class="text-sm font-semibold text-gray-500 uppercase mb-3">{{ tt('models.setting.general_information') }}</p>

                    <!-- Tiêu đề -->
                    <Field
                        v-model="form[currentTab].title"
                        :field="{
                            type: 'text',
                            name: `title_${currentTab}`,
                            label: 'Tiêu đề',
                        }"
                    />

                    <!-- URL preview (chỉ hiện khi edit) -->
                    <small v-if="form.id" class="block mb-4">
                        <span v-for="(item, locale) in form.url" :key="locale">
                            {{ locale }}: <a :href="item" target="_blank" class="link">{{ decodeURI(item) }}</a><br />
                        </span>
                    </small>

                    <!-- Nội dung -->
                    <Field
                        v-model="form[currentTab].content"
                        :field="{
                            type: 'richtext',
                            name: `content_${currentTab}`,
                            label: 'Nội dung',
                        }"
                    />
                </div>
            </div>

            <!-- ===== SEO ===== -->
            <SeoFields :modelValue="form[currentTab]" @update:modelValue="form[currentTab] = $event" />

        </template>

        <template #aside="{ form }">
            <!-- Trạng thái & ngày -->
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
                        v-model="form.published_at"
                        :field="{
                            type: 'date',
                            name: 'published_at',
                            label: 'Ngày đăng',
                        }"
                    />
                    <Field
                        v-model="form.expected_time"
                        :field="{
                            type: 'date',
                            name: 'expected_time',
                            label: 'Hạn nộp hồ sơ',
                        }"
                    />
                </div>
            </div>

            <!-- Chi tiết vị trí (dịch theo locale) -->
            <div class="card mt-4">
                <div class="card-header">Chi tiết vị trí</div>
                <div class="card-body">
                    <Field
                        v-model="form[currentTab].working_time"
                        :field="{
                            type: 'text',
                            name: `working_time_${currentTab}`,
                            label: 'Hình thức làm việc',
                        }"
                    />
                    <Field
                        v-model="form[currentTab].work_address"
                        :field="{
                            type: 'text',
                            name: `work_address_${currentTab}`,
                            label: 'Nơi làm việc',
                        }"
                    />
                    <Field
                        v-model="form[currentTab].working_position"
                        :field="{
                            type: 'text',
                            name: `working_position_${currentTab}`,
                            label: 'Vị trí làm việc',
                        }"
                    />
                </div>
            </div>

            <!-- Số lượng & Thứ tự -->
            <div class="card mt-4">
                <div class="card-body">
                    <Field
                        v-model="form.quantity"
                        :field="{
                            type: 'number',
                            name: 'quantity',
                            label: 'Số lượng',
                        }"
                    />
                    <Field
                        v-model="form.position"
                        :field="{
                            type: 'number',
                            name: 'position',
                            label: 'Thứ tự sắp xếp',
                        }"
                    />
                    <Field
                        v-model="form.related_jobs"
                        :field="{
                            type: 'select_multiple',
                            name: 'related_jobs',
                            labelBy: 'title',
                            source: {
                                model: 'JamstackVietnam\\\\Job\\\\Models\\\\Job',
                                method: 'get',
                                only: ['id', 'title'],
                            },
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
                quantity: 1,
                position: 0,
                ...item,
            }
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                data[loc] = {
                    title:            trans ? (trans.title            ?? '') : (loc === 'vi' ? (item.title            ?? '') : ''),
                    slug:             trans ? (trans.slug             ?? '') : (loc === 'vi' ? (item.slug             ?? '') : ''),
                    content:          trans ? (trans.content          ?? '') : (loc === 'vi' ? (item.content          ?? '') : ''),
                    working_position: trans ? (trans.working_position ?? '') : (loc === 'vi' ? (item.working_position ?? '') : ''),
                    work_address:     trans ? (trans.work_address     ?? '') : (loc === 'vi' ? (item.work_address     ?? '') : ''),
                    working_time:     trans ? (trans.working_time     ?? '') : (loc === 'vi' ? (item.working_time     ?? '') : ''),
                    // SEO fields
                    seo_meta_title:       trans ? (trans.seo_meta_title       ?? '') : '',
                    seo_slug:             trans ? (trans.seo_slug             ?? '') : '',
                    seo_meta_description: trans ? (trans.seo_meta_description ?? '') : '',
                    seo_meta_keywords:    trans ? (trans.seo_meta_keywords    ?? '') : '',
                    seo_canonical:        trans ? (trans.seo_canonical        ?? '') : '',
                }
            })
            return data
        },
    },
}
</script>
