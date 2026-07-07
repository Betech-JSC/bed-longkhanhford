<template>
    <Tiny
        api-key="kk8b71st8g7se8kra0do3fzsckuxv92i3y7p7onfzof65jwh"
        :init="{ ...initConfig, height: size }"
        :modelValue="modelValue"
        @update:modelValue="$emit('change', $event)"
    />
</template>

<script>
import templates from '@Core/templates'
import Tiny from '@tinymce/tinymce-vue'
const MAX_FILE_SIZE = 5

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
                plugins:
                    'template importcss searchreplace autolink autosave save image link media table lists wordcount charmap quickbars code fullscreen codesample code',
                quickbars_insert_toolbar: 'filemanager quicktable',
                menubar: 'file edit view insert format tools table',
                toolbar:
                    'undo redo formatselect bold italic forecolor template fullscreen link filemanager image alignleft aligncenter alignright alignjustify bullist numlist removeformat code',

                templates,
                toolbar_sticky: this.field?.size === 'lg',
                autosave_ask_before_unload: false,
                autosave_interval: '30s',
                autosave_prefix: '{path}{query}-{id}-',
                autosave_restore_when_empty: false,
                autosave_retention: '2m',
                image_advtab: true,
                height: 600,
                image_caption: true,
                quickbars_selection_toolbar: 'bold italic quicklink h2 h3 blockquote quickimage quicktable',
                noneditable_noneditable_class: 'mceNonEditable',
                toolbar_mode: 'sliding',
                contextmenu: 'link image imagetools table',
                skin: 'oxide',
                content_css: 'default',
                // content_style: "image { max-width: inherit; }",
                // content_css:
                //     "https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css",
                importcss_append: true,
                content_style: 'img { max-width: 100%; }',
                paste_data_images: true,
                convert_urls: false,
                images_dataimg_filter: function (img) {
                    return !img.hasAttribute('internal-blob')
                },
                images_upload_handler(blobInfo, progress) {
                    const data = new FormData()
                    const file = new File([blobInfo.blob()], blobInfo.filename())
                    data.append('files[]', file)
                    data.append('folder', window.location.pathname.split('/')[1])

                    return $axios.post(route('admin.files.store'), data).then((response) => {
                        if (response.status === 200) {
                            let path = response.data.successFiles[0]
                            return path.includes('/static/') ? path : '/static' + path
                        }
                    })
                },

                setup: function (editor) {
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
