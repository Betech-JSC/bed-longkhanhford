<template>
    <template v-if="hasErrors || flash.success">
        <div v-if="flash.success" class="p-4 rounded-md bg-green-50">
            <div class="flex">
                <div class="flex-shrink-0">
                    <heroicons-outline:check-circle class="w-5 h-5 text-green-400" aria-hidden="true" />
                </div>
                <div class="ml-3">
                    <p class="text-sm font-medium text-green-800">
                        {{ flash.success }}
                    </p>
                </div>
                <div class="pl-3 ml-auto">
                    <div class="-mx-1.5 -my-1.5">
                        <button
                            @click="clearFlash()"
                            type="button"
                            class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                        >
                            <span class="sr-only">Dismiss</span>
                            <heroicons-outline:x class="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="hasErrors" class="p-4 rounded-md bg-red-50">
            <div class="flex">
                <div class="flex-shrink-0">
                    <heroicons-outline:x-circle class="w-5 h-5 text-red-800" aria-hidden="true" />
                </div>
                <div class="ml-3">
                    <h3 v-if="flash.error" class="text-sm font-medium text-red-800">
                        {{ flash.error }}
                    </h3>
                    <template v-if="Object.keys(errors).length">
                        <h3 class="text-sm font-medium text-red-800">
                            {{ tt('models.message.flash_message1') }} {{ Object.keys(errors).length }} {{ tt('models.message.flash_message2') }}
                        </h3>
                        <div class="mt-2 text-sm text-red-700">
                            <ul role="list" class="pl-5 space-y-1 list-disc">
                                <li v-for="(error, key) in errors" :key="key">
                                    {{ error }}
                                </li>
                            </ul>
                        </div>
                    </template>
                </div>
                <div class="pl-3 ml-auto">
                    <div class="-mx-1.5 -my-1.5">
                        <button
                            @click="clearFlash()"
                            type="button"
                            class="inline-flex bg-red-100 rounded-md p-1.5 text-red-500 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-10 focus:ring-red-600"
                        >
                            <span class="sr-only">Dismiss</span>
                            <heroicons-outline:x class="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </template>
</template>

<script>
export default {
    computed: {
        flash() {
            return this.$page.props.flash
        },
        errors() {
            return this.$page.props.errors
        },
        hasErrors() {
            return this.flash.error || Object.keys(this.errors).length > 0
        },
    },
    methods: {
        clearFlash() {
            this.$page.props.errors = []
            this.$page.props.flash.error = null
            this.$page.props.flash.success = null
        },
    },
    mounted() {
        if (this.flash.success) {
            setTimeout(() => this.clearFlash(), 2000)
        }
    },
}
</script>
