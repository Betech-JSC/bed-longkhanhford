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
                            label: 'Tiêu đề',
                        }"
                    />
                    <small v-if="form.id">
                        <span v-for="(item, locale) in form.url" :key="locale">
                            {{ locale }}:
                            <a :href="item" target="_blank" class="link">{{
                                decodeURI(item)
                            }}</a
                            ><br />
                        </span>
                    </small>
                    <Field
                        v-model="form[currentTab].content"
                        :field="{
                            type: 'richtext',
                            name: `content_${currentTab}`,
                            label: 'Nội dung',
                        }"
                    />
                    <Field
                        v-model="form.icon"
                        :field="{
                            type: 'textarea',
                            name: 'icon',
                            label: 'Icon',
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
                        v-model="form.type"
                        :field="{
                            type: 'radio_list',
                            name: 'type',
                            label: 'Loại chính sách',
                            options: schema.columns.type.list,
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
                        v-model="form.position"
                        :field="{
                            type: 'number',
                            name: 'position',
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
    props: ["item", "schema"],
    data() {
        return {
            currentTab: 'vi',
            formData: this.initFormData(this.item),
        };
    },

    watch: {
        item() {
            this.formData = this.initFormData(this.item);
        }
    },
    
    methods: {
        initFormData(item) {
            let data = { ...item };
            const locales = ['vi', 'en'];
            
            locales.forEach(loc => {
                let trans = null;
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc);
                }
                data[loc] = data[loc] || {};
                data[loc].title = trans ? trans.title : (loc === 'vi' ? item.title : '');
                data[loc].content = trans ? trans.content : (loc === 'vi' ? item.content : '');
            });
            return data;
        }
    }
};
</script>
