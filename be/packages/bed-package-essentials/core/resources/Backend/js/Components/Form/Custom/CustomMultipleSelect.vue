<template>
    <MultiSelect
        :model-value="selectedOptions"
        @change="selectChange($event.value)"
        :options="options"
        :loading="field.loading"
        :placeholder="placeholder"
        :optionLabel="labelBy"
        display="chip"
        :filter="field.filter || true"
        :filterFields="['filter', labelBy, keyBy].concat(filterBy)"
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
        filterBy() {
            return this.field.filterBy || [];
        },
        placeholder() {
            return (
                this.field.placeholder ||
                `${this.tt("models.field.choose")} ${this.field.label}`
            );
        },
        options() {
            let options = [];
            this.field.options?.forEach((value) => {
                let option = {
                    [this.keyBy]: value[this.keyBy].toString(),
                    [this.labelBy]: value[this.labelBy].toString(),
                    filter: this.slugify(value[this.labelBy]),
                };

                for (const key of this.filterBy) {
                    option[key] = value[key];
                }

                options.push(option);
            });
            return options;
        },
        selectedOptions() {
            if (!this.modelValue) return [];

            const selectedIds = this.modelValue.map((option) => {
                if (typeof option === "object") {
                    return option[this.keyBy].toString();
                } else {
                    return option;
                }
            });

            const sortedOptions = this.options
                .filter((x) => selectedIds.includes(x[this.keyBy]))
                .sort((a, b) => {
                    const indexA = selectedIds.indexOf(
                        a[this.keyBy].toString()
                    );
                    const indexB = selectedIds.indexOf(
                        b[this.keyBy].toString()
                    );
                    return indexA - indexB;
                });

            return sortedOptions;
        },
    },

    methods: {
        selectChange(value) {
            this.$emit("change", value);
        },
        slugify(str) {
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
                .replace(/[^A-Za-z0-9_-]/g, " ")
                .replace(/\s+/g, " ");
        },
    },
};
</script>
