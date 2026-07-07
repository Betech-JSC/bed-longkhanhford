<template>
    <div class="fixed top-0 bottom-0 right-0 z-50 overflow-hidden bg-white" v-show="show"
        :class="embed ? 'left-0 overflow-auto' : 'left-from-sidebar'"
        :style="{ '--sidebar-width': sidebarWidth + 'px' }">
        <input type="file" class="hidden"
            accept="image/png, image/gif, image/jpeg, image/svg+xml, application/pdf, image/webp, video/mp4, video/x-m4v, video/*" multiple="true"
            ref="file" @change="fileChange" />
        <input type="file" class="hidden" webkitdirectory directory multiple ref="folderInput" @change="folderInputChange" />
        <div class="topbar" v-if="!embed">
            <h1 class="flex items-center font-semibold text-gray-700">
                <div class="p-4 -ml-4 cursor-pointer hover:text-gray-900" @click="$emit('update:show', false)"
                    v-if="selectable">
                    <ph-caret-left />
                </div>
                {{ tt('models.files.file_manager') }}
            </h1>
            <div class="flex ml-auto space-x-3">
                <input type="text" :placeholder="tt('models.files.input_file')"
                    class="flex-inline w-[400px] py-[0.5rem] px-[1rem] border border-gray-300 focus:border-solid focus:outline-none focus:ring-0 rounded hover:border-gray-400 focus:border-gray-500"
                    @input="onChange" />
                <Button v-if="currentPath !== '/'" @click.prevent="openFolderModal('rename')" class="space-x-2 btn-outline-primary">
                    <ph-pencil-simple-line-light />
                    <span> {{ tt('models.files.rename_folder') || 'Đổi tên' }} </span>
                </Button>
                <Button @click.prevent="openFolderModal('create')" class="space-x-2 btn-outline-primary">
                    <ph-plus-circle-light />
                    <span> {{ tt('models.files.add_folder') }} </span>
                </Button>
                <Button @click="deleteFolder" class="space-x-2 btn-outline-primary">
                    <carbon:subtract-alt />
                    <span> {{ tt('models.files.delete_folder') }} </span>
                </Button>
                <Button @click.prevent="browseFolder" class="space-x-2 btn-outline-primary">
                    <ph-folder-open-light />
                    <span> {{ tt('models.files.select_folder') || 'Chọn thư mục' }} </span>
                </Button>
                <Button @click.prevent="browse" class="space-x-2 btn-primary">
                    <ph:upload-simple />
                    <span> {{ tt('models.files.select_file') }} </span>
                </Button>
            </div>
        </div>
        <div class="flex items-stretch flex-1 h-full overflow-hidden" @dragover.prevent="isDragging = true">
            <div class="fixed inset-0 overflow-hidden border-4 border-dashed before:absolute before:bg-green-300 before:bg-opacity-25 before:inset-0 before:z-10 left-from-sidebar"
                :class="isDragging
                        ? 'z-10 border-green-300 before:visible visible'
                        : 'z-0 border-transparent before:invisible invisible'
                    " @dragleave.prevent="isDragging = false"
                @drop.prevent="; (isDragging = false), (dragCounter = 0), drop($event)"></div>

            <!-- Details sidebar -->
            <aside 
                ref="sidebarAside"
                class="hidden p-4 pb-16 overflow-y-auto bg-white border-l border-r border-gray-200 md:block relative shrink-0"
                :style="{ width: sidebarWidth + 'px' }"
            >
                <div 
                    @mousedown="startResize" 
                    class="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-emerald-500/30 active:bg-emerald-600 transition-colors z-30 select-none group"
                    title="Kéo để thay đổi độ rộng"
                >
                    <div class="w-[1.5px] h-full bg-gray-200 group-hover:bg-emerald-500 mx-auto transition-colors"></div>
                </div>
                <template v-if="embed">
                    <Button @click.prevent="browse" class="w-full space-x-2 btn-primary">
                        <ph:upload-simple />
                        <span> {{ tt('models.files.select_file') }} </span>
                    </Button>
                    <hr class="my-2" />
                </template>
                <Field v-if="tree && Object.keys(tree).length > 0" :field="{
                    key: 'FileManager',
                    label: false,
                    type: 'tree',
                    maxLevel: 10,
                    expandDefaultLevel: 3,
                    keyBy: 'slug',
                    labelBy: 'name',
                    childrenBy: 'children',
                    options: tree,
                    draggable: false,
                }" />
            </aside>
            <main class="overflow-y-auto grow group-image-admin flex flex-col">
                <!-- Breadcrumbs -->
                <div class="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center flex-wrap gap-1.5 text-xs text-gray-500 sm:px-6 lg:px-8 shrink-0 select-none">
                    <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.path">
                        <span v-if="idx > 0" class="text-gray-300">/</span>
                        <button 
                            type="button"
                            @click="selectedItem({ path: crumb.path })"
                            class="hover:text-emerald-600 hover:underline font-medium transition cursor-pointer border-0 bg-transparent p-0 text-xs flex items-center"
                            :class="idx === breadcrumbs.length - 1 ? 'text-gray-800 font-semibold pointer-events-none' : 'text-gray-400'"
                        >
                            {{ crumb.name }}
                        </button>
                    </template>
                </div>

                <!-- Toolbar for filters and sorting -->
                <div class="sticky top-0 z-20 px-4 py-3 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-4 sm:px-6 lg:px-8">
                    <!-- Type filters (tabs/pills) -->
                    <div class="flex items-center space-x-1.5 overflow-x-auto">
                        <button v-for="t in types" :key="t.value"
                            @click="selectType(t.value)"
                            type="button"
                            class="px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all duration-150 flex items-center space-x-1"
                            :class="currentType === t.value 
                                ? 'bg-black text-white border-black shadow-sm' 
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'"
                        >
                            <span v-if="t.icon" class="mr-1 text-xs">{{ t.icon }}</span>
                            <span>{{ t.label }}</span>
                        </button>
                    </div>

                    <!-- Sorting and Search in Embed -->
                    <div class="flex items-center space-x-3 ml-auto">
                        <!-- Search for embed mode -->
                        <div v-if="embed" class="w-48 sm:w-64">
                            <input type="text" :placeholder="tt('models.files.input_file')"
                                v-model="searchVal"
                                class="w-full py-1.5 px-3 text-xs border border-gray-300 focus:border-solid focus:outline-none focus:ring-0 rounded hover:border-gray-400 focus:border-gray-500"
                                @input="onChange" />
                        </div>

                        <!-- Select all button -->
                        <Button v-if="(!selectable || canSelectMultiple) && searchFiles.length" @click="toggleSelectAll" class="space-x-1.5 btn-outline-secondary btn-xs flex items-center">
                            <component :is="isAllSelected ? 'ph-minus-square-light' : 'ph-check-square-light'" class="w-3.5 h-3.5 mr-1" />
                            <span>{{ isAllSelected ? 'Bỏ chọn hết' : 'Chọn tất cả' }}</span>
                        </Button>

                        <div class="flex items-center space-x-2">
                            <span class="text-xs font-medium text-gray-500 whitespace-nowrap">Sắp xếp:</span>
                            <select v-model="currentSort" @change="onSortChange"
                                class="text-xs py-1.5 pl-2.5 pr-8 border border-gray-300 rounded focus:border-solid focus:outline-none focus:ring-0 focus:border-gray-500 hover:border-gray-400 bg-white">
                                <option v-for="s in sorts" :key="s.value" :value="s.value">{{ s.label }}</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Trạng thái trống (No Data) -->
                <div v-if="!Object.keys(searchFiles).length && !loading" class="flex flex-col items-center justify-center flex-1 p-12 text-center">
                    <div class="p-6 mb-4 bg-gray-50 rounded-full">
                        <ph:folder-open-light class="w-16 h-16 text-gray-300" />
                    </div>
                    <h3 class="text-xl font-medium text-gray-900">
                        {{ tt('models.files.no_data') || 'Thư mục này hiện không có dữ liệu' }}
                    </h3>
                    <p class="mt-2 text-sm text-gray-500 max-w-xs">
                        {{ tt('models.files.empty_hint') || 'Hãy kéo thả file vào trình duyệt hoặc bấm nút "Chọn file" để bắt đầu tải dữ liệu lên.' }}
                    </p>
                    
                    <div class="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <Button @click.prevent="browse" class="space-x-2 btn-primary">
                            <ph:upload-simple />
                            <span> {{ tt('models.files.select_file') }} </span>
                        </Button>

                        <Button v-if="canDeleteFolder" @click.prevent="openFolderModal('rename')" class="space-x-2 btn-outline-primary">
                            <ph-pencil-simple-line-light />
                            <span> {{ tt('models.files.rename_folder') || 'Đổi tên' }} </span>
                        </Button>
                        
                        <Button v-if="canDeleteFolder" @click="deleteFolder" class="space-x-2 btn-outline-danger">
                            <carbon:subtract-alt />
                            <span> {{ tt('models.files.delete_folder') }} </span>
                        </Button>
                    </div>
                </div>

                <!-- Danh sách file -->
                <div v-if="Object.keys(searchFiles).length"
                    class="px-4 pt-8 pb-16 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8">
                    <ul role="list" class="grid grid-cols-3 gap-4 lg:grid-cols-4 2xl:grid-cols-6">
                        <li class="relative" v-if="data" v-for="(file, index) in searchFiles" :key="file.id || file.static_url || file.path || index">
                            <div class="group w-full rounded bg-gray-100 overflow-hidden aspect-[1/1] flex cursor-pointer justify-center items-center border border-transparent hover:border-gray-400 relative outline outline-offset-2 outline-2"
                                :class="selectedFiles.includes(file) ? 'outline-black' : 'outline-transparent'"
                                @click="onSelect(file)"
                                @dblclick="openLightbox(file)">
                                <Thumbnail :file="file" @remove="onRemove(file)" @copy="copyUrl" />
                            </div>
                            <p class="block mt-2 text-sm font-medium text-gray-900 truncate pointer-events-none">
                                {{ file.filename }}
                            </p>
                            <p class="block space-x-1 text-xs font-medium text-gray-500 pointer-events-none">
                                <span class="uppercase">
                                    {{ file.extension }}
                                </span>
                                <span>•</span>
                                <span>
                                    {{ file.formatted_file_size }}
                                </span>
                            </p>
                        </li>
                    </ul>

                    <Pagination v-if="data" :links="data.links" @changePage="getFiles($event)" />
                </div>
            </main>
        </div>
        <div
            v-if="selectedFiles.length > 0"
            class="absolute bottom-0 left-0 right-0 flex items-center justify-center w-full h-16 space-x-2 bg-white border-t border-gray-200 shadow-lg"
        >
            <span class="mr-4 text-sm font-medium text-gray-700">
                {{ selectedFiles.length }} {{ tt('models.table_list.files').toLowerCase() }} Đã chọn
            </span>
            <Button @click="selectedFiles = []" class="btn-outline-secondary"> {{ tt('models.files.unchecked') }} </Button>
            <Button v-if="selectedFiles.length === 1" @click="copyUrl(selectedFiles[0])" class="btn-outline-primary">
                <ph:link-light class="mr-1" />
                Sao chép liên kết
            </Button>
            <Button class="btn-danger" @click="deleteSelected()">
                <ph:trash-light class="mr-1" />
                {{ tt('models.files.delete') }}
            </Button>
            <Button v-if="selectable || selectMultiple" class="btn-primary" @click="submitFileSelect()"> {{ tt('models.files.select') }} ({{ selectedFiles.length }}) </Button>
        </div>
        <Dialog :header="folderModalMode === 'create' ? tt('models.files.add_folder') : tt('models.files.rename_folder')" v-model:visible="showFolderModal" :breakpoints="{
            '960px': '75vw',
            '640px': '90vw',
        }" :style="{ width: '50vw' }" :draggable="false">
            <Field v-model="folderForm.name" :field="{
                rules: 'required',
                name: 'name',
                label: tt('models.files.folder_name')
            }" />
            <template #footer>
                <Button variant="white" @click="showFolderModal = false" :label="tt('models.files.cancel')" />
                <Button type="button" class="ml-2" @click="submitFolderForm"
                    :label="tt('models.files.save')" />
            </template>
        </Dialog>

        <!-- Lightbox Preview Modal -->
        <div v-if="lightboxVisible && lightboxFile" 
            class="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm transition-opacity duration-300"
            @click.self="closeLightbox"
            tabindex="0"
            @keydown.esc="closeLightbox"
            @keydown.left="prevLightbox"
            @keydown.right="nextLightbox"
            ref="lightboxContainer"
        >
            <!-- Close Button -->
            <button @click="closeLightbox" 
                class="absolute top-4 right-4 z-[10000] p-2 text-gray-400 hover:text-white transition-colors duration-150 bg-gray-900 bg-opacity-50 hover:bg-opacity-80 rounded-full">
                <ph:x-light class="w-6 h-6" />
            </button>

            <!-- Navigation Arrows -->
            <button v-if="hasMultiplePreviewItems" @click="prevLightbox" 
                class="absolute left-4 z-[10000] p-3 text-gray-400 hover:text-white transition-colors duration-150 bg-gray-900 bg-opacity-50 hover:bg-opacity-80 rounded-full">
                <ph:caret-left-light class="w-8 h-8" />
            </button>
            <button v-if="hasMultiplePreviewItems" @click="nextLightbox" 
                class="absolute right-4 z-[10000] p-3 text-gray-400 hover:text-white transition-colors duration-150 bg-gray-900 bg-opacity-50 hover:bg-opacity-80 rounded-full">
                <ph:caret-right-light class="w-8 h-8" />
            </button>

            <!-- Main Display Area -->
            <div class="flex flex-col md:flex-row w-full h-full max-w-7xl max-h-[85vh] p-4 md:p-8 items-center justify-center gap-6" @click.stop>
                <!-- Media Wrapper -->
                <div class="flex-1 flex items-center justify-center h-full max-h-[60vh] md:max-h-full relative select-none">
                    <video v-if="isVideo(lightboxFile.static_url)" 
                        controls autoplay class="max-w-full max-h-full rounded shadow-2xl object-contain">
                        <source :src="lightboxFile.static_url" type="video/mp4" />
                    </video>
                    <img v-else :src="lightboxFile.static_url" 
                        class="max-w-full max-h-full rounded shadow-2xl object-contain transition-transform duration-200"
                        alt="Preview image" />
                </div>

                <!-- Info Sidebar (Glassmorphic Detail Panel) -->
                <div class="w-full md:w-80 bg-gray-900 bg-opacity-85 backdrop-blur-md rounded-lg p-5 text-gray-200 border border-gray-800 flex flex-col justify-between max-h-[30vh] md:max-h-full overflow-y-auto">
                    <div>
                        <h3 class="text-base font-semibold text-white truncate mb-4" :title="lightboxFile.filename">
                            {{ lightboxFile.filename }}
                        </h3>
                        <div class="space-y-2.5 text-xs text-gray-400">
                            <div class="flex justify-between border-b border-gray-800 pb-1.5">
                                <span>Định dạng:</span>
                                <span class="font-medium text-white uppercase">{{ lightboxFile.extension }}</span>
                            </div>
                            <div class="flex justify-between border-b border-gray-800 pb-1.5">
                                <span>Dung lượng:</span>
                                <span class="font-medium text-white">{{ lightboxFile.formatted_file_size }}</span>
                            </div>
                            <div class="flex justify-between border-b border-gray-800 pb-1.5">
                                <span>Ngày cập nhật:</span>
                                <span class="font-medium text-white">{{ toDate(lightboxFile.last_modified * 1000) || '-' }}</span>
                            </div>
                            <div class="flex flex-col space-y-1 pt-1.5">
                                <span>Đường dẫn tệp:</span>
                                <span class="font-mono text-[10px] text-gray-500 break-all select-all p-1.5 bg-black bg-opacity-50 rounded">{{ staticUrl(lightboxFile.static_url) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex flex-col space-y-2">
                        <Button @click="copyUrl(lightboxFile)" class="w-full space-x-2 btn-primary btn-sm flex items-center justify-center">
                            <ph:copy-light class="w-4 h-4 mr-1" />
                            <span>Sao chép liên kết</span>
                        </Button>
                        <a :href="lightboxFile.static_url" download 
                            class="w-full space-x-2 btn-outline-secondary btn-sm flex items-center justify-center text-center text-xs py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium border border-gray-700 transition-colors">
                            <ph:download-light class="w-4 h-4 mr-1" />
                            <span>Tải xuống tệp</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div v-show="loading" class="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-70" :class="embed ? '' : 'left-from-sidebar'">
            <div class="flex flex-col items-center">
                <svg class="w-12 h-12 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="mt-4 font-medium text-gray-700">{{ tt('models.table.loading') }}</span>
            </div>
        </div>
    </div>
</template>
<script>
import Pagination from '@Core/Components/Pagination.vue'
import Thumbnail from '@Core/Components/Thumbnail.vue'
import { onMounted, onUnmounted } from 'vue'

const MAX_SIZE_OF_IMAGE = 20
const MAX_SIZE_OF_VIDEO = 200

export default {
    components: { Thumbnail, Pagination },
    props: {
        show: {
            default: false,
        },
        multiple: {
            default: false,
        },
        selectable: {
            default: true,
        },
    },

    setup(props, { emit }) {
        const close = () => {
            emit('update:show', false)
        }

        const closeOnEscape = (e) => {
            if (e.key === 'Escape' && props.show) {
                close()
            }
        }

        onMounted(() => document.addEventListener('keydown', closeOnEscape))
        onUnmounted(() => {
            document.removeEventListener('keydown', closeOnEscape)
        })

        return {
            close,
        }
    },

    data() {
        return {
            sidebarWidth: 288,
            isResizing: false,
            uploadingFiles: [],
            selectedFiles: [],
            isDragging: false,
            timer: null,
            timerScoll: null,
            data: {
                tree: [],
                directories: [],
                files: [],
            },
            tree: [],
            currentPath: '/',
            showFolderModal: false,
            folderModalMode: 'create', // create or rename
            folderForm: {
                name: null,
            },
            search: null,
            embed: this.$page.props.route.query.embed,
            selectMultiple: this.$page.props.route.query['select-multiple'] == 'true',
            limit: 50,
            page: 1,
            fetchData: true,
            loading: false,
            currentType: 'all',
            currentSort: 'date_desc',
            searchVal: '',
            types: [
                { value: 'all', label: 'Tất cả', icon: '📂' },
                { value: 'image', label: 'Hình ảnh', icon: '🖼️' },
                { value: 'video', label: 'Video', icon: '🎥' },
                { value: 'document', label: 'Tài liệu', icon: '📄' },
                { value: 'other', label: 'Khác', icon: '⚙️' }
            ],
            sorts: [
                { value: 'date_desc', label: 'Mới nhất' },
                { value: 'date_asc', label: 'Cũ nhất' },
                { value: 'name_asc', label: 'Tên A-Z' },
                { value: 'name_desc', label: 'Tên Z-A' },
                { value: 'size_desc', label: 'Dung lượng lớn' },
                { value: 'size_asc', label: 'Dung lượng nhỏ' }
            ],
            lightboxVisible: false,
            lightboxFile: null,
            lightboxIndex: -1,
        }
    },

    created() {
        this.getFiles()
    },

    mounted() {
        this.$bus.on('treeSelectedItemFileManager', (item) => {
            this.selectedItem(item)
        })

        let images = document.querySelector('.group-image-admin')

        images.addEventListener('scroll', () => {
            if (this.timerScoll) {
                clearTimeout(this.timerScoll)
                this.timerScoll = null
            }

            if (this.fetchData) {
                this.timerScoll = setTimeout(this.scrollImage, 300)
            }
        })
    },

    unmounted() {
        let images = document.querySelector('.group-image-admin')

        if (images) {
            images.removeEventListener('scroll', this.scrollImage)
        }
    },

    beforeDestroy() {
        this.$bus.off('treeSelectedItemFileManager')
    },

    watch: {
        show(value) {
            if (value && (!this.tree || !this.tree.length)) {
                this.getFiles()
            }
        },
    },

    computed: {
        breadcrumbs() {
            const path = this.currentPath || '/';
            if (path === '/') return [{ name: 'Root', path: '/' }];
            
            const parts = path.split('/').filter(Boolean);
            const list = [{ name: '📁 Root', path: '/' }];
            let accumulated = '';
            
            parts.forEach((part) => {
                accumulated += '/' + part;
                list.push({
                    name: part,
                    path: accumulated
                });
            });
            
            return list;
        },
        searchFiles() {
            if (!this.data || !this.data.files) return []
            return Array.isArray(this.data.files) ? this.data.files : Object.values(this.data.files)
        },
        canDeleteFolder() {
            if (!this.data) return false
            const files = Array.isArray(this.data.files) ? this.data.files : Object.values(this.data.files || {})
            const fileCount = files.length
            const dirCount = Array.isArray(this.data.directories) ? this.data.directories.length : Object.keys(this.data.directories || {}).length

            return fileCount === 0 && dirCount === 0 && this.currentPath !== '/'
        },
        canSelectMultiple() {
            return this.multiple || this.selectMultiple
        },
        previewableFiles() {
            return this.searchFiles
        },
        hasMultiplePreviewItems() {
            return this.previewableFiles.length > 1
        },
        isAllSelected() {
            const files = this.searchFiles || []
            if (!files.length) return false
            return files.every(file => this.selectedFiles.includes(file))
        },
    },

    methods: {
        startResize(e) {
            this.isResizing = true;
            document.addEventListener('mousemove', this.resizeSidebar);
            document.addEventListener('mouseup', this.stopResize);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        },
        resizeSidebar(e) {
            if (!this.isResizing) return;
            const aside = this.$refs.sidebarAside;
            if (aside) {
                const rect = aside.getBoundingClientRect();
                const newWidth = e.clientX - rect.left;
                if (newWidth >= 180 && newWidth <= 600) {
                    this.sidebarWidth = newWidth;
                }
            }
        },
        stopResize() {
            this.isResizing = false;
            document.removeEventListener('mousemove', this.resizeSidebar);
            document.removeEventListener('mouseup', this.stopResize);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        },
        scrollImage() {
            this.page = this.page + 1
            this.getFiles({ page: this.page })
        },
        selectedItem(item) {
            this.currentPath = item.path
            this.data.files = []
            this.search = null
            this.page = 1
            this.fetchData = true
            this.getFiles()
        },
        getFiles(params = {}, loadTree = false) {
            const isFirstPage = !params.page || params.page === 1
            if (isFirstPage) {
                this.page = 1
                this.fetchData = true
            }

            if (this.fetchData) {
                const requestParams = {
                    page: this.page,
                    limit: this.limit,
                    search: this.search,
                    path: this.currentPath,
                    type: this.currentType,
                    sort: this.currentSort,
                    ...params,
                }

                this.$axios
                    .get(this.route('admin.files.index', requestParams))
                    .then((res) => {
                        this.data.tree = res.data.tree || []
                        this.data.directories = res.data.directories || []

                        if (!this.tree || this.tree.length === 0 || loadTree) {
                            this.tree = res.data.tree || []
                        }

                        let new_files = res.data.files || []
                        if (isFirstPage) {
                            this.data.files = new_files
                        } else {
                            if (new_files.length === 0) {
                                this.fetchData = false
                            } else {
                                // If it's an object or array, handle merge
                                if (Array.isArray(new_files)) {
                                    this.data.files = [...this.data.files, ...new_files]
                                } else {
                                    this.data.files = { ...this.data.files, ...new_files }
                                }
                            }
                        }
                    })
            }
        },
        async copyUrl(file) {
            try {
                await navigator.clipboard.writeText(this.staticUrl(file.static_url))
                this.$toast.add({
                    severity: 'success',
                    summary: this.tt('models.admins.success') || 'Thành công',
                    detail: this.tt('models.files.copied') || 'Đã sao chép liên kết vào bộ nhớ tạm!',
                    life: 2000,
                })
            } catch ($e) {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Thất bại',
                    detail: 'Không thể sao chép liên kết.',
                    life: 2000,
                })
            }
        },
        selectType(type) {
            this.currentType = type
            this.getFiles({ page: 1 })
        },
        onSortChange() {
            this.getFiles({ page: 1 })
        },
        toggleSelectAll() {
            if (this.isAllSelected) {
                this.selectedFiles = []
            } else {
                const files = this.searchFiles || []
                this.selectedFiles = [...files]
            }
        },
        openLightbox(file) {
            this.lightboxFile = file
            this.lightboxVisible = true
            this.lightboxIndex = this.previewableFiles.indexOf(file)
            this.$nextTick(() => {
                if (this.$refs.lightboxContainer) {
                    this.$refs.lightboxContainer.focus()
                }
            })
        },
        closeLightbox() {
            this.lightboxVisible = false
            this.lightboxFile = null
            this.lightboxIndex = -1
        },
        prevLightbox() {
            if (!this.previewableFiles.length) return
            let nextIndex = this.lightboxIndex - 1
            if (nextIndex < 0) {
                nextIndex = this.previewableFiles.length - 1
            }
            this.lightboxIndex = nextIndex
            this.lightboxFile = this.previewableFiles[nextIndex]
        },
        nextLightbox() {
            if (!this.previewableFiles.length) return
            let nextIndex = this.lightboxIndex + 1
            if (nextIndex >= this.previewableFiles.length) {
                nextIndex = 0
            }
            this.lightboxIndex = nextIndex
            this.lightboxFile = this.previewableFiles[nextIndex]
        },
        isVideo(url) {
            if (!url) return false
            return (
                url.endsWith('.mp4') ||
                url.endsWith('.avi') ||
                url.endsWith('.mov') ||
                url.endsWith('.wmv') ||
                url.endsWith('.flv') ||
                url.endsWith('.mkv')
            )
        },
        submitToParentIframe() {
            let htmlImages = ''
            this.selectedFiles.forEach((file) => {
                let src = '/static' + new URL(file.static_url).pathname
                src = src.replace('/static/static/', '/static/')
                htmlImages += `<img src="${src}">`
            })

            window.parent.postMessage({
                mceAction: 'insertContent',
                content: htmlImages,
            })
            window.parent.postMessage({
                mceAction: 'close',
            })
            return
        },

        onSelect(file) {
            if (this.embed) {
                if (this.canSelectMultiple) {
                    this.toggleFileSelect(file)
                } else {
                    this.selectedFiles = [file]
                    this.submitToParentIframe()
                }
                return
            }

            if (!this.selectable) {
                this.toggleFileSelect(file)
                return
            }

            if (!this.canSelectMultiple) {
                this.selectedFiles[0] = file
                this.submitFileSelect()
            } else {
                this.toggleFileSelect(file)
            }
        },
        toggleFileSelect(file) {
            if (!this.selectedFiles.includes(file)) {
                this.selectedFiles.push(file)
            } else {
                const fileIndex = this.selectedFiles.indexOf(file)
                this.selectedFiles.splice(fileIndex, 1)
            }
        },
        submitFileSelect() {
            if (this.embed) {
                if (this.canSelectMultiple) {
                    return this.submitToParentIframe()
                }
                return
            }
            this.$emit('on-select', this.selectedFiles)
            this.selectedFiles = []
            this.$emit('update:show', false)
        },
        browse() {
            this.$refs.file.click()
        },
        browseFolder() {
            this.$refs.folderInput.click()
        },
        async drop(event) {
            this.isDragging = false
            this.dragCounter = 0
            
            const items = event.dataTransfer.items
            if (!items) {
                this.uploadFiles(event.dataTransfer.files)
                return
            }

            this.loading = true
            const filesToUpload = []
            
            const traverseFileTree = async (entry, path = '') => {
                if (entry.isFile) {
                    const file = await new Promise((resolve) => entry.file(resolve))
                    const relativePath = path ? `${path}/${file.name}` : file.name
                    filesToUpload.push({ file, relativePath })
                } else if (entry.isDirectory) {
                    const dirReader = entry.createReader()
                    const entries = await new Promise((resolve) => {
                        let result = []
                        const readAll = () => {
                            dirReader.readEntries((results) => {
                                if (results.length) {
                                    result = result.concat(results)
                                    readAll()
                                } else {
                                    resolve(result)
                                }
                            }, () => resolve([]))
                        }
                        readAll()
                    })
                    const newPath = path ? `${path}/${entry.name}` : entry.name
                    for (const childEntry of entries) {
                        await traverseFileTree(childEntry, newPath)
                    }
                }
            }

            const promises = []
            for (let i = 0; i < items.length; i++) {
                const item = items[i]
                if (item.kind === 'file') {
                    const entry = item.webkitGetAsEntry()
                    if (entry) {
                        promises.push(traverseFileTree(entry))
                    }
                }
            }

            await Promise.all(promises)
            
            if (filesToUpload.length > 0) {
                this.uploadFilesWithPaths(filesToUpload)
            } else {
                this.loading = false
            }
        },
        fileChange() {
            this.uploadFiles(this.$refs.file.files)
        },
        folderInputChange() {
            const files = this.$refs.folderInput.files
            const filesToUpload = []
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                filesToUpload.push({
                    file: file,
                    relativePath: file.webkitRelativePath || file.name
                })
            }
            if (filesToUpload.length > 0) {
                this.loading = true
                this.uploadFilesWithPaths(filesToUpload)
            }
            this.$refs.folderInput.value = ''
        },
        uploadFilesWithPaths(filesToUpload) {
            if (filesToUpload.length === 0) {
                this.loading = false
                return
            }

            for (const item of filesToUpload) {
                const fileCheck = this.fileCheck(item.file)
                if (!fileCheck.valid) {
                    alert(
                        item.relativePath + ': ' +
                        this.tt('models.files.maximum_size') +
                        ' ' +
                        fileCheck.maxSize +
                        this.tt('models.files.try_again')
                    )
                    this.loading = false
                    return false
                }
            }

            var formData = new FormData()
            for (let index = 0; index < filesToUpload.length; index++) {
                const item = filesToUpload[index]
                const file = item.file
                const relativePath = item.relativePath

                if (this.isImage(file.name)) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        this.uploadingFiles.push({
                            filename: relativePath,
                            base64_code: e.target.result,
                        })
                    }
                    reader.readAsDataURL(file)
                } else {
                    this.uploadingFiles.push({
                        filename: relativePath,
                        base64_code: null,
                        size: file.size,
                    })
                }
                formData.append('files[' + index + ']', file)
                formData.append('relative_paths[' + index + ']', relativePath)
            }
            
            formData.append('path', this.currentPath)
            this.postFiles(formData)
        },
        uploadFiles(images) {
            if (images.length === 0 || this.loading) return
            this.loading = true

            for (const image of images) {
                const fileCheck = this.fileCheck(image)
                if (!fileCheck.valid) {
                    alert(
                        this.tt('models.files.maximum_size') +
                        ' ' +
                        fileCheck.maxSize +
                        this.tt('models.files.try_again')
                    )
                    this.$refs.file.value = ''
                    this.loading = false
                    return false
                }
            }

            var formData = new FormData()
            for (let index = 0; index < images.length; index++) {
                const image = images[index]

                if (this.isImage(image.name)) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        this.uploadingFiles.push({
                            filename: image.name,
                            base64_code: e.target.result,
                        })
                    }
                    reader.readAsDataURL(image)
                } else {
                    this.uploadingFiles.push({
                        filename: image.name,
                        base64_code: null,
                        size: image.size,
                    })
                }
                formData.append('files[' + index + ']', image)
                formData.append('path', this.currentPath)
            }
            this.$refs.file.value = ''
            this.postFiles(formData)
        },
        postFiles(formData) {
            this.loading = true
            this.$axios
                .post(this.route('admin.files.store'), formData)
                .then((response) => {
                    if (response.status === 200) {
                        this.uploadingFiles = []
                        this.getFiles({ page: 1 })
                        this.$toast.add({
                            severity: 'success',
                            summary: this.tt('models.admins.success'),
                            detail: this.tt('models.has_crud_action.store'),
                            life: 3000,
                        })
                    }
                })
                .catch((error) => {
                    const msg = error.response?.data?.message || 'Tải file lên thất bại. Vui lòng kiểm tra lại cấu hình upload PHP hoặc định dạng file.';
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Lỗi tải tệp',
                        detail: msg,
                        life: 5000,
                    })
                })
                .finally(() => {
                    this.loading = false
                })
        },
        onRemove(file) {
            this.loading = true
            this.$axios
                .post(this.route('admin.files.destroy', { id: 0 }), {
                    files: [file],
                })
                .then((response) => {
                    if (response.status === 200) {
                        this.getFiles({ page: 1 })
                        this.$toast.add({
                            severity: 'success',
                            summary: this.tt('models.admins.success'),
                            detail: this.tt('models.has_crud_action.destroy'),
                            life: 3000,
                        })
                    }
                })
                .finally(() => {
                    this.loading = false
                })
        },
        deleteSelected() {
            if (confirm(this.tt('models.files.confirm_delete') || 'Bạn thực sự muốn xoá?')) {
                this.loading = true
                this.$axios
                    .post(this.route('admin.files.destroy', { id: 0 }), {
                        files: this.selectedFiles,
                    })
                    .then((response) => {
                        if (response.status === 200) {
                            this.selectedFiles = []
                            this.getFiles({ page: 1 })
                            this.$toast.add({
                                severity: 'success',
                                summary: this.tt('models.admins.success'),
                                detail: this.tt('models.has_crud_action.destroy'),
                                life: 3000,
                            })
                        }
                    })
                    .finally(() => {
                        this.loading = false
                    })
            }
        },
        fileCheck(file) {
            const maxSize = this.isImage(file.name) ? MAX_SIZE_OF_IMAGE : MAX_SIZE_OF_VIDEO
            const fileSize = file.size / 1024 / 1024

            return { valid: fileSize <= maxSize, maxSize }
        },
        onChange(event) {
            if (this.timer) {
                clearTimeout(this.timer)
                this.timer = null
            }

            this.timer = setTimeout(() => {
                this.search = event.target.value
                this.getFiles({ page: 1 })
            }, 500)
        },
        openFolderModal(mode) {
            this.folderModalMode = mode
            if (mode === 'rename') {
                this.folderForm.name = this.currentPath.split('/').pop()
            } else {
                this.folderForm.name = ''
            }
            this.showFolderModal = true
        },
        submitFolderForm() {
            if (this.folderModalMode === 'create') {
                this.createFolder(this.folderForm.name)
            } else {
                this.renameFolder(this.folderForm.name)
            }
            this.showFolderModal = false
        },
        createFolder(name) {
            this.$axios
                .post(this.route('admin.files.folders.create'), {
                    name: name,
                    path: this.currentPath,
                })
                .then((res) => {
                    this.getFiles({}, true)
                    this.folderForm.name = null
                    this.$toast.add({
                        severity: 'success',
                        summary: this.tt('models.admins.success'),
                        detail: this.tt('models.has_crud_action.store'),
                        life: 3000,
                    })
                })
                .catch((error) => {
                    const msg = error.response?.data?.message || 'Tạo thư mục thất bại!';
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Lỗi tạo thư mục',
                        detail: msg,
                        life: 5000,
                    })
                })
        },
        renameFolder(name) {
            if (!name) return
            this.loading = true
            this.$axios
                .post(this.route('admin.files.folders.rename'), {
                    name: name,
                    path: this.currentPath,
                })
                .then((res) => {
                    if (res.data) {
                        const parentPath = this.currentPath.split('/').slice(0, -1).join('/') || '/'
                        this.currentPath = (parentPath === '/' ? '' : parentPath) + '/' + name
                        this.getFiles({}, true)
                        this.$toast.add({
                            severity: 'success',
                            summary: this.tt('models.admins.success'),
                            detail: this.tt('models.has_crud_action.update'),
                            life: 3000,
                        })
                    } else {
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Lỗi đổi tên',
                            detail: 'Tên thư mục đã tồn tại hoặc không hợp lệ.',
                            life: 5000,
                        })
                    }
                })
                .catch((error) => {
                    const msg = error.response?.data?.message || 'Đổi tên thư mục thất bại!';
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Lỗi đổi tên',
                        detail: msg,
                        life: 5000,
                    })
                })
                .finally(() => {
                    this.loading = false
                })
        },
        deleteFolder() {
            if (confirm(this.tt('models.files.confirm_delete')) == true) {
                this.$axios
                    .post(
                        this.route('admin.files.folders.delete', {
                            path: this.currentPath,
                        })
                    )
                    .then((res) => {
                        this.currentPath = '/'
                        this.getFiles({}, true)
                        this.$toast.add({
                            severity: 'success',
                            summary: this.tt('models.admins.success'),
                            detail: this.tt('models.has_crud_action.destroy'),
                            life: 3000,
                        })
                    })
                    .catch((error) => {
                        const msg = error.response?.data?.message || 'Xóa thư mục thất bại!';
                        this.$toast.add({
                            severity: 'error',
                            summary: 'Lỗi xóa thư mục',
                            detail: msg,
                            life: 5000,
                        })
                    })
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.left-from-sidebar {
    left: var(--sidebar-width);
}

.topbar {
    @apply absolute flex items-center flex-shrink-0 w-full px-4 bg-white border-b sm:px-10 md:px-12;
    height: var(--topbar-height);
}

.topbar+div {
    @apply fixed right-0;
    top: var(--topbar-height);
    height: calc(100% - var(--topbar-height));
    left: var(--sidebar-width);
}
</style>
