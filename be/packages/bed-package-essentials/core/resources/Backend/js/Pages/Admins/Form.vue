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
    props: ["item", "schema"],
    data() {
        return {
            formData: this.item,
        };
    },
};
</script>
