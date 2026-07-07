<template>
    <Head title="Log in" />
    <section class="h-screen bg-gray-50">
        <div class="container h-full px-6 py-12 mx-auto">
            <div class="flex items-center justify-center h-full lg:justify-between">
                <!-- Login form -->
                <div class="w-full max-w-md">
                    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900">Đăng nhập</h2>
                        <p class="mt-2 text-sm text-gray-600">Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục.</p>
                    </div>

                    <form class="mt-8 space-y-6" @submit.prevent="submit">
                        <!-- Email input -->
                        <div>
                            <Field
                                v-model="form.email"
                                :field="{
                                    type: 'email',
                                    name: 'email',
                                    placeholder: 'Vui lòng nhập email',
                                }"
                            />
                        </div>

                        <!-- Password input -->
                        <div>
                            <Field
                                v-model="form.password"
                                :field="{
                                    type: 'password',
                                    name: 'password',
                                    placeholder: 'Vui lòng nhập mật khẩu',
                                }"
                            />
                        </div>

                        <!-- Remember me -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    v-model="form.remember"
                                    class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label for="remember" class="ml-2 block text-sm text-gray-600"> Nhớ đăng nhập </label>
                            </div>

                            <!-- <div class="text-sm">
                                <Link href="#" class="font-medium text-primary hover:text-primary-accent-300">
                                    Quên mật khẩu?
                                </Link>
                            </div> -->
                        </div>

                        <!-- Submit button -->
                        <button
                            type="submit"
                            class="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white transition duration-150 hover:bg-primary-accent-300 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50"
                        >
                            Đăng nhập
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
                email: 'admin@gmail.com',
                password: 'admin@gmail.com',
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
