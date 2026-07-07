<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            {
                field: 'Họ và tên',
                transform: (data) => {
                    return data.data_contact['Họ và tên'] || '';
                }
            },
            {
                field: 'Số điện thoại',
                transform: (data) => {
                    return data.data_contact['Số điện thoại'] || '';
                }
            },
            {
                field: 'Biển số xe',
                transform: (data) => {
                    return data.data_contact['Biển số xe'] || '';
                }
            },
            {
                field: 'Thời gian hẹn',
                transform: (data) => {
                    return data.data_contact['Thời gian hẹn'] || '';
                }
            },
            {
                field: 'Địa điểm',
                transform: (data) => {
                    return data.data_contact['Tại'] || '';
                }
            },
            'status',
            'created_at',
        ]"
        :config="{
            canCreate: false,
        }"
    />
</template>
<script>
export default {
    props: ["schema"],
};
</script>
