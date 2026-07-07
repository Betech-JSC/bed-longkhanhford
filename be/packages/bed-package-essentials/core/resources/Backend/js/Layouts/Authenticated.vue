<template>
    <div>
        <Toast />
        <SidebarMobile :admin="admin" ref="sidebarMobile" />
        <SidebarDesktop :admin="admin" />

        <div class="flex flex-col flex-1 md:pl-64">
            <div
                class="sticky top-0 z-10 flex justify-between p-2 bg-gray-800 md:hidden"
            >
                <button
                    @click="openSidebar"
                    type="button"
                    class="inline-flex items-center justify-center p-2 text-indigo-200 bg-transparent rounded-md hover:text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white"
                >
                    <span class="sr-only">Open sidebar</span>
                    <svg
                        class="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
            <main class="flex-1 min-h-screen">
                <Breadcrumbs />
                <slot />
            </main>
        </div>
    </div>
</template>

<script>
import Breadcrumbs from "@Core/Components/Breadcrumbs.vue";
import SidebarDesktop from "@Core/Components/Sidebar/SidebarDesktop.vue";
import SidebarMobile from "@Core/Components/Sidebar/SidebarMobile.vue";

export default {
    props: ["admin"],
    components: {
        SidebarDesktop,
        SidebarMobile,
        Breadcrumbs,
    },
    data() {
        return {
            visibleLeft: true,
        };
    },

    methods: {
        openSidebar() {
            const sidebar = this.$refs["sidebarMobile"];
            sidebar.toggleSideBar();
        },
    },
};
</script>
