<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">{{ tt('models.setting.general_information') }}</div>
                <div class="card-body">
                    <template v-for="(key, field) in form.data_contact" :key="field">
                        <div v-if="typeof form.data_contact[field] !== 'object'">
                            <div v-if="field != 'Job'">
                                <Field
                                    :key="field"
                                    :disabled="true"
                                    :modelValue="form.data_contact[field]"
                                    :field="{
                                        label: field,
                                    }"
                                />
                            </div>
                        </div>
                    </template>
                    <div v-if="form.files.length > 0">
                        <div class="pb-3 text-sm font-medium select-none">File CV:</div>
                        <div v-for="(file, index) in form.files" :key="index">
                            <a target="_blank" :href="baseUrl(file)">
                                {{ baseUrl(file) }}
                            </a>
                        </div>
                    </div>
                    <div v-if="form.job.id">
                        <div class="pb-3 text-sm font-medium select-none">
                            {{ form.job.title }}
                        </div>
                        <div>
                            <a class="btn-primary btn" :href="route('admin.jobs.form', { id: form.job.id })"
                                >Xem tuyển dụng</a
                            >
                        </div>
                    </div>
                </div>
            </div>
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
                        v-model="form.formatted_created_at"
                        :disabled="true"
                        :field="{
                            type: 'text',
                            name: 'formatted_created_at',
                            label: 'Ngày gửi',
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
            formData: {
                ...this.item,
                files: this.item.data['File CV'] ?? [],
                job: {
                    id: this.item.data['Job']['id'] ?? null,
                    title: this.item.data['Job']['title'] ?? null,
                    slug: this.item.data['Job']['slug'] ?? null,
                },
            },
        }
    },
    methods: {
        baseUrl(url) {
            let newUrl = window.location.origin + url
            let date = new Date('2023-04-13')
            let created = new Date(this.item.created_at)

            if (created >= date) {
                newUrl = newUrl.replace('/static/', '/storage/')
            }
            return newUrl
        },
    },
}
</script>
