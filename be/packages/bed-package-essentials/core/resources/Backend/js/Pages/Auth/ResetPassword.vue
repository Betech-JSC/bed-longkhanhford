<template>
    <Head title="Reset Password" />

    <form class="space-y-6" @submit.prevent="submit">
        <FlashMessages />
        <Field
            v-model="form.email"
            :field="{
                label: 'Email',
            }"
        />
        <Field
            v-model="form.password"
            :field="{
                label: 'Mật khẩu',
                type: 'password',
            }"
        />
        <Field
            v-model="form.password_confirmation"
            :field="{
                label: 'Nhập lại mật khẩu',
                type: 'password',
            }"
        />

        <div class="flex items-center justify-end mt-4">
            <Button
                type="submit"
                :loading="form.processing"
                label="Đặt lại mật khẩu"
                class="w-full"
            />
        </div>
    </form>
</template>

<script>
import Guest from "@Core/Layouts/Guest.vue";
import FlashMessages from "@Core/Components/FlashMessages.vue";
import { Head, Link } from "@inertiajs/inertia-vue3";

export default {
    components: {
        Head,
        Link,
        FlashMessages,
    },
    layout: Guest,

    props: {
        email: String,
        token: String,
    },

    data() {
        return {
            form: this.$inertia.form({
                token: this.token,
                email: this.email,
                password: "",
                password_confirmation: "",
            }),
        };
    },

    methods: {
        submit() {
            this.form.post(this.route("admin.password.update"), {
                onFinish: () => form.reset("password", "password_confirmation"),
            });
        },
    },
};
</script>
