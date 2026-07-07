<template>
    <GuestLayout>
        <Head title="Email Verification" />

        <div class="mb-4 text-sm text-gray-600">
            Thanks for signing up! Before getting started, could you verify your
            email address by clicking on the link we just emailed to you? If you
            didn't receive the email, we will gladly send you another.
        </div>

        <div
            class="mb-4 text-sm font-medium text-green-600"
            v-if="verificationLinkSent"
        >
            A new verification link has been sent to the email address you
            provided during registration.
        </div>

        <form class="space-y-6" @submit.prevent="submit">
            <FlashMessages />
            <div class="flex items-center justify-between mt-4">
                <Button
                    type="submit"
                    :loading="form.processing"
                    label="Gửi lại email xác thực"
                />
                <Link
                    :href="route('admin.logout')"
                    method="post"
                    as="button"
                    class="text-sm text-gray-600 underline hover:text-gray-900"
                >
                    Log Out
                </Link>
            </div>
        </form>
    </GuestLayout>
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
            form: this.$inertia.form(),
        };
    },

    computed: {
        verificationLinkSent() {
            return this.status === "verification-link-sent";
        },
    },

    methods: {
        submit() {
            this.form.post(this.route("admin.verification.send"));
        },
    },
};
</script>
