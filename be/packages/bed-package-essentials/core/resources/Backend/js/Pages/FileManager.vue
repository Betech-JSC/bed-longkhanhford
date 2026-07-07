<template>
    <Head :title="tt('models.titles.file')" />
    <FileManager :show="true" :selectable="false" />
</template>

<script>
import FileManager from "@Core/Components/FileManager.vue";

export default {
    components: {
        FileManager,
    },
};
</script>
