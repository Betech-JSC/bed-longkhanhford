<template>
    <div
        class="fixed inset-0 z-30 transition-opacity bg-gray-600 bg-opacity-75"
        :class="showSidebar ? ' h-full' : ' h-0'"
        aria-hidden="true"
    ></div>
    <div
        class="fixed inset-0 z-40 flex transition duration-300 ease-in-out transform md:hidden"
        :class="showSidebar ? 'translate-x-0' : '-translate-x-full'"
        role="dialog"
        aria-modal="true"
    >
        <div class="relative flex flex-col flex-1 w-full max-w-xs bg-gray-800">
            <div
                class="absolute top-0 right-0 pt-2 -mr-12 duration-300 ease-in-out"
                :class="showSidebar ? 'opacity-100' : 'opacity-0'"
            >
                <button
                    @click="toggleSideBar"
                    type="button"
                    class="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                    <span class="sr-only">Close sidebar</span>
                    <!-- Heroicon name: outline/x -->
                    <svg
                        class="w-6 h-6 text-white"
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
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <div class="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <SidebarItems />
            </div>
            <SidebarAccount :admin="admin" />
        </div>

        <div class="flex-shrink-0 w-14">
            <!-- Force sidebar to shrink to fit close icon -->
        </div>
    </div>
</template>
<script>
import SidebarItems from "@Core/Components/Sidebar/SidebarItems.vue";
import SidebarAccount from "@Core/Components/Sidebar/SidebarAccount.vue";

export default {
    props: ["admin"],
    components: {
        SidebarItems,
        SidebarAccount,
    },

    data() {
        return {
            showSidebar: false,
        };
    },

    watch: {
        "$page.url"() {
            this.showSidebar = false;
        },
    },

    methods: {
        toggleSideBar() {
            this.showSidebar = !this.showSidebar;
        },
    },
};
</script>
