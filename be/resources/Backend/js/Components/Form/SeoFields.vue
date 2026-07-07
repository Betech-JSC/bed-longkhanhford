<template>
    <div class="card">
        <div class="card-body">
            <Field
                v-model="modelValue.seo_meta_title"
                :field="{
                    name: 'seo_meta_title',
                    label: 'Meta Title',
                }"
            />
            <Field
                v-model="modelValue.seo_meta_description"
                :field="{
                    name: 'seo_meta_description',
                    label: 'Meta Description',
                    type: 'textarea',
                }"
            />
            <details>
                <summary>
                    <span class="select-none link">{{ tt('models.form.meta_summary') }}</span>
                </summary>
                <div class="p-3 mt-4 space-y-4 bg-gray-100 rounded-sm">
                    <Field
                        v-if="!hideField('seo_slug')"
                        :modelValue="modelValue.seo_slug"
                        @update:modelValue="
                            modelValue.seo_slug = slugify($event);
                            $emit('update:modelValue', modelValue);
                        "
                        :field="{
                            name: 'seo_slug',
                            label: 'Custom Slug',
                        }"
                    />
                    <Field
                        v-model="modelValue.seo_meta_keywords"
                        :field="{
                            name: 'seo_meta_keywords',
                            label: 'Meta Keywords',
                        }"
                    />
                    <Field
                        v-model="modelValue.seo_meta_robots"
                        :field="{
                            name: 'seo_meta_robots',
                            label: 'Meta Robots',
                        }"
                    />
                    <Field
                        v-model="modelValue.seo_canonical"
                        :field="{
                            name: 'seo_canonical',
                            label: 'Canonical Link',
                        }"
                    />
                    <Field
                        v-model="modelValue.seo_image"
                        :field="{
                            name: 'seo_image',
                            label: 'Meta Image',
                        }"
                    />
                </div>
            </details>
        </div>
    </div>
    <div
        class="card"
        v-if="
            !hideField('inject_head') ||
            !hideField('inject_body_start') ||
            !hideField('inject_body_end')
        "
    >
        <div class="card-body">
            <Field
                v-model="modelValue.inject_head"
                :field="{
                    rows: 10,
                    type: 'textarea',
                    name: 'inject_head',
                }"
            />
            <Field
                v-model="modelValue.inject_body_start"
                :field="{
                    rows: 10,
                    type: 'textarea',
                    name: 'inject_body_start',
                }"
            />
            <Field
                v-model="modelValue.inject_body_end"
                :field="{
                    rows: 10,
                    type: 'textarea',
                    name: 'inject_body_end',
                }"
            />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: {
            type: Object,
            default: () => ({}),
        },
        config: {
            type: Object,
            default: () => ({
                hiddenFields: [
                    "inject_head",
                    "inject_body_start",
                    "inject_body_end",
                ],
            }),
        },
    },
    emits: ["update:modelValue"],
    methods: {
        hideField(name) {
            return this.config?.hiddenFields.includes(name);
        },
        slugify(str, separator = "-") {
            return str
                .toLowerCase()
                .replace(/\t/g, "")
                .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
                .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
                .replace(/ì|í|ị|ỉ|ĩ/g, "i")
                .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
                .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
                .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
                .replace(/đ/g, "d")
                .replace(/\s+/g, separator)
                .replace(/[^A-Za-z0-9_-]/g, "")
                .replace(/-+/g, separator);
        },
    },
};
</script>
