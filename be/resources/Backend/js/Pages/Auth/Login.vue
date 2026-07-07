<template>
    <Head title="Log in" />
    <section class="h-screen">
        <div class="container h-full px-6 py-24">
            <div class="flex h-full flex-wrap items-center justify-center lg:justify-between">
                <div>
                    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 class="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Đăng nhập
                        </h2>
                    </div>
                    <form class="space-y-6" @submit.prevent="submit">
                        <!-- Email input -->
                        <Field
                            v-model="form.email"
                            :field="{
                                type: 'email',
                                name: 'email',
                                placeholder: 'Vui lòng email',
                            }"
                        />

                        <!-- Password input -->
                        <Field
                            v-model="form.password"
                            :field="{
                                type: 'password',
                                name: 'password',
                                placeholder: 'Vui lòng nhập password',
                            }"
                        />

                        <!-- Submit button -->
                        <button
                            type="submit"
                            class="inline-block w-full rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                            data-twe-ripple-init
                            data-twe-ripple-color="light"
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import FlashMessages from '@Core/Components/FlashMessages.vue'
import Guest from '@Core/Layouts/Guest.vue'

import { Head, Link } from '@inertiajs/inertia-vue3'
export default {
    components: {
        Head,
        Link,
        FlashMessages,
    },
    layout: Guest,

    props: {
        canResetPassword: Boolean,
        status: String,
    },

    data() {
        return {
            form: this.$inertia.form({
                email: null,
                password: null,
                remember: true,
            }),
            isProduction: import.meta.env.PROD,
        }
    },

    methods: {
        submit() {
            this.form
                .transform((data) => ({
                    ...data,
                    remember: this.form.remember ? 'on' : '',
                }))
                .post(this.route('admin.login'), {
                    onFinish: () => this.form.reset('password'),
                })
        },
    },
}
</script>
