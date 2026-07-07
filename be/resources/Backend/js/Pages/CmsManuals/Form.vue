<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">Thông tin Hướng dẫn</div>
                <div class="card-body">
                    <Field v-model="form.title" :field="{
                        type: 'text',
                        name: 'title',
                        label: 'Tiêu đề hướng dẫn',
                        placeholder: 'vd: Hướng dẫn quản lý dòng xe',
                    }" />
                    <Field v-model="form.slug" :field="{
                        type: 'text',
                        name: 'slug',
                        label: 'Slug (Đường dẫn)',
                        placeholder: 'tự động tạo hoặc điền tay: huong-dan-quan-ly-xe',
                    }" />
                    <Field v-model="form.content" :field="{
                        type: 'richtext',
                        name: 'content',
                        label: 'Nội dung hướng dẫn',
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
        'formData.title'(newVal) {
            if (!this.item.id && newVal) {
                this.formData.slug = this.slugify(newVal);
            }
        }
    },
    methods: {
        slugify(text) {
            return text.toString().toLowerCase()
                .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, 'a')
                .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, 'e')
                .replace(/í|ì|ỉ|ĩ|ị/g, 'i')
                .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, 'o')
                .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, 'u')
                .replace(/ý|ỳ|ỷ|ỹ|ỵ/g, 'y')
                .replace(/đ/g, 'd')
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
        }
    }
}
</script>
