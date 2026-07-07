<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            {
                field: 'Họ và tên',
                transform: (data) => {
                    return data.data_contact['Họ và tên'] || data.data_contact['Name'] || '';
                }
            },
            {
                field: 'Số điện thoại',
                transform: (data) => {
                    return data.data_contact['Số điện thoại'] || data.data_contact['Phone'] || '';
                }
            },
            {
                field: 'Biển số xe',
                transform: (data) => {
                    return data.data_contact['Biển số xe'] || data.data_contact['LicensePlate'] || '';
                }
            },
            {
                field: 'Chất lượng dịch vụ',
                transform: (data) => {
                    return data.data_contact['Chất lượng dịch vụ'] || data.data_contact['ServiceRating'] || '';
                }
            },
            {
                field: 'NPS',
                transform: (data) => {
                    return data.data_contact['Điểm giới thiệu (NPS)'] || data.data_contact['NpsScore'] || '';
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
