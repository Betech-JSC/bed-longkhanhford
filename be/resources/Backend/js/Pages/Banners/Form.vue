<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">Thông tin Banner</div>
                <div class="card-body">                    
                    <Field v-model="form.title" :field="{
                        type: 'text',
                        name: 'title',
                        label: 'Tiêu đề chính',
                    }" />
                    <Field v-model="form.subtitle" :field="{
                        type: 'textarea',
                        name: 'subtitle',
                        label: 'Mô tả',
                        placeholder: 'Nhập mô tả',
                    }" />                    
                    <Field v-model="form.image" :field="{
                        type: 'file_upload',
                        name: 'image',
                        label: 'Ảnh Banner (Desktop)',
                    }" />
                    <Field v-model="form.image_mobile" :field="{
                        type: 'file_upload',
                        name: 'image_mobile',
                        label: 'Ảnh Banner (Mobile)',
                        help: 'Tỷ lệ khuyên dùng: 9:16 hoặc 1:1 • Nếu để trống sẽ dùng ảnh Desktop',
                    }" />
                    <Field v-model="form.video" :field="{
                        type: 'file_upload',
                        name: 'video',
                        label: 'Video Banner (File)',
                        help: 'Hỗ trợ định dạng video (mp4, mov...). Nếu có video sẽ ưu tiên hiển thị thay vì ảnh.',
                    }" />
                    <Field v-model="form.button_text" :field="{
                        type: 'text',
                        name: 'button_text',
                        label: 'Text nút CTA',
                        placeholder: 'vd: CHINH PHỤC TÔI ĐÂY',
                    }" />
                    <Field v-model="form.button_link" :field="{
                        type: 'text',
                        name: 'button_link',
                        label: 'Link nút CTA',
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
                    <Field v-model="form.location" :field="{
                        type: 'select_multiple',
                        name: 'location',
                        label: 'Vị trí hiển thị',
                        options: [
                            { id: 'homepage', label: 'Trang chủ - Hero slider' },
                            { id: 'homepage_edu', label: 'Trang chủ - Banner giới thiệu' },
                            { id: 'homepage_hero', label: 'Trang chủ - Banner quảng cáo' },
                            { id: 'about', label: 'Trang về chúng tôi' },
                            { id: 'contact', label: 'Trang liên hệ' },
                            { id: 'news', label: 'Trang tin tức' },
                            { id: 'products', label: 'Trang sản phẩm - Banner danh mục' },
                            { id: 'courses', label: 'Trang khóa học (legacy)' },
                        ],
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
                location: [],
                video: '',
                ...this.item,
            },
        }
    },
    watch: {
        item() {
            this.formData = { status: 'ACTIVE', sort_order: 0, location: [], video: '', ...this.item }
        },
    },
}
</script>
