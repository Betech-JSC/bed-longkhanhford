<template layout>
    <Head :title="tt('models.titles.setting')" />
    <WrapSetting>
        <Form
            v-model="formData"
            v-slot="{ form }"
            :config="{ canDestroy: false, addGrid: false, resource: 'settings' }"
        >
            <div class="card">
                <div class="card-header">{{ tt('Cấu hình lãi suất trả góp') }}</div>
                <div class="card-body">
                    <Field
                        v-model="form.installment_rate_year_1"
                        :field="{
                            type: 'number',
                            name: 'installment_rate_year_1',
                            label: tt('Lãi suất năm đầu tiên (%)'),
                            placeholder: '8.5',
                            step: '0.1',
                            min: 0,
                            max: 30,
                        }"
                    />
                    <Field
                        v-model="form.installment_rate_subsequent"
                        :field="{
                            type: 'number',
                            name: 'installment_rate_subsequent',
                            label: tt('Lãi suất các năm sau (%)'),
                            placeholder: '11.0',
                            step: '0.1',
                            min: 0,
                            max: 30,
                        }"
                    />
                </div>
            </div>

            <Field
                class="hidden"
                disabled
                v-model="form.id"
                :field="{ default: 'installment' }"
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
            formData: {
                installment_rate_year_1: 8.5,
                installment_rate_subsequent: 11.0,
                ...this.item
            },
        };
    },
};
</script>
