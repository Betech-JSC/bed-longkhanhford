<template>
    <div class="flex flex-col space-y-2">
        <div v-for="(option, index) in field.options" class="space-x-2" :key="index">
            <RadioButton
                :inputId="`${fieldId}_${index}`"
                :name="option[labelBy]"
                :value="option[keyBy]"
                v-model="radioValue"
                :model-value="modelValue?.toString()"
                :disabled="disabled"
            />
            <label :for="`${fieldId}_${index}`" class="cursor-pointer label">
                {{ option.styles ? option.styles[labelBy] : option[labelBy] }}
            </label>
        </div>
    </div>
</template>

<script>
export default {
    props: ['field', 'modelValue', 'disabled'],
    emits: ['change'],

    data() {
        return {
            radioValue: this.modelValue,
        }
    },

    computed: {
        keyBy() {
            return this.field.keyBy || 'id'
        },
        labelBy() {
            return this.field.labelBy || 'label'
        },
        fieldId() {
            return this.field.name + '_' + Math.random().toString(36).substr(2, 9).toUpperCase()
        },
    },

    watch: {
        radioValue(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.change(newValue)
            }
        },
        modelValue(newValue, oldValue) {
            if (newValue !== oldValue) {
                this.radioValue = newValue
            }
        },
    },

    methods: {
        change(value) {
            this.$emit('change', value)
        },
    },
}
</script>
