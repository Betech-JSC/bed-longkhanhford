<template>
    <Tree
        :filter="true"
        selectionMode="checkbox"
        :value="options"
        :selectionKeys="selectedOptions"
        @update:selectionKeys="selectChange"
        filterMode="lenient"
        class="!block"
    ></Tree>
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
            return this.field.labelBy || "title";
        },
        placeholder() {
            return this.field.placeholder || `Chọn ${this.field.label}`;
        },
        options() {
            return this.field.options?.map((option) =>
                this.transformOption(option)
            );
        },
        selectedOptions() {
            let options = {};
            this.modelValue?.forEach((option) => {
                options[option] = {
                    checked: true,
                    partialChecked: false,
                };
            });
            return options;
        },
    },

    methods: {
        selectChange(value) {
            this.$emit("change", Object.keys(value));
        },
        transformOption(option) {
            let newOption = option;
            newOption.key = newOption[this.keyBy];
            newOption.label = newOption[this.labelBy];
            if (newOption.children && newOption.children.length) {
                newOption.children.map((x) => this.transformOption(x));
            }
            return newOption;
        },
        removeOption(optionValue) {
            const itemIdToRemove = optionValue[this.keyBy];
            const index = this.modelValue?.findIndex(
                (item) => item.toString() === itemIdToRemove.toString()
            );

            if (index !== -1) {
                let newIds = this.modelValue;
                newIds.splice(index, 1);
                this.$emit("change", Object.values(newIds));
            }
        },
    },
};
</script>
