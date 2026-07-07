<template>
    <div class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div class="flex flex-col flex-1 min-h-0 bg-gray-900">
            <div class="flex flex-col flex-1 overflow-y-auto">
                <SidebarItems />
            </div>
            <SidebarAccount :admin="admin" />
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
};
</script>
