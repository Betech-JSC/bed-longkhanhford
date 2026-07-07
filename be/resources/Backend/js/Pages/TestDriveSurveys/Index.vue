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
                field: 'Dòng xe lái thử',
                transform: (data) => {
                    return data.data_contact['Dòng xe lái thử'] || data.data_contact['Vehicle'] || '';
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
