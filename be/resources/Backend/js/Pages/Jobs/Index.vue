<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'title',
            'status',
            'expected_time',
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
