<template layout>
    <Head :title="tt('models.titles.setting')" />
    <WrapSetting>
        <Form v-model="formData" v-slot="{ form }" :config="{ canDestroy: false, addGrid: false, resource: 'settings' }">
            <div class="card">
                <div class="card-header">{{ tt('models.setting.custom_vars_form.general_information') }}</div>
                <div class="card-body">
                    <div class="space-y-4">
                        <div v-for="(item, index) in form.custom_vars" :key="index">
                            <div class="flex">
                                <div class="ml-auto">
                                    <div @click="confirmRemoveItem(index)"
                                        class="p-1 ml-auto border rounded cursor-pointer text-gray500 hover:text-gray-700 hover:bg-gray-100">
                                        <material-symbols:delete-outline-sharp />
                                    </div>
                                </div>
                            </div>
                            <div class="space-y-3">
                                <Field v-model="item.key" :field="{
                                    type: 'text',
                                    name: 'key',
                                    label: 'Key',
                                }" />
                                <Field v-model="item.value" :field="{
                                    type: 'textarea',
                                    name: 'value',
                                    label: 'Value',
                                    rows: 1
                                }" />
                                <Field
                                    v-model="item.is_public"
                                    :field="{
                                        type: 'checkbox',
                                        name: 'is_public',
                                    }"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <Button :label="tt('models.setting.custom_vars_form.add')" variant="white" @click="
                            this.formData.custom_vars.push({
                                key: null,
                                value: null,
                            })
                        " />
                    </div>
                </div>
            </div>

            <Field class="hidden" disabled v-model="form.id" :field="{ default: 'custom_vars' }" />
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
            formData: {
                ...this.item,
                custom_vars: this.item.custom_vars ? JSON.parse(this.item.custom_vars) : [],
            },
        };
    },
    methods: {
        confirmRemoveItem(index) {
            if (confirm(this.tt('models.setting.custom_vars_form.confirm_delete'))) {
                this.formData.custom_vars.splice(index, 1);
            }
        },
    },
};
</script>
