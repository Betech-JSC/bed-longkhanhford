<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <div class="card">
                <div class="card-header">Thông tin chung</div>
                <div class="card-body">
                    <Field
                        v-model="form.code"
                        :disabled="true"
                        :field="{
                            type: 'text',
                            name: 'code',
                            label: 'Code',
                        }"
                    />
                    <Field
                        v-model="form.name_with_type"
                        :disabled="true"
                        :field="{
                            type: 'text',
                            name: 'name_with_type',
                        }"
                    />
                    <Field
                        v-model="form.path_with_type"
                        :disabled="true"
                        :field="{
                            type: 'text',
                            name: 'path_with_type',
                        }"
                    />
                </div>
            </div>
        </template>
        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field
                        v-model="form.shipping_price"
                        :field="{
                            type: 'money',
                            name: 'shipping_price',
                            label: 'Phí vận chuyển (VNĐ)',
                        }"
                    />
                    <Field
                        v-model="form.sort"
                        :field="{
                            type: 'number',
                            name: 'sort',
                            label: 'Thứ tự sắp xếp',
                        }"
                    />
                </div>
            </div>
        </template>
    </Form>
</template>
<script>
export default {
    props: ["item", "schema"],
    data() {
        this.item.shipping_price = this.item.shipping_price ?? 0;
        return {
            formData: this.item,
        };
    },

    watch: {
        item() {
            this.formData = {
                ...this.item,
                shipping_price: this.item.shipping_price ?? 0
            }
        },
    },
};
</script>
