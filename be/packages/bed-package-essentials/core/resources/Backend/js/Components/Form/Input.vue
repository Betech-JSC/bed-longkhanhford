<template>
    <template
        v-if="
            field.type === undefined ||
            field.type === 'text' ||
            field.type === 'number' ||
            field.type === 'email' ||
            field.type === 'datetime-local' ||
            field.type === 'date' ||
            field.type === 'time'
        "
    >
        <InputText
            :type="field.type ?? 'text'"
            :model-value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            @blur="validateAsync(field.name)"
            :disabled="disabled"
            :placeholder="field.placeholder || ''"
        />
    </template>
    <template v-else-if="field.type === 'decimal'">
        <InputNumber
            class="w-full"
            :min="0"
            :minFractionDigits="0"
            :maxFractionDigits="2"
            :model-value="parseFloat(modelValue)"
            @blur="validateAsync(field.name)"
            @input="$emit('update:modelValue', $event.value || 0)"
            :disabled="disabled"
        />
    </template>
    <template v-else-if="field.type === 'textarea'">
        <Textarea
            :model-value="modelValue"
            :disabled="disabled"
            @input="$emit('update:modelValue', $event.target.value)"
            :rows="field.rows || 3"
        />
    </template>
    <template v-else-if="field.type === 'richtext'">
        <CustomEditor :model-value="modelValue" @change="$emit('update:modelValue', $event)" :field="field" />
    </template>
    <template v-else-if="field.type === 'money'">
        <InputNumber
            class="w-full"
            :min="0"
            mode="currency"
            currency="VND"
            locale="vi-VN"
            :model-value="isNaN(parseFloat(modelValue)) ? null : parseFloat(modelValue)"
            @input="$emit('update:modelValue', $event.value ?? 0)"
            @blur="validateAsync(field.name)"
            :disabled="disabled"
        />
    </template>
    <template v-else-if="field.type === 'prefix'">
        <InputNumber
            class="w-full"
            :min="0"
            :prefix="field.prefix || 'ATN '"
            :model-value="isNaN(parseFloat(modelValue)) ? null : parseFloat(modelValue)"
            @input="$emit('update:modelValue', $event.value ?? 0)"
            @blur="validateAsync(field.name)"
            :disabled="disabled"
        />
    </template>
    <template v-else-if="field.type === 'password'">
        <Password
            class="w-full"
            :placeholder="field.placeholder"
            :model-value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
            @blur="validateAsync(field.name)"
            :feedback="field.feedback || false"
            :disabled="disabled"
            toggleMask
        ></Password>
    </template>
    <template v-else-if="field.type === 'checkbox'">
        <div class="flex space-x-2">
            <Checkbox
                :binary="true"
                :inputId="fieldId"
                :model-value="Boolean(Number(modelValue))"
                @input="$emit('update:modelValue', Boolean($event))"
                @blur="validateAsync(field.name)"
                :disabled="disabled"
            />
            <label v-if="field.label" :for="fieldId" class="cursor-pointer label">{{ field.label }}</label>
        </div>
    </template>
    <template v-else-if="field.type === 'select_button'">
        <CustomSelectButton
            :field="field"
            :model-value="modelValue"
            @change="$emit('update:modelValue', $event)"
            :disabled="disabled"
        />
    </template>
    <template v-else-if="field.type === 'select_single' || field.type === 'dropdown'">
        <CustomDropdown
            :field="field"
            :model-value="modelValue"
            @change="$emit('update:modelValue', $event)"
            :disabled="disabled"
        />
    </template>
    <template v-else-if="field.type === 'select_multiple'">
        <CustomMultipleSelect
            class="w-full"
            :field="field"
            :model-value="modelValue"
            @change="$emit('update:modelValue', $event)"
            :disabled="disabled"
        />
    </template>
    <template v-else-if="field.type === 'select_tree'">
        <CustomTreeSelect
            :field="field"
            :model-value="modelValue"
            @change="$emit('update:modelValue', $event)"
            :disabled="disabled"
        />
    </template>
    <template v-else-if="field.type === 'checkbox_tree'">
        <CustomCheckboxTree
            :field="field"
            :model-value="modelValue"
            @change="$emit('update:modelValue', $event)"
            :disabled="disabled"
        />
    </template>
    <template v-else-if="field.type === 'tree'">
        <TreeViewItem
            :model-value="modelValue"
            @update:modelValue="$emit('update:modelValue', $event)"
            :field="field"
        />
    </template>
    <template v-else-if="field.type === 'radio_list'">
        <CustomRadioList
            class="mt-2"
            :field="field"
            :model-value="modelValue"
            @change="$emit('update:modelValue', $event)"
            :disabled="disabled"
        />
    </template>
    <template v-else-if="field.type === 'select_date'">
        <CustomSelectDate
            :field="field"
            :model-value="modelValue"
            @change="$emit('update:modelValue', $event)"
            :disabled="disabled"
        />
    </template>
    <template v-else-if="field.type === 'file_upload'">
        <InputUpload
            :field="field"
            :model-value="modelValue"
            @change="$emit('update:modelValue', $event)"
            :disabled="disabled"
        />
    </template>

    <template v-else-if="field.type === 'tags'">
        <CustomTags
            :field="field"
            :model-value="modelValue"
            @change="$emit('update:modelValue', $event)"
            :disabled="disabled"
        />
    </template>
</template>

<script>
import CustomCheckboxTree from '@Core/Components/Form/Custom/CustomCheckboxTree.vue'
import CustomDropdown from '@Core/Components/Form/Custom/CustomDropdown.vue'
import CustomEditor from '@Core/Components/Form/Custom/CustomEditor.vue'
import CustomMultipleSelect from '@Core/Components/Form/Custom/CustomMultipleSelect.vue'
import CustomRadioList from '@Core/Components/Form/Custom/CustomRadioList.vue'
import CustomSelectButton from '@Core/Components/Form/Custom/CustomSelectButton.vue'
import CustomSelectDate from '@Core/Components/Form/Custom/CustomSelectDate.vue'
import CustomTags from '@Core/Components/Form/Custom/CustomTags.vue'
import CustomTreeSelect from '@Core/Components/Form/Custom/CustomTreeSelect.vue'

import InputUpload from '@Core/Components/Form/InputUpload.vue'
import TreeViewItem from '@Core/Components/TreeViewItem.vue'

export default {
    props: ['field', 'modelValue', 'disabled'],
    emits: ['update:modelValue'],
    components: {
        CustomDropdown,
        CustomMultipleSelect,
        CustomRadioList,
        CustomSelectButton,
        CustomTreeSelect,
        CustomCheckboxTree,
        CustomSelectDate,
        CustomEditor,
        CustomTags,
        TreeViewItem,
        InputUpload,
    },
    computed: {
        fieldId() {
            return 'ID' + Math.random().toString(36).substr(2, 9).toUpperCase()
        },
    },

    created() {
        if ((this.modelValue === undefined || this.modelValue === null) && this.field.default !== undefined) {
            this.$emit('update:modelValue', this.field.default)
        }
    },
    methods: {
        validateAsync(name) {
            if (name && this.$parent.$parent.validateAsync) {
                if (name.includes('password')) {
                    return this.$parent.$parent.validateAsync('password', 'password_confirmation')
                }
                return this.$parent.$parent.validateAsync(name)
            }
        },
    },
}
</script>

<style lang="scss">
.p-input-icon-right > svg {
    right: 2px;
}
</style>
