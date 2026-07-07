<template>
    <template v-if="multiple">
        <div class="grid gap-3" :class="itemsPerRow">
            <div
                class="relative flex items-center col-span-1 overflow-hidden rounded-sm bg-gray-50 group  aspect-[1/1]"
                v-for="(file, index) in files"
                :key="index"
            >
                <div
                    class="absolute inset-0 transition-opacity duration-200 bg-white opacity-0 group-hover group-hover:opacity-50"
                ></div>

                <Thumbnail :file="file" @remove="removeSelectedFiles(index)" />
            </div>
            <div
                class="relative col-span-1 group"
                v-if="files.length < maxItems && canAddFile"
            >
                <div
                    class="overflow-hidden text-gray-400 transition-colors duration-200 border border-gray-200 border-dashed rounded cursor-pointer select-none hover:border-gray-400 hover:text-gray-600 aspect-[1/1]"
                    @click="showMediaManager = true"
                >
                    <div class="flex items-center justify-center h-full">
                        <ph-plus class="w-8 h-8" />
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        <template v-if="Array.isArray(files) && files.length > 0">
            <div
                class="relative flex items-center h-full max-w-xs overflow-hidden border rounded-sm bg-gray-50 group"
            >
                <Thumbnail :file="files[0]" @remove="removeSelectedFiles" />
            </div>
        </template>
        <template v-else>
            <div
                class="relative w-full h-full max-w-xs p-3 text-gray-700 transition-colors duration-200 rounded-sm cursor-pointer select-none bg-gray-50 hover:bg-gray-200 hover:text-gray-900"
                @click="showMediaManager = true"
            >
                <div
                    class="flex flex-col items-center justify-center w-full h-full py-4 space-y-2 text-xs font-medium text-center text-gray-600 border border-gray-400 border-dashed"
                >
                    <span>{{ tt('models.files.input_upload') }}</span>
                </div>
            </div>
        </template>
    </template>
    <FileManager
        v-if="showMediaManager"
        v-model:show="showMediaManager"
        @onSelect="onSelect"
        :multiple="multiple"
    />

    <Dialog
        header="Folder"
        v-model:visible="showFileModal"
        :breakpoints="{
            '960px': '75vw',
            '640px': '90vw',
        }"
        :style="{ width: '50vw' }"
        :draggable="false"
    >
        <div class="space-y-6">
            <div>
                <label
                    class="block mb-2 font-semibold tracking-wide text-gray-700 font-display"
                >
                    URL
                </label>
                <input
                    v-model="showFileModal.link"
                    type="text"
                    class="block w-full py-[0.5rem] px-[1rem] border border-gray-300 focus:border-solid focus:outline-none focus:ring-0 rounded"
                />
            </div>
            <template v-if="showFileModal.options">
                <template v-for="(option, field) in showFileModal.options">
                    <div>
                        <label
                            class="block mb-2 font-semibold tracking-wide text-gray-700 font-display"
                        >
                            {{ field }}
                        </label>
                        <input
                            v-model="showFileModal.options[field]"
                            type="text"
                            class="block w-full py-[0.5rem] px-[1rem] border border-gray-300 focus:border-solid focus:outline-none focus:ring-0 rounded"
                        />
                    </div>
                </template>
            </template>
        </div>

        <template #footer>
            <Button variant="white" @click="showFileModal = null" :label="tt('models.files.cancel')" />
            <Button
                type="button"
                class="ml-2"
                @click="editFileUpdate"
                :label="tt('models.files.save')"
            />
        </template>
    </Dialog>
</template>

<script>
import FileManager from "@Core/Components/FileManager.vue";
import Thumbnail from "@Core/Components/Thumbnail.vue";

export default {
    components: {
        FileManager,
        Thumbnail,
    },

    props: ["field", "modelValue"],
    emits: ["change"],

    data() {
        return {
            files: [],
            showMediaManager: false,
            showFileModal: null,
        };
    },

    computed: {
        urlOnly() {
            return this.field?.urlOnly ?? false;
        },
        multiple() {
            return this.field?.multiple ?? false;
        },
        accept() {
            return (
                this.field.accept ??
                "image/png, image/gif, image/jpeg ,image/webp"
            );
        },
        itemsPerRow() {
            return this.field.perRow ?? "grid-cols-4";
        },
        maxItems() {
            return this.field.max || 99;
        },
        expectedUrl() {
            return this.field.expected ?? false;
        },
        canAddFile() {
            return this.field.canAddFile ?? true;
        },
    },

    watch: {
        modelValue() {
            this.files = [];
            this.initFiles();
        },
    },

    created() {
        this.initFiles();
    },

    methods: {
        chosenImage(file) {
            this.$bus.emit("SelectedImage", file);
        },
        initFiles() {
            if (this.urlOnly) {
                if (this.multiple) {
                    this.files = Array.isArray(this.modelValue) ? this.modelValue.map(function (url) {
                        return {
                            static_url: url,
                            path: url,
                        };
                    }) : [];
                } else if (
                    !this.multiple &&
                    this.modelValue !== null &&
                    this.modelValue !== undefined &&
                    Object.keys(this.modelValue).length
                ) {
                    this.files = [{
                        static_url: this.modelValue,
                        path: this.modelValue,
                    }];
                }
            } else {
                if (this.multiple) {
                    this.files = Array.isArray(this.modelValue) ? this.modelValue : [];
                } else if (
                    !this.multiple &&
                    this.modelValue !== null &&
                    this.modelValue !== undefined &&
                    Object.keys(this.modelValue).length
                ) {
                    this.files = [this.modelValue];
                }
            }
        },
        onSelect(files) {
            if (this.multiple) {
                const selectedFiles = this.pluck(this.files, "path");
                const diffFiles = files.filter(
                    (x) => !selectedFiles.includes(x.path)
                );

                this.files = this.files.concat(diffFiles);
                this.files = this.files.slice(0, this.maxItems);
            } else {
                this.files = files;
            }
            if (this.urlOnly) {
                if (this.multiple) {
                    this.$emit("change", pluck(this.files, "static_url"));
                } else {
                    this.$emit("change", this.files[0]?.static_url);
                }
            } else {
                if (this.multiple) {
                    this.$emit("change", this.files);
                } else {
                    this.$emit("change", this.files[0]);
                }
            }
        },
        editFileUpdate() {
            const index = this.files.findIndex(
                (x) => x.url === this.showFileModal.url
            );
            this.files[index] = this.showFileModal;
            this.showFileModal = null;
            this.$emit("change", this.files);
        },
        removeSelectedFiles(index = 0) {
            this.files.splice(index, 1);
            if (this.multiple) {
                if (this.urlOnly) {
                    this.$emit("change", this.files.map(x => x.static_url));
                } else {
                    this.$emit("change", this.files);
                }
            } else {
                this.$emit("change", null);
            }
        },
    },
};
</script>
