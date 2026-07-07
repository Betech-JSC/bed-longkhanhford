<template>
    <Head title="Forgot Password" />

    <div class="mb-4 text-sm text-gray-600">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
    </div>

    <div v-if="status" class="mb-4 text-sm font-medium text-green-600">
        {{ status }}
    </div>

    <form class="space-y-6" @submit.prevent="submit">
        <FlashMessages />
        <Field
            v-model="form.email"
            :field="{
                label: 'Email',
            }"
        />
        <div class="flex items-center justify-end mt-4">
            <Button type="submit" :loading="form.processing">
                Email Password Reset Link
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

    props: {
        status: String,
    },

    data() {
        return {
            form: this.$inertia.form({
                email: null,
            }),
        };
    },

    methods: {
        submit() {
            this.form.post(this.route("admin.password.email"));
        },
    },
};
</script>
