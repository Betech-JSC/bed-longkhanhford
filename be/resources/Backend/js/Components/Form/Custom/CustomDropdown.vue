<template>
    <Dropdown
        :model-value="modelValue?.toString()"
        @change="$emit('change', $event.value)"
        :options="field.options"
        :loading="field.loading"
        :optionValue="keyBy"
        :optionLabel="labelBy"
        :placeholder="placeholder"
        :filter="field.filter || true"
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
        placeholder() {
            if (this.field.placeholder) return this.field.placeholder;
            if (!this.field.label) return this.tt('models.field.please_choose');
            return `${this.tt('models.field.choose')} ${this.field.label}`;
        },
    },
};
</script>
