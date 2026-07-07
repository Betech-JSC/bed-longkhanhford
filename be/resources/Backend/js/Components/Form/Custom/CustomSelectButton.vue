<template>
    <SelectButton
        :model-value="modelValue"
        @change="$emit('change', $event.value)"
        :options="field.options"
        :optionValue="keyBy"
        :optionLabel="labelBy"
    />
</template>

<script>
export default {
    props: ["field", "modelValue"],
    emits: ["change"],

    computed: {
        keyBy() {
            return this.field.keyBy || "id";
        },
        labelBy() {
            return this.field.labelBy || "label";
        },
    },
};
</script>
