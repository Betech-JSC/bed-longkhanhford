<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'title',
            'status',
            {
                field: 'region',
                transform: (data) => {
                    switch (data.region) {
                        case 'mien_nam':
                            return 'Miền nam';
                            break;
                        case 'mien_trung':
                            return 'Miền trung';
                            break;
                        case 'mien_bac':
                            return 'Miền bắc';
                            break;
                        default:
                            return data.region;
                            break;
                    }
                },
            },
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
