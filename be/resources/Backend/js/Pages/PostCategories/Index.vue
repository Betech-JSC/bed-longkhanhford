<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'image',
            'title',
            'status',
            'view_count',
            'created_at',
            'updated_at',
        ]"
    />
</template>
<script>
export default {
    props: ['schema'],
}
</script>
