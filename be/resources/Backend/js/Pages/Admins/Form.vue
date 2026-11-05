<template layout>
    <Head :title="tt('models.titles.admin')" />
    <Form v-model="formData" v-slot="{ form }">
        <div class="card">
            <div class="card-header">{{ tt('models.form.general_information') }}</div>
            <div class="card-body">
                <Field
                    v-model="form.name"
                    :field="{
                        type: 'text',
                        name: 'name',
                    }"
                />
                <div class="field-row">
                    <Field
                        v-model="form.email"
                        :field="{
                            type: 'email',
                            name: 'email',
                        }"
                    />
                    <Field
                        v-model="form.phone"
                        :field="{
                            type: 'text',
                            name: 'phone',
                        }"
                    />
                </div>

                <Field
                    v-if="salesConsultantsList.length > 0"
                    v-model="form.sales_consultant_id"
                    :field="{
                        type: 'dropdown',
                        name: 'sales_consultant_id',
                        label: 'Liên kết Cố vấn bán hàng (Dành cho tài khoản Sale)',
                        options: salesConsultantsList,
                        emptyLabel: '-- Không liên kết (Tài khoản Quản trị chung) --',
                        help: 'Khi chọn Cố vấn, tài khoản này chỉ quản lý Landing Page và Lead của riêng bạn Sale đó.',
                    }"
                    @update:modelValue="onConsultantChange(form, $event)"
                />

                <Field
                    class="w-full"
                    v-model="form.role_id"
                    :field="{
                        name: 'role',
                        type: 'radio_list',
                        keyBy: 'id',
                        labelBy: 'name',
                        label: tt('models.role') + ' (*)',
                        source: {
                            model: 'Role',
                            method: 'getRoles',
                            only: ['name', 'id'],
                        },
                    }"
                />
            </div>
        </div>
        <div class="card">
            <div class="card-header">{{ tt('models.admins.set_password') }}</div>
            <div class="card-body">
                <div class="field-row">
                    <Field
                        v-model="form.password"
                        :field="{
                            type: 'password',
                            name: 'password',
                            label: tt('models.password') + (form.id ? '' : ' (*)')
                        }"
                    />
                    <Field
                        v-model="form.password_confirmation"
                        :field="{
                            type: 'password',
                            name: 'password_confirmation',
                        }"
                    />
                </div>
            </div>
        </div>
    </Form>
</template>
<script>
export default {
    props: ["item", "schema", "sales_consultants"],
    data() {
        return {
            formData: this.item,
        };
    },
    computed: {
        salesConsultantsList() {
            return (this.sales_consultants || []).map(c => ({
                id: c.id,
                label: `${c.name} (${c.email || c.phone || 'Chưa có email'})`,
            }));
        },
    },
    methods: {
        onConsultantChange(form, consultantId) {
            if (!consultantId) return;
            const consultant = (this.sales_consultants || []).find(c => c.id === consultantId);
            if (consultant) {
                if (!form.name || form.name === '') form.name = consultant.name;
                if (!form.email || form.email === '') form.email = consultant.email;
                if (!form.phone || form.phone === '') form.phone = consultant.phone;
            }
        },
    },
};
</script>
