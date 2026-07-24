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
                'code',
                {
                    field: 'category',
                    label: 'Danh mục',
                    transform: (data) => {
                        const categories = this.categories || []
                        const cat = categories.find(c => c.id === data.category)
                        return cat ? cat.label : data.category
                    },
                },
                {
                    field: 'price',
                    label: 'Giá (đ)',
                    transform: (data) => {
                        return this.toMoney(data.price)
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
