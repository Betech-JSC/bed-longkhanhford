<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'title',
            'sort_order',
            'status',
            'created_at',
        ]"
    />
</template>
<script>
export default {
    props: ['schema'],
}
</script>
