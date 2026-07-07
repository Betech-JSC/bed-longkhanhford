<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'name',
            {
                field: 'logo',
                label: 'Logo',
                type: 'image',
            },
            'link',
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
