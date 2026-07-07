<template layout>
    <Table
        :schema="schema"
        :columns="[
            'id',
            'title',
            'status',
            {
                field: 'position_display',
                transform: (data) => {
                    return getPosition(data.position_display)
                },
            },
            'created_at',
            'updated_at',
        ]"
    >
        <template #filter="{filters}">
            <div>
                <Field
                    class="w-[250px]"
                    v-model="position"
                    @change="filters['position'] = position"
                    :field="{
                        type: 'dropdown',
                        name: 'position_display',
                        label: false,
                        keyBy: 'id',
                        labelBy: 'label',
                        options: position_display
                    }"
                />
            </div>
        </template>
    </Table>
</template>
<script>

export default {
    props: ["schema", "data"],
    data() {
        let position_display = [
            { id: 'ALL', label: 'Xem tất cả'}
        ].concat(this.data.slider.position_display);

        return {
            position: 'ALL',
            position_display
        };
    },
    methods: {
        getPosition(value) {
            let position = this.position_display.filter(item => item.id == value);
            return position[0].label;
        }
    }
};
</script>
