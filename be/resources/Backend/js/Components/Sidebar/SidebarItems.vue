<template>
    <div class="flex items-center justify-center flex-shrink-0 p-5 border-b border-gray-800">
        <Link href="/" class="flex items-center justify-center w-full p-2">
            <span class="font-['Ford_Antenna',sans-serif] font-bold text-white text-[13px] tracking-tight leading-none uppercase">DONG NAI FORD</span>
        </Link>
    </div>
    <nav class="flex-1 px-2 pb-4 space-y-1 navs">
        <hr />
        <Link :href="route('admin.dashboard.index')" :class="{ active: isUrl('admin.dashboard.index') }" class="item">
            <ph:chart-bar-light />
            <span>Dashboard</span>
        </Link>
        <hr />
        <SidebarMain />
        <Link
            v-if="can('admin.jobs.index')"
            :href="route('admin.jobs.index')"
            :class="{ active: isUrl('admin.jobs.*') }"
            class="item"
        >
            <ph:briefcase-light />
            <span>{{ tt('models.table_list.jobs') }}</span>
        </Link>
        <hr />
        <Link
            v-if="can('admin.files.index')"
            :href="route('admin.files.index')"
            :class="{ active: isUrl('admin.files.*') }"
            class="item"
        >
            <ph:image />
            <span>{{ tt('models.table_list.files') }}</span>
        </Link>
        <Link
            v-if="can('admin.admins.index')"
            :href="route('admin.admins.index')"
            :class="{ active: isUrl('admin.admins.*') }"
            class="item"
        >
            <heroicons-outline:user-circle />
            <span>{{ tt('models.table_list.admins') }}</span>
        </Link>
        <Link
            v-if="can('admin.configs.index')"
            :href="route('admin.configs.index')"
            :class="{ active: isUrl('admin.configs.*') }"
            class="item"
        >
            <heroicons-outline:user-group />
            <span>{{ tt('models.table_list.configs') }}</span>
        </Link>

        <Link
            v-if="can('admin.roles.index')"
            :href="route('admin.roles.index')"
            :class="{ active: isUrl('admin.roles.*') }"
            class="item"
        >
            <heroicons-outline:user-group />
            <span>{{ tt('models.table_list.roles') }}</span>
        </Link>
        <Link
            v-if="can('admin.settings.index')"
            :href="route('admin.settings.form', { id: 'general' })"
            :class="{ active: isUrl('admin.settings.*') }"
            class="item"
        >
            <heroicons-outline:cog-8-tooth />
            <span>{{ tt('models.table_list.settings') }}</span>
        </Link>
    </nav>
</template>
<script>
export default {
    computed: {
        currentLocale() {
            return this.$page.props.locale.current
        },
    },

    methods: {
        async switchLocale(locale, params = {}) {
            await this.$axios.post(route(`admin.helper.set-locale`, { locale }))

            const currentLocale = this.$inertia.page.props.locale.current
            const currentRoute = route().current().replace(currentLocale, locale)

            window.location.href = route(currentRoute, {
                ...route().params,
                ...params,
            })
        },
    },
}
</script>
<style lang="scss">
.navs {
    hr {
        @apply opacity-10;
    }
    .item {
        @apply flex items-center w-full gap-2 px-6 py-2 text-white transition duration-150 text-base;

        svg {
            @apply h-6 w-6;
        }
        &:not(.active) {
            @apply opacity-70;
            &:hover {
                @apply opacity-100;
            }
        }
        &.active {
            @apply bg-gray-800 text-primary;
        }
    }
    .item-group-label {
        @apply px-6 pt-4 pb-1 text-xs font-semibold uppercase tracking-widest text-gray-500;
    }
}
</style>
