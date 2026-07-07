<template>
    <div
        class="field"
        :class="{
            group: field.type !== 'file_upload',
        }"
    >
        <label
            v-if="fieldConfig.label && field.type !== 'checkbox'"
            :for="fieldId"
            class="flex items-center label"
        >
            <span>
                {{ fieldConfig.label }}
            </span>
            <small
                class="invisible ml-auto font-normal normal-case group-hover:visible"
                v-if="
                    !field.type ||
                    field.type === 'text' ||
                    field.type === 'textarea' ||
                    field.type === 'richtext'
                "
            >
                {{ charCount }} {{ tt('models.field.characters') }}, {{ wordCount }} {{ tt('models.field.words') }}
            </small>
        </label>
        <Input
            :id="fieldId"
            :class="{ 'p-invalid': !!fieldError }"
            v-bind="{ ...$props, ...$attrs }"
            v-model:field="fieldConfig"
            @update:modelValue="$emit('update:modelValue', $event)"
        />
        <small v-if="field.help" v-html="field.help" class="leading-4"></small>
        <small class="p-error" v-if="fieldError">
            {{ fieldError }}
        </small>
    </div>
</template>
<script>
export default {
    props: {
        field: {
            type: Object,
        },
        modelValue: {
            type: [Object, Array, Number, String, Boolean],
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ["update:modelValue"],
    computed: {
        fieldError() {
            return this.$parent.form?.errors[this.field.name];
        },
        fieldId() {
            return "ID" + Math.random().toString(36).substr(2, 9).toUpperCase();
        },
        fieldLabel() {
            if (this.field.label === false) return false;
            return (
                this.field.label ||
                this.tt(
                    "models." + this.currentResource + "." + this.field.name
                )
            );
        },
        wordCount() {
            if (typeof this.modelValue !== "string") return 0;
            return this.modelValue.trim().split(/\s+/).length;
        },
        charCount() {
            if (!this.modelValue) return 0;
            return this.modelValue.length;
        },
        currentResource() {
            return this.field.resource ?? this.getResource();
        },
    },
    data() {
        return {
            fieldConfig: this.field,
        };
    },
    watch: {
        field() {
            if (this.field.options) {
                this.fieldConfig.options = this.transformOptions(
                    this.field.options
                );
            }
            this.fieldConfig.label = this.fieldLabel;
        },
    },
    created() {
        if (this.field.source) {
            this.fieldConfig.loading = true;
            this.fetchSource();
        }

        if (this.field.options) {
            this.fieldConfig.options = this.transformOptions(
                this.field.options
            );
        }

        this.fieldConfig.label = this.fieldLabel;
    },
    methods: {
        fetchSource() {
            const locale = this.getCurrentLocale();
            this.$axios
                .post(
                    this.route("admin.helper.model-data", {
                        use_locale: locale,
                    }),
                    this.field.source
                )
                .then((res) => {
                    this.fieldConfig.options = this.transformOptions(res.data);
                    this.fieldConfig.loading = false;
                });
        },
        transformOptions(options) {
            if (!options) {
                return options;
            }
            const keyBy = this.field.keyBy || "id";
            return options.map((item) => {
                item[keyBy] = item[keyBy]?.toString();
                return item;
            });
        },
    },
};
</script>
