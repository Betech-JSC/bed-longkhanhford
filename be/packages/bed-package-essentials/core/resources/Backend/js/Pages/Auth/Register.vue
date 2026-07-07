<template>
    <Head title="Register" />

    <form class="space-y-6" @submit.prevent="submit">
        <FlashMessages />
        <Field
            v-model="form.name"
            :field="{
                label: 'Tên',
            }"
        />
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
                label: 'Nhập lại Mật khẩu',
                type: 'password',
            }"
        />

        <div class="flex items-center justify-end mt-4">
            <Link
                :href="route('admin.login')"
                class="text-sm text-gray-600 underline hover:text-gray-900"
            >
                Bạn đã có tài khoản?
            </Link>

            <Button
                type="submit"
                class="ml-4"
                :loading="form.processing"
            >
                Đăng ký
            </Button>
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

    data() {
        return {
            form: this.$inertia.form({
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
                terms: false,
            }),
        };
    },

    methods: {
        submit() {
            this.form.post(this.route("admin.register"), {
                onFinish: () =>
                    this.form.reset("admin.password", "password_confirmation"),
            });
        },
    },
};
</script>
