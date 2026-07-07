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
                    <Field
                        v-model="form[currentTab].title"
                        :field="{
                            type: 'text',
                            name: `title_${currentTab}`,
                            label: 'Tiêu đề',
                        }"
                    />
                    <Field
                        v-model="form[currentTab].author"
                        :field="{
                            type: 'text',
                            name: `author_${currentTab}`,
                            label: 'YouTube ID / Link',
                        }"
                    />
                    <Field
                        v-model="form[currentTab].description"
                        :field="{
                            type: 'textarea',
                            name: `description_${currentTab}`,
                            label: 'Mô tả',
                        }"
                    />
                </div>
            </div>
        </template>

        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field v-model="form.status" :field="{
                        type: 'radio_list',
                        name: 'status',
                        label: 'Trạng thái',
                        options: schema.columns.status.list,
                    }" />
                    <Field v-model="form.published_at" :field="{
                        type: 'date',
                        name: 'published_at',
                        label: 'Ngày xuất bản',
                    }" />
                    <Field v-model="form.image" :field="{
                        type: 'file_upload',
                        name: 'image',
                        multiple: false,
                    }" />
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
                ...item,
            }
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                data[loc] = {
                    title:       trans ? (trans.title       ?? '') : (loc === 'vi' ? (item.title       ?? '') : ''),
                    slug:        trans ? (trans.slug        ?? '') : (loc === 'vi' ? (item.slug        ?? '') : ''),
                    author:      trans ? (trans.author      ?? '') : (loc === 'vi' ? (item.author      ?? '') : ''),
                    description: trans ? (trans.description ?? '') : (loc === 'vi' ? (item.description ?? '') : ''),
                }
            })
            return data
        },
    },
}
</script>