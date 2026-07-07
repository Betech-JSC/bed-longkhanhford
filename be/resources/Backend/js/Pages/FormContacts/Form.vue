<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">{{ tt('models.setting.general_information') }}</div>
                <div class="card-body">
                    <template v-for="(key, field) in form.data_contact" :key="field">
                        <div v-if="typeof form.data_contact[field] === 'object' && form.data_contact[field] != null">
                            <div class="pb-3 text-sm font-medium select-none">
                                {{ field === 'Product' ? 'Sản phẩm: ' + form.data_contact[field]['title'] : form.data_contact[field]['title'] }}
                            </div>
                            <div>
                                <a
                                    v-if="field === 'Service'"
                                    class="btn-primary btn"
                                    :href="route('admin.services.form', { id: form.data_contact[field]['id'] })"
                                    >Xem dịch vụ</a
                                >
                                <a
                                    v-else-if="field === 'Product' && form.data_contact[field]['type'] === 'used_vehicle'"
                                    class="btn-primary btn"
                                    :href="route('admin.used-vehicles.form', { id: form.data_contact[field]['id'] })"
                                    >Xem chi tiết xe cũ</a
                                >
                                <a
                                    v-else-if="field === 'Product' && form.data_contact[field]['type'] === 'accessory'"
                                    class="btn-primary btn"
                                    :href="route('admin.accessories.form', { id: form.data_contact[field]['id'] })"
                                    >Xem chi tiết phụ kiện</a
                                >
                                <a
                                    v-else-if="field === 'Product'"
                                    class="btn-primary btn"
                                    :href="route('admin.vehicles.form', { id: form.data_contact[field]['id'] })"
                                    >Xem chi tiết xe mới</a
                                >
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="field != 'Service'">
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
}
</script>
