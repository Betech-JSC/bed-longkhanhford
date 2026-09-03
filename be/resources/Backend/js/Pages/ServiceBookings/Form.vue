<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">{{ tt('models.setting.general_information') }}</div>
                <div class="card-body">
                    <template v-for="(val, field) in filteredDataContact" :key="field">
                        <div v-if="typeof val === 'object' && val != null">
                            <div class="pb-3 text-sm font-medium select-none">
                                {{ field }}
                            </div>
                            <div class="pb-4">
                                <pre class="bg-gray-50 p-3 rounded-lg text-xs">{{ JSON.stringify(val, null, 2) }}</pre>
                            </div>
                        </div>
                        <div v-else>
                            <Field
                                :key="field"
                                :disabled="true"
                                :modelValue="val"
                                :field="{
                                    label: field,
                                }"
                            />
                        </div>
                    </template>
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
            formData: this.item,
        }
    },
    computed: {
        filteredDataContact() {
            const raw = this.formData?.data_contact || {};
            const clean = {};
            const aliasMap = {
                'Name': 'Họ và tên',
                'Phone': 'Số điện thoại',
                'Email': 'E-mail',
                'Tại': 'Địa điểm làm dịch vụ',
            };

            for (const [key, value] of Object.entries(raw)) {
                if (aliasMap[key] && raw[aliasMap[key]] !== undefined) {
                    continue;
                }
                clean[key] = value;
            }
            return clean;
        }
    }
}
</script>
