<template layout>

    <Head :title="tt('models.titles.setting')" />
    <WrapSetting>
        <Form v-model="formData" :config="{ canDestroy: false, reverse: true, addGrid: false, resource: 'settings' }">
            <template #default="{ form }">
                <div class="card">
                    <div class="card-body">
                        <Field v-model="form.general_business_name" :field="{
                            name: 'general_business_name',
                        }" />
                        <Field v-model="form.general_site_name" :field="{
                            name: 'general_site_name',
                        }" />
                        <Field v-model="form.general_email" :field="{
                            name: 'general_email',
                        }" />
                        <Field v-model="form.general_phone" :field="{
                            name: 'general_phone',
                            label: 'Phone',
                        }" />
                        <Field v-model="form.general_fb_link" :field="{
                            name: 'general_fb_link',
                            label: 'Fb Link',
                        }" />
                        <Field v-model="form.general_message_fb_link" :field="{
                            name: 'general_message_fb_link',
                            label: 'Fb Message Link',
                        }" />
                        <Field v-model="form.general_instagram_link" :field="{
                            name: 'general_instagram_link',
                            label: 'Instagram Link',
                        }" />
                        <Field v-model="form.general_youtube_link" :field="{
                            name: 'general_youtube_link',
                            label: 'Youtube Link',
                        }" />
                        <Field v-model="form.general_linkedin_link" :field="{
                            name: 'general_linkedin_link',
                            label: 'Linkedin Link',
                        }" />
                        <Field v-model="form.general_zalo_link" :field="{
                            name: 'general_zalo_link',
                            label: 'Zalo Link',
                        }" />
                        <Field v-model="form.general_twitter_link" :field="{
                            name: 'general_twitter_link',
                            label: 'Twitter Link',
                        }" />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">{{ tt('Block giới thiệu trang chủ') }}</div>
                    <div class="card-body">
                        <Field v-model="form.homepage_introduce_title" :field="{
                            name: 'homepage_introduce_title',
                            label: 'Tiêu đề',
                        }" />
                        <Field v-model="form.homepage_introduce_description" :field="{
                            name: 'homepage_introduce_description',
                            label: 'Mô tả',
                            type: 'textarea',
                        }" />
                        <Field v-model="form.homepage_introduce_image" :field="{
                            name: 'homepage_introduce_image',
                            label: 'Hình ảnh',
                            type: 'file_upload',
                            accept: 'image/*',
                        }" />
                        <Field v-model="form.homepage_introduce_video" :field="{
                            name: 'homepage_introduce_video',
                            label: 'Video (File)',
                            type: 'file_upload',
                            accept: 'video/*',
                            help: 'Nếu có video sẽ ưu tiên hiển thị thay vì hình ảnh',
                        }" />
                    </div>
                </div>

                <SeoFields :modelValue="form" @update:modelValue="form = $event" :config="{
                    hiddenFields: ['seo_slug'],
                }" />
                <Field class="hidden" disabled v-model="form.id" :field="{ default: 'general' }" />
            </template>
        </Form>
    </WrapSetting>
</template>
<script>
import WrapSetting from '@Core/Components/WrapSetting.vue'
export default {
    components: { WrapSetting },
    props: ['item', 'schema'],
    data() {
        return {
            formData: {
                homepage_introduce_video: null,
                ...this.item
            },
        }
    },
}
</script>
