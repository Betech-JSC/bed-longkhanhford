<template>
    <Head title="Confirm Password" />

    <div class="mb-4 text-sm text-gray-600">
        This is a secure area of the application. Please confirm your password
        before continuing.
    </div>

    <form class="space-y-6" @submit.prevent="submit">
        <FlashMessages />
        <Field
            v-model="form.password"
            :field="{
                label: 'Password',
            }"
        />
        <div class="flex justify-end mt-4">
            <Button type="submit" :loading="form.processing"> Confirm </Button>
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
                password: "",
            }),
        };
    },

    methods: {
        submit() {
            this.form.post(this.route("admin.password.confirm"), {
                onFinish: () => this.form.reset(),
            });
        },
    },
};
</script>
