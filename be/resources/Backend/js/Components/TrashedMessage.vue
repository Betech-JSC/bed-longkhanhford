<template>
    <div class="p-4 bg-yellow-50">
        <div class="flex">
            <div class="flex-shrink-0">
                <heroicons-outline:exclamation
                    class="w-5 h-5 text-yellow-400"
                />
            </div>
            <div class="ml-3">
                <p class="text-sm text-yellow-700">
                    {{ tt('models.message.trashed_message1') }}
                    {{ toDate($parent.form.deleted_at) }}.
                    <Link
                        @click="$parent.restore()"
                        class="font-medium text-yellow-700 underline hover:text-yellow-600"
                    >
                        {{ tt('models.message.trashed_message2') }}
                    </Link>
                </p>
            </div>
        </div>
    </div>
</template>
