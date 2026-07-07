<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            {
                field: 'Họ và tên',
                transform: (data) => {
                    return data.data_contact.Name || data.data_contact['Họ và tên'] || '';
                }
            },
            {
                field: 'Số điện thoại',
                transform: (data) => {
                    return data.data_contact.Phone || data.data_contact['Số điện thoại'] || '';
                }
            },
            {
                field: 'Loại liên hệ',
                transform: (data) => {
                    return data.type === 'ADVISE_FORM' ? 'Tư vấn sản phẩm' : 'Liên hệ';
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
