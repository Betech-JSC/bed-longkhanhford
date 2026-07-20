<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'image',
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
