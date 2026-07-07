<template>
    <TreeSelect
        :model-value="selectedOptions"
        @change="selectChange($event)"
        :options="options"
        :display="mode"
        :selectionMode="field.mode || 'single'"
        :placeholder="placeholder"
        :loading="field.loading"
        :metaKeySelection="false"
    >
        <template #value="{value, placeholder}" v-if="mode === 'chip'">
            <div v-for="node of value" :key="node.key" class="p-treeselect-token">
                <span class="p-treeselect-token-label">{{ node.label }}</span>
                <span class="p-multiselect-token-icon pi pi-times-circle" @click.stop="removeOption(node)"></span>
            </div>
            <template v-if="value.length === 0">
                {{ placeholder || 'empty' }}
            </template>
        </template>
    </TreeSelect>
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
            return this.field.options?.map((option) => this.transformOption(option));
        },
        mode(){
            return !this.field.mode || this.field.mode === 'single' ? 'comma' : 'chip'
        },
        selectedOptions() {
            let options = [];
            this.modelValue?.forEach((option) => {
                options[option] = true;
            });
            return options;
        },
    },

    methods: {
        selectChange(value) {
            this.$emit("change", Object.keys(value));
        },
        transformOption(option){
            let newOption = option;
            newOption.key = newOption[this.keyBy];
            newOption.label = newOption[this.labelBy];
            if (newOption.children && newOption.children.length){
                newOption.children.map(x => this.transformOption(x));
            }
            return newOption;
        },
        removeOption(optionValue) {
            const itemIdToRemove = optionValue[this.keyBy];
            const index = this.modelValue?.findIndex(item => item.toString() === itemIdToRemove.toString());

            if (index !== -1) {
                let newIds = this.modelValue
                newIds.splice(index, 1);
                this.$emit("change", Object.values(newIds));
            }
        },
    },
};
</script>
