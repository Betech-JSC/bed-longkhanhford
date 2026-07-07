<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'title',
            {
                field: 'image',
                label: 'Ảnh xe',
                type: 'image',
            },
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
