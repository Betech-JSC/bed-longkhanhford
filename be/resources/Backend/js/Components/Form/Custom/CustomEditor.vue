<template>
    <Tiny
        :init="{ ...initConfig, height: size }"
        :modelValue="modelValue"
        @update:modelValue="$emit('change', $event)"
    />
</template>

<script>
import Tiny from '@tinymce/tinymce-vue'

export default {
    components: {
        Tiny,
    },
    props: {
        modelValue: {
            type: String,
        },
        limit: {
            type: Number,
            default: 5000,
        },
        field: {
            type: Object,
        },
    },

    emits: ['change'],

    computed: {
        size() {
            return {
                sm: 260,
                md: 400,
                lg: 1000,
            }[this.field?.size ?? 'md']
        },
    },

    watch: {
        modelValue(value) {
            if (value == null) {
                this.$emit('change', '')
            }
        },
    },

    data() {
        return {
            initConfig: {
                base_url: '/tinymce', // Đường dẫn đến thư mục TinyMCE
                suffix: '.min', // Hậu tố file
                plugins:
                    'template importcss searchreplace autolink autosave save image link media table lists wordcount charmap quickbars code fullscreen codesample code',
                toolbar:
                    'undo redo formatselect bold italic forecolor template fullscreen link filemanager image alignleft aligncenter alignright alignjustify bullist numlist removeformat code',
                menubar: 'file edit view insert format tools table',
                skin: 'oxide', // Skin mặc định
                content_css: 'default', // Giao diện mặc định
                height: 600, // Chiều cao mặc định
                quickbars_insert_toolbar: 'filemanager quicktable',
                quickbars_selection_toolbar: 'bold italic quicklink h2 h3 blockquote quickimage quicktable',
                toolbar_mode: 'sliding',
                contextmenu: 'link image imagetools table',
                paste_data_images: true,
                convert_urls: false,
                images_dataimg_filter: function (img) {
                    return !img.hasAttribute('internal-blob')
                },
                images_upload_handler(blobInfo, progress) {
                    const data = new FormData()
                    const file = new File([blobInfo.blob()], blobInfo.filename())
                    data.append('files[]', file)

                    // Upload file lên server
                    return fetch('/upload', {
                        method: 'POST',
                        body: data,
                    })
                        .then((response) => response.json())
                        .then((result) => result.url) // Trả về URL hình ảnh
                },
                setup: function (editor) {
                    // Thêm nút File Manager
                    editor.ui.registry.addButton('filemanager', {
                        icon: 'gallery',
                        tooltip: 'File Manager',
                        onAction: () =>
                            editor.windowManager.openUrl({
                                title: 'File Manager',
                                url: `/admin/files?embed=true&select-multiple=true`,
                                height: 640,
                                width: 1000,
                            }),
                    })
                },
                codesample_languages: [
                    { text: 'HTML/XML', value: 'markup' },
                    { text: 'JavaScript', value: 'javascript' },
                    { text: 'CSS', value: 'css' },
                    { text: 'PHP', value: 'php' },
                    { text: 'Ruby', value: 'ruby' },
                    { text: 'Python', value: 'python' },
                    { text: 'Java', value: 'java' },
                    { text: 'C', value: 'c' },
                    { text: 'C#', value: 'csharp' },
                    { text: 'C++', value: 'cpp' },
                    { text: 'Go', value: 'protobuf' },
                    { text: 'Bash', value: 'bash' },
                ],
                codesample_global_prismjs: true,
                content_style: 'img { max-width: 100%; }',
                autosave_ask_before_unload: false,
                autosave_interval: '30s',
                autosave_retention: '2m',
            },
        }
    },
}
</script>

<style lang="scss">
.tox-tinymce {
    border-radius: 3px !important;
    border: 1px solid rgb(206 212 218) !important;
}
.tox-statusbar__branding {
    display: none !important;
}
.tox-dialog {
    width: 90vw !important;
    max-width: 90vw !important;
    height: 90vh !important;
    max-height: 90vh !important;
}
.tox .tox-dialog__footer {
    margin-bottom: 30px !important;
}
.tox:not(.tox-tinymce-inline) .tox-editor-header {
    box-shadow: none !important;
    border-bottom: 1px solid rgb(206 212 218) !important;
}
.tox .tox-mbtn {
    height: 20px !important;
    margin: 0px !important;
    width: unset !important;
}
.tox .tox-mbtn__select-label {
    margin: 0px !important;
    font-size: 12px !important;
}
.mce-content-body {
    padding: 1rem !important;
}
</style>
