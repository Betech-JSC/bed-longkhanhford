<template layout>
    <Head :title="tt('models.titles.admin')" />
    <Table :schema="schema" :columns="['id', 'name', 'email', 'role_names']" />
</template>
<script>
export default {
    props: ["schema"],
};
</script>
