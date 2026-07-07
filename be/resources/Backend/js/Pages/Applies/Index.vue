<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            {
                field: 'email',
                transform: (data) => {
                    return data.data_contact.Email;
                }
            },
            'status',
            'created_at',
            'updated_at',
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
