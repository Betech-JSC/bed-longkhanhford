<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'name',
            {
                field: 'avatar',
                label: 'Ảnh đại diện',
                type: 'image',
            },
            'job_title',
            'department',
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
