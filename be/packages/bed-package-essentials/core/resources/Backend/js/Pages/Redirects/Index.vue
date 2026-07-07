<template layout>
    <Head :title="tt('models.titles.redirect')" />
    <WrapSetting>
        <Table :schema="schema" :config="{
            resource: 'settings.redirects',
        }" :columns="['old_url', 'new_url', 'status_code', 'is_active']" />
        <Button v-if="reload_octane" label="Xóa cache redirect" class="mt-6 btn-primary" @click="reloadOctane" :loading="octaneReloading"/>
    </WrapSetting>
</template>
<script>
import WrapSetting from "@Core/Components/WrapSetting.vue";
export default {
    components: { WrapSetting },
    props: ["schema", "reload_octane"],
    data() {
        return {
            octaneReloading: false
        }
    },
    methods: {
        reloadOctane() {
            this.octaneReloading = true
            this.$axios
                .get(this.route("admin.helper.reload-octane"))
                .finally(() => this.octaneReloading = false);
        }
    }
};
</script>
