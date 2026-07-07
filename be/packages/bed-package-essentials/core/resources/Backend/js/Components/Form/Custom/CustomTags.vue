<template>
    <Chips
        :model-value="tags"
        @add="emitChange($event.value)"
        @remove="removeTag($event.value)"
        :separator="field.allowDuplicate || ','"
        :allowDuplicate="field.allowDuplicate || false"
        :addOnBlur="field.addOnBlur || true"
        :max="field.max || null"
        :disabled="field.disabled || false"
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
        tags() {
            return this.modelValue ? this.modelValue.split(",") : [];
        },
    },
    methods: {
        removeTag(value) {
            const tags = this.tags;
            const tagIndex = tags.findIndex((x) => x === value[0]);
            tags.splice(tagIndex, 1);

            this.emitChange(tags);
        },
        emitChange(tags) {
            this.$emit("change", tags.join(","));
        },
    },
};
</script>
