<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">Thông tin đối tác</div>
                <div class="card-body">

                    <Field
                        v-model="form.name"
                        :field="{
                            type: 'text',
                            name: 'name',
                            label: 'Tên đối tác',
                            placeholder: 'vd: Ngân hàng VIB, Bảo hiểm Bảo Việt',
                        }"
                    />

                    <Field
                        v-model="form.logo"
                        :field="{
                            type: 'file_upload',
                            name: 'logo',
                            label: 'Logo',
                        }"
                    />

                    <Field
                        v-model="form.link"
                        :field="{
                            type: 'text',
                            name: 'link',
                            label: 'Link website',
                            placeholder: 'https://...',
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
            formData: {
                status: 'ACTIVE',
                sort_order: 0,
                ...this.item,
            },
        }
    },
    watch: {
        item() {
            this.formData = {
                status: 'ACTIVE',
                sort_order: 0,
                ...this.item,
            }
        },
    },
}
</script>
