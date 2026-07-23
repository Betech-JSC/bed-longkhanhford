<template layout>
    <Head :title="tt('models.titles.setting')" />
    <WrapSetting>
        <Form v-model="formData" :config="{ canDestroy: false, reverse: true, addGrid: false, resource: 'settings' }">
            <template #default="{ form }">
                <div class="card">
                    <div class="card-body">
                        <Field
                            v-model="form.general_business_name"
                            :field="{
                                name: 'general_business_name',
                            }"
                        />
                        <Field
                            v-model="form.general_site_name"
                            :field="{
                                name: 'general_site_name',
                            }"
                        />
                        <Field
                            v-model="form.general_email"
                            :field="{
                                name: 'general_email',
                            }"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Hình ảnh &amp; Logo thương hiệu</div>
                    <div class="card-body">
                        <Field
                            v-model="form.general_logo"
                            :field="{
                                name: 'general_logo',
                                type: 'file_upload',
                                accept: 'image/*',
                            }"
                        />
                        <Field
                            v-model="form.general_logo_footer"
                            :field="{
                                name: 'general_logo_footer',
                                type: 'file_upload',
                                accept: 'image/*',
                            }"
                        />
                        <Field
                            v-model="form.general_favicon"
                            :field="{
                                name: 'general_favicon',
                                type: 'file_upload',
                                accept: 'image/*',
                            }"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Thông tin doanh nghiệp</div>
                    <div class="card-body">
                        <Field
                            v-model="form.general_company_address"
                            :field="{
                                name: 'general_company_address',
                            }"
                        />
                        <Field
                            v-model="form.general_company_phone"
                            :field="{
                                name: 'general_company_phone',
                            }"
                        />
                        <Field
                            v-model="form.general_company_hotline"
                            :field="{
                                name: 'general_company_hotline',
                            }"
                        />
                        <Field
                            v-model="form.general_company_working_hours"
                            :field="{
                                name: 'general_company_working_hours',
                            }"
                        />
                        <Field
                            v-model="form.general_company_tax_code"
                            :field="{
                                name: 'general_company_tax_code',
                            }"
                        />
                        <Field
                            v-model="form.general_company_copyright"
                            :field="{
                                name: 'general_company_copyright',
                            }"
                        />
                        <Field
                            v-model="form.general_company_map_iframe"
                            :field="{
                                name: 'general_company_map_iframe',
                                type: 'textarea',
                                help: 'Dán mã iframe nhúng bản đồ Google Maps vào đây',
                            }"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Mạng xã hội &amp; Liên kết</div>
                    <div class="card-body">
                        <Field
                            v-model="form.social_facebook"
                            :field="{
                                name: 'social_facebook',
                            }"
                        />
                        <Field
                            v-model="form.social_youtube"
                            :field="{
                                name: 'social_youtube',
                            }"
                        />
                        <Field
                            v-model="form.social_zalo"
                            :field="{
                                name: 'social_zalo',
                            }"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">{{ tt('Block giới thiệu trang chủ') }}</div>
                    <div class="card-body">
                        <Field
                            v-model="form.homepage_introduce_title"
                            :field="{
                                name: 'homepage_introduce_title',
                                label: 'Tiêu đề',
                            }"
                        />
                        <Field
                            v-model="form.homepage_introduce_description"
                            :field="{
                                name: 'homepage_introduce_description',
                                label: 'Mô tả',
                                type: 'textarea',
                            }"
                        />
                        <Field
                            v-model="form.homepage_introduce_image"
                            :field="{
                                name: 'homepage_introduce_image',
                                label: 'Hình ảnh',
                                type: 'file_upload',
                                accept: 'image/*',
                            }"
                        />
                        <Field
                            v-model="form.homepage_introduce_video"
                            :field="{
                                name: 'homepage_introduce_video',
                                label: 'Video (File)',
                                type: 'file_upload',
                                accept: 'video/*',
                                help: 'Nếu có video sẽ ưu tiên hiển thị thay vì hình ảnh',
                            }"
                        />
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">Hình ảnh Đội ngũ (Trang giới thiệu)</div>
                    <div class="card-body">
                        <Field
                            v-model="form.about_team_images"
                            :field="{
                                name: 'about_team_images',
                                label: 'Danh sách hình ảnh đội ngũ',
                                type: 'file_upload',
                                multiple: true,
                                accept: 'image/*',
                                help: 'Tải lên danh sách hình ảnh đội ngũ/sự kiện để hiển thị ở trang Giới thiệu',
                            }"
                        />
                    </div>
                </div>

                <SeoFields
                    :modelValue="form"
                    @update:modelValue="form = $event"
                    :config="{
                        hiddenFields: ['seo_slug'],
                    }"
                />
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
                general_logo: null,
                general_logo_footer: null,
                general_favicon: null,
                about_team_images: [],
                ...this.item
            },
        }
    },
}
</script>
