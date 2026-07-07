<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">Thông tin Giải thưởng</div>
                <div class="card-body">
                    <Field v-model="form.title" :field="{
                        type: 'text',
                        name: 'title',
                        label: 'Tên giải thưởng',
                        placeholder: 'vd: Top 10 doanh nghiệp xuất sắc 2024',
                    }" />
                    <Field v-model="form.description" :field="{
                        type: 'textarea',
                        name: 'description',
                        label: 'Mô tả',
                        placeholder: 'Mô tả ngắn về giải thưởng',
                    }" />
                    <Field v-model="form.image" :field="{
                        type: 'file_upload',
                        name: 'image',
                        label: 'Hình ảnh giải thưởng',
                    }" />
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
                    <Field v-model="form.sort_order" :field="{
                        type: 'number',
                        name: 'sort_order',
                        label: 'Thứ tự hiển thị',
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
            formData: {
                status: 'ACTIVE',
                sort_order: 0,
                ...this.item,
            },
        }
    },
    watch: {
        item() {
            this.formData = { status: 'ACTIVE', sort_order: 0, ...this.item }
        },
    },
}
</script>
