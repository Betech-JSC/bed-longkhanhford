<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'name_with_type',
            'path_with_type',
            'code',
            'shipping_price',
        ]"
    />
</template>
<script>
export default {
    props: ["schema"],
};
</script>
