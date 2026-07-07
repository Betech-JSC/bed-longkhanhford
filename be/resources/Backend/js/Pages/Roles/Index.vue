<template layout>
    <Head :title="tt('models.titles.role')" />
    <Table
        :schema="schema"
        :columns="['id', 'name', 'created_at']"
    />
</template>
<script>
export default {
    props: ["schema"],
};
</script>
