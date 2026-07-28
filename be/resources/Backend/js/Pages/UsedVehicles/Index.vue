<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'image',
            'title',
            'price',
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
