<template layout>
    <Table
        :schema="schema"
        :columns="displayColumns"
    />
</template>
<script>
export default {
    props: ['schema', 'data'],
    data() {
        return {
            categories: this.data?.categories ?? [],
        }
    },
    computed: {
        displayColumns() {
            return [
                'id',
                'image',
                'title',
                {
                    field: 'category_id',
                    label: 'Danh mục',
                    transform: (data) => {
                        const categories = this.categories || []
                        const cat = categories.find(c => c.id === data.category_id)
                        return cat ? cat.title : '—'
                    },
                },
                'price',
                'price_sale',
                {
                    field: 'discount_percent',
                    label: '% Giảm',
                    transform: (data) => {
                        if (data.price > 0 && data.price_sale > 0) {
                            const percent = Math.round((data.price - data.price_sale) / data.price * 100)
                            return `-${percent}%`
                        }
                        return '—'
                    }
                },
                'status',
                'sort_order',
                'created_at',
            ]
        }
    }
}
</script>
