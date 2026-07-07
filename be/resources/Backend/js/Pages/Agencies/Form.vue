<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">{{ tt('models.setting.general_information') }}</div>
                <div class="card-body">
                    <Field
                        v-model="form.title"
                        :field="{
                            type: 'text',
                            name: 'title',
                            label: 'Tiêu đề',
                        }"
                    />
                    <Field
                        v-model="form.location"
                        :field="{
                            type: 'text',
                            name: 'location',
                            label: 'Địa chỉ',
                        }"
                    />
                    <Field
                        v-model="form.info.email"
                        :field="{
                            type: 'text',
                            name: 'email',
                            label: 'Email',
                        }"
                    />
                    <Field
                        v-model="form.info.phone"
                        :field="{
                            type: 'text',
                            name: 'phone',
                            label: 'Số điện thoại',
                        }"
                    />
                    <!-- <Field
                        v-model="form.longitude"
                        :field="{
                            type: 'text',
                            name: 'longitude',
                            label: 'Kinh độ',
                        }"
                    />
                    <Field
                        v-model="form.latitude"
                        :field="{
                            type: 'text',
                            name: 'latitude',
                            label: 'Vĩ độ',
                        }"
                    /> -->
                    <Field
                        v-model="form.link_google_map"
                        :field="{
                            type: 'text',
                            name: 'link_google_map',
                            label: 'Link google map',
                        }"
                    />
                    <Field
                        v-model="form.code"
                        :field="{
                            type: 'textarea',
                            name: 'code',
                            label: 'Code',
                        }"
                    />
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
                        v-model="form.region"
                        :field="{
                            type: 'radio_list',
                            name: 'region',
                            label: 'Vùng/ Miền',
                            options: [
                                { id: 'mien_nam', label: 'Miền nam' },
                                { id: 'mien_trung', label: 'Miền trung' },
                                { id: 'mien_bac', label: 'Miền bắc' },
                            ],
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
                </div>
            </div>
        </template>
    </Form>
</template>
<script>
export default {
    props: ['item', 'schema'],
    data() {
        let email = this.item.info?.email ?? null
        let phone = this.item.info?.phone ?? null
        let info = { email, phone }
        return {
            formData: {
                ...this.item,
                info,
                region: this.item.region ?? 'mien_nam',
            },
        }
    },

    watch: {
        item() {
            this.formData = this.item
        },
    },

    methods: {
        transformOptions(options) {
            const keyBy = 'id'
            return options.map((item) => {
                item[keyBy] = item[keyBy].toString()
                return item
            })
        },
    },
}
</script>
