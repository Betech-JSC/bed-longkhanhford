<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'title',
            'position_sort',
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
