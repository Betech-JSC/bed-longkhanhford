<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'title',
            {
                field: 'year',
                transform: (data) => {
                    return data.year
                },
            },
            'status',
            'created_at',
            'updated_at',
        ]"
    />
</template>
<script>
export default {
    props: ["schema"],
};
</script>
