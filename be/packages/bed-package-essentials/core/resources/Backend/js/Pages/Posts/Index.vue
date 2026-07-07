<template layout>
    <Table :schema="schema" :columns="['id', 'title']" />
</template>
<script>
export default {
    props: ["schema"],
};
</script>
