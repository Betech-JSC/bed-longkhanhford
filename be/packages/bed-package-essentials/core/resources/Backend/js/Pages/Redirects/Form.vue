<template layout>
    <Head :title="tt('models.titles.redirect')" />
    <WrapSetting>
        <Form v-model="formData" v-slot="{ form }" :config="{ resource: 'settings.redirects' }">
            <div class="card">
                <div class="card-header">{{ tt('models.setting.general_information') }}</div>
                <div class="card-body">
                    <Field
                        v-model="form.old_url"
                        :field="{
                            name: 'old_url',
                            label: 'URL cũ',
                        }"
                    />
                    <Field
                        v-model="form.new_url"
                        :field="{
                            name: 'new_url',
                            label: 'URL mới',
                        }"
                    />
                    <Field
                        v-model="form.status_code"
                        :field="{
                            type: 'number',
                            name: 'status_code',
                            label: 'Mã trạng thái',
                        }"
                    />
                    <Field
                        v-model="form.is_active"
                        :field="{
                            type: 'checkbox',
                            label: 'Kích hoạt',
                        }"
                    />
                </div>
            </div>
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
            formData: this.item,
        }
    },
}
</script>
