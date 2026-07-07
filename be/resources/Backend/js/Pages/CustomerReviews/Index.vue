<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            {
                field: 'image',
                label: 'Ảnh',
                type: 'image',
                transform: (row) => row.image_url,
            },
            'customer_name',
            {
                field: 'rating',
                label: 'Sao',
                transform: (row) => '⭐'.repeat(row.rating),
            },
            {
                field: 'product_id',
                label: 'Khóa học',
                transform: (row) => {
                    const p = products.find(p => p.id === row.product_id)
                    return p ? p.title : '— Chung —'
                },
            },
            'status',
            'sort_order',
            'created_at',
        ]"
    />
</template>
<script>
export default {
    props: ['schema', 'data'],
    data() {
        return {
            products: this.data?.products ?? [],
        }
    },
}
</script>
