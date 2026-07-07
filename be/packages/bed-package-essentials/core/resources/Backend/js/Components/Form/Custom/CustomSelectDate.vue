<template>
    <Dropdown
        :model-value="modelValue"
        @change="$emit('change', $event.value)"
        :options="options"
        :placeholder="placeholder"
    >
        <template #content="{ items }">
            {{ items }}
            asd
        </template>
        <!-- <template #optiongroup="{ option }">
            <div class="flex align-items-center country-item">
                <img
                    src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
                    width="18"
                />
                <div>{{ option.name }}</div>
            </div>
        </template> -->
    </Dropdown>
</template>

<script>
export default {
    props: ["field", "modelValue"],
    emits: ["change"],

    data() {
        return {
            options: [
                {
                    name: "Hôm nay",
                    value: {
                        period: "day",
                        date: this.toDate(new Date(), "YYYY-MM-DD"),
                    },
                },
                {
                    name: "Hôm qua",
                    value: {
                        period: "1d",
                        date: this.toDate(new Date(), "YYYY-MM-DD"),
                    },
                },
                {
                    name: "7 ngày gần nhất",
                    value: {
                        period: "7d",
                        date: this.toDate(new Date(), "YYYY-MM-DD"),
                    },
                },
                {
                    name: "30 ngày gần nhất",
                    value: {
                        period: "30d",
                        date: this.toDate(new Date(), "YYYY-MM-DD"),
                    },
                },
            ],
        };
    },

    computed: {
        keyBy() {
            return this.field.keyBy || "value";
        },
        labelBy() {
            return this.field.labelBy || "name";
        },
        placeholder() {
            if (this.field.placeholder) return this.field.placeholder;
            if (!this.field.label) return this.tt('models.field.please_choose');
            return `${this.tt('models.field.choose')} ${this.field.label}`;
        },
    },
};
</script>
