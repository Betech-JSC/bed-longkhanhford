<template layout>
    <Head :title="tt('models.titles.setting')" />
    <WrapSetting>
        <Form
            v-model="formData"
            v-slot="{ form }"
            :config="{ canDestroy: false, addGrid: false, resource: 'settings' }"
        >
            <div class="card">
                <div class="card-header">{{ tt('models.form.general_information') }}</div>
                <div class="card-body">
                    <Field
                        v-model="form.mail_from_address"
                        :field="{
                            type: 'text',
                            name: 'mail_from_address',
                            label: 'Mail From Address',
                        }"
                    />
                    <Field
                        v-model="form.mail_from_name"
                        :field="{
                            type: 'text',
                            name: 'mail_from_name',
                            label: 'Mail From Name',
                        }"
                    />
                    <Field
                        v-model="form.mail_username"
                        :field="{
                            type: 'text',
                            name: 'mail_username',
                            label: 'Mail Username',
                        }"
                    />
                    <Field
                        v-model="form.mail_password"
                        :field="{
                            type: 'password',
                            name: 'mail_password',
                            label: 'Mail Password',
                        }"
                    />
                    <div class="field-row">
                        <Field
                            v-model="form.mail_host"
                            :field="{
                                type: 'text',
                                name: 'mail_host',
                                label: 'Mail Host',
                            }"
                        />
                        <Field
                            v-model="form.mail_port"
                            :field="{
                                type: 'text',
                                name: 'mail_port',
                                label: 'Mail Port',
                            }"
                        />
                        <Field
                            v-model="form.mail_encryption"
                            :field="{
                                type: 'text',
                                name: 'mail_encryption',
                                label: 'Mail Encryption',
                            }"
                        />
                    </div>
                </div>
            </div>

            <Field
                class="hidden"
                disabled
                v-model="form.id"
                :field="{ default: 'smtp' }"
            />
        </Form>
    </WrapSetting>
</template>
<script>
import WrapSetting from "@Core/Components/WrapSetting.vue";
export default {
    components: { WrapSetting },
    props: ["item", "schema"],
    data() {
        return {
            formData: this.item,
        };
    },
};
</script>
