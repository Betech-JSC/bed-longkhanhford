<template>
    <div class="flex flex-shrink-0 px-5 py-2 bg-gray-800">
        <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
                <Avatar
                    :label="admin && admin.name ? admin.name.charAt(0) : 'JAM'"
                    shape="circle"
                    class="text-white bg-primary"
                />
                <div class="ml-3">
                    <div class="text-sm text-white">
                        {{ admin ? admin.name : "" }}
                    </div>
                    <div
                        @click="showAdminForm = true"
                        class="text-xs text-gray-400 cursor-pointer hover:text-gray-300 hover:underline"
                    >
                        {{ tt('models.admins.change_password') }}
                    </div>

                    <Form
                        v-model="adminForm"
                        v-slot="{ form }"
                        class="card"
                        :config="{
                            resource: 'admins',
                            showActions: false,
                            showFlashMessages: false,
                            addGrid: false,
                        }"
                    >
                        <Dialog
                            :header="tt('models.admins.update_information')"
                            v-model:visible="showAdminForm"
                            :breakpoints="{
                                '960px': '75vw',
                                '640px': '90vw',
                            }"
                            :style="{ width: '50vw' }"
                            :draggable="false"
                        >
                            <Field
                                v-model="adminForm.name"
                                :field="{
                                    type: 'text',
                                    name: 'name',
                                }"
                            />
                            <div class="mt-6 field-row">
                                <Field
                                    v-model="form.password"
                                    :field="{
                                        type: 'password',
                                        name: 'password',
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
                            <template #footer>
                                <Button
                                    :label="tt('models.admins.cancel')"
                                    @click="showAdminForm = false"
                                />
                                <Button
                                    :label="tt('models.admins.save')"
                                    icon="pi pi-check"
                                    @click="submitAdminForm"
                                    class="btn-primary"
                                    autofocus
                                />
                            </template>
                        </Dialog>
                    </Form>
                </div>
            </div>
            <Link
                class="flex-shrink-0 rounded hover:bg-gray-900/50"
                method="post"
                :href="route('admin.logout')"
                :title="tt('models.admins.logout')"
            >
                <ph-sign-out-duotone
                    class="w-10 h-10 p-1 text-gray-400 hover:text-white"
                />
            </Link>
        </div>
    </div>
</template>

<script>
export default {
    props: ["admin"],
    data() {
        return {
            adminForm: this.$inertia.form(this.getEmptyForm()),
            showAdminForm: false,
        };
    },
    methods: {
        submitAdminForm() {
            this.$axios
                .put(this.route(`admin.admins.changePassword`), this.adminForm)
                .then((res) => {
                    this.adminForm.reset();
                    this.showAdminForm = false;
                    this.$toast.add({
                        severity: "success",
                        summary: this.tt('models.admins.success'),
                        detail: this.tt('models.admins.update_success'),
                        life: 2000,
                    });
                    window.location.href = window.location.href;
                })
                .catch(({ response }) => {
                    this.$toast.add({
                        severity: "error",
                        summary: this.tt('models.admins.error'),
                        detail: response.data.message,
                        life: 2000,
                    });
                });
        },

        getEmptyForm() {
            return {
                id: this.admin?.id,
                name: this.admin?.name,
                password: null,
                password_confirmation: null,
            };
        },
    },
};
</script>
