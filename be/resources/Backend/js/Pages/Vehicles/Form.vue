<template layout>
    <Form v-model="formData" :config="{ wide: activeFormTab === 'builder' }">
        <template #default="{ form, submit }">

            <!-- ===== MAIN FORM TABS ===== -->
            <div class="mb-5 bg-white p-3 rounded-lg shadow-xs border border-gray-200 flex flex-wrap gap-2">
                <button v-for="tab in tabs" :key="tab.id" type="button"
                    class="py-2 px-4 text-xs md:text-sm font-semibold rounded transition-all cursor-pointer border-0"
                    :class="activeFormTab === tab.id ? 'bg-indigo-600 text-white shadow-xs' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 bg-transparent'"
                    @click="activeFormTab = tab.id"
                >
                    {{ tab.name }}
                </button>
            </div>

            <!-- Tab 1: Thông tin chung & Ảnh -->
            <div v-show="activeFormTab === 'general'" class="space-y-4">
                <div class="card">
                    <!-- Thông tin cơ bản -->
                    <div class="card-body">
                        <p class="text-sm font-semibold text-gray-500 uppercase mb-3">Thông tin dòng xe</p>
                        <Field v-model="form[currentTab].title" :field="{
                            type: 'text',
                            name: `title_${currentTab}`,
                            label: 'Tên dòng xe',
                            placeholder: 'vd: Ford Everest 2026',
                        }" />
                        <Field v-model="form[currentTab].tagline" :field="{
                            type: 'text',
                            name: `tagline_${currentTab}`,
                            label: 'Tagline / Slogan xe',
                            placeholder: 'vd: Thống lĩnh mọi địa hình',
                        }" />
                        <Field v-model="form[currentTab].description" :field="{
                            type: 'richtext',
                            name: `description_${currentTab}`,
                            label: 'Mô tả chi tiết',
                        }" />
                    </div>
                </div>

                <!-- Hình ảnh dòng xe (KHÔNG dịch) -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-700">Hình ảnh dòng xe</div>
                    <div class="card-body">
                        <Field v-model="form.image_thumbnail" :field="{
                            type: 'file_upload',
                            name: 'image_thumbnail',
                            label: 'Ảnh Thumbnail đại diện ở các card',
                        }" />
                        <Field v-model="form.image_featured" :field="{
                            type: 'file_upload',
                            name: 'image_featured',
                            label: 'Ảnh Thumbnail hiển thị ở slider homepage',
                        }" />
                        <Field v-model="form.video_url" :field="{
                            type: 'text',
                            name: 'video_url',
                            label: 'Đường dẫn Video (YouTube hoặc link MP4 trực tiếp)',
                            placeholder: 'vd: https://www.youtube.com/watch?v=... hoặc /uploads/video.mp4',
                        }" />
                        <Field v-model="form.video" :field="{
                            type: 'file_upload',
                            name: 'video',
                            label: 'Tải lên Video nền dòng xe (MP4)',
                            accept: 'video/mp4, video/x-m4v, video/*',
                        }" />
                        <Field v-model="form.brochure_url" :field="{
                            type: 'text',
                            name: 'brochure_url',
                            label: 'Đường dẫn tài liệu Brochure (Link liên kết ngoài)',
                            placeholder: 'vd: https://domain.com/brochure.pdf',
                        }" />
                        <Field v-model="form.brochure_file" :field="{
                            type: 'file_upload',
                            name: 'brochure_file',
                            label: 'Tải lên file tài liệu Brochure (PDF)',
                            accept: 'application/pdf',
                        }" />
                    </div>
                </div>
            </div>



            <!-- Tab 3: Phiên bản & Thông số -->
            <div v-show="activeFormTab === 'versions'">
                <!-- Phiên bản & Thông số kỹ thuật -->
                <div class="card mt-4">
                    <div class="card-header font-bold text-gray-700">Phiên bản & Thông số kỹ thuật (Versions & Specs)</div>
                    <div class="card-body">
                        <div v-if="!form.versions || form.versions.length === 0" class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <span class="text-3xl">⚙️</span>
                            <p class="text-sm text-gray-500 mt-2 font-medium">Chưa có phiên bản nào cho dòng xe này</p>
                            <button type="button" class="mt-4 btn btn-indigo btn-sm" @click="addVersion(form)">
                                + Thêm phiên bản xe đầu tiên
                            </button>
                        </div>
                        <div v-else class="grid grid-cols-12 gap-6">
                            <!-- SIDEBAR (3/12 cols) -->
                            <div class="col-span-12 lg:col-span-4 xl:col-span-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-200 flex flex-col gap-3">
                                <div class="flex items-center justify-between pb-2 border-b border-gray-200">
                                    <span class="font-bold text-xs uppercase text-gray-500 tracking-wider">Danh sách phiên bản</span>
                                    <span class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {{ form.versions.length }} phiên bản
                                    </span>
                                </div>

                                <Draggable
                                    v-model="form.versions"
                                    item-key="id"
                                    handle=".version-drag-handle"
                                    :animation="200"
                                    class="space-y-2 max-h-[500px] overflow-y-auto pr-1"
                                >
                                    <template #item="{ element, index }">
                                        <div 
                                            class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition duration-155 group"
                                            :class="activeVersionIndex === index 
                                                ? 'bg-indigo-50/80 border-indigo-250 ring-2 ring-indigo-500/10' 
                                                : 'bg-white hover:bg-gray-50 border-gray-200'"
                                            @click="activeVersionIndex = index"
                                        >
                                            <div class="flex items-center space-x-2.5 overflow-hidden">
                                                <!-- Drag Handle -->
                                                <div class="version-drag-handle cursor-grab text-gray-400 hover:text-gray-600 transition shrink-0">
                                                    ☰
                                                </div>
                                                <!-- Status indicator dot -->
                                                <span class="w-2.5 h-2.5 rounded-full shrink-0" 
                                                      :class="element.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-450'">
                                                </span>
                                                <!-- Version Name -->
                                                <span class="text-xs font-bold text-gray-700 truncate">
                                                    {{ element.vi?.name || 'Phiên bản chưa đặt tên' }}
                                                </span>
                                            </div>
                                            <!-- Version Actions -->
                                            <div class="flex items-center gap-1 shrink-0">
                                                <button 
                                                    type="button" 
                                                    class="text-indigo-600 hover:text-indigo-800 text-xs bg-indigo-50 hover:bg-indigo-100 w-5 h-5 flex items-center justify-center rounded-md border-0 cursor-pointer shrink-0 transition"
                                                    @click.stop="duplicateVersion(form, index)"
                                                    title="Nhân bản phiên bản này"
                                                >
                                                    📋
                                                </button>
                                                <button 
                                                    type="button" 
                                                    class="text-red-500 hover:text-red-700 text-xs bg-red-50 hover:bg-red-100 w-5 h-5 flex items-center justify-center rounded-md border-0 cursor-pointer shrink-0 transition"
                                                    @click.stop="removeVersion(form, index)"
                                                    title="Xóa phiên bản"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    </template>
                                </Draggable>

                                <button type="button" class="btn btn-secondary btn-sm mt-2 w-full justify-center" @click="addVersion(form)">
                                    + Thêm phiên bản xe
                                </button>
                            </div>

                            <!-- DETAIL PANE (9/12 cols) -->
                            <div class="col-span-12 lg:col-span-8 xl:col-span-9 space-y-5 bg-white p-5 rounded-2xl border border-gray-200" v-if="form.versions[activeVersionIndex]">
                                <div class="flex justify-between items-center pb-3 border-b border-gray-150">
                                    <div class="flex items-center gap-2">
                                        <span class="w-2.5 h-2.5 rounded-full" :class="form.versions[activeVersionIndex].status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'"></span>
                                        <h4 class="font-bold text-gray-800 text-sm md:text-base">
                                            Cấu hình: {{ form.versions[activeVersionIndex].vi?.name || 'Phiên bản chưa đặt tên' }}
                                        </h4>
                                    </div>
                                    <button type="button" class="text-red-600 hover:text-red-800 font-bold text-xs bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg transition cursor-pointer" @click="removeVersion(form, activeVersionIndex)">
                                        ✕ Xóa phiên bản này
                                    </button>
                                </div>

                                <!-- Quick Tools Panel -->
                                <div class="flex flex-wrap items-center gap-3 bg-indigo-50/40 p-3.5 rounded-xl border border-indigo-150/60">
                                    <span class="text-xs font-bold text-indigo-900 flex items-center gap-1">
                                        <span>⚡</span>
                                        <span>Công cụ nhanh:</span>
                                    </span>
                                    
                                    <button 
                                        type="button" 
                                        @click="showSpecsImportModal = !showSpecsImportModal" 
                                        class="text-xs bg-white hover:bg-gray-50 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 transition cursor-pointer"
                                    >
                                        📥 Nhập specs nhanh từ text
                                    </button>

                                    <!-- Clone Colors from other version -->
                                    <select 
                                        v-if="form.versions && form.versions.length > 1" 
                                        @change="handleCloneColorsFromVersion(form, $event)" 
                                        class="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-750 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="">🎨 Sao chép màu từ phiên bản khác...</option>
                                        <option v-for="(v, idx) in form.versions" :key="idx" :value="idx" v-show="idx !== activeVersionIndex">
                                            {{ v.vi?.name || `Phiên bản #${idx + 1}` }}
                                        </option>
                                    </select>

                                    <!-- Clone Specs from other version -->
                                    <select 
                                        v-if="form.versions && form.versions.length > 1" 
                                        @change="handleCloneSpecsFromVersion(form, $event)" 
                                        class="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-gray-750 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="">📋 Sao chép specs từ phiên bản khác...</option>
                                        <option v-for="(v, idx) in form.versions" :key="idx" :value="idx" v-show="idx !== activeVersionIndex">
                                            {{ v.vi?.name || `Phiên bản #${idx + 1}` }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Collapsible Text Importer -->
                                <div v-if="showSpecsImportModal" class="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
                                    <div class="flex justify-between items-center">
                                        <h5 class="text-xs font-bold text-gray-700">Dán danh sách thông số kỹ thuật (dán trực tiếp từ web/brochure/Excel)</h5>
                                        <button type="button" @click="showSpecsImportModal = false" class="text-gray-450 hover:text-gray-600 text-xs bg-transparent border-0 cursor-pointer">Đóng</button>
                                    </div>
                                    <textarea 
                                        v-model="specsImportText" 
                                        rows="8" 
                                        class="w-full text-xs p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 bg-white"
                                        placeholder="Vận hành&#10;Động cơ: Xăng EcoBoost 1.5L&#10;Công suất cực đại: 160 mã lực&#10;&#10;Ngoại thất&#10;Đèn pha: LED Matrix&#10;Mâm xe: Hợp kim 18 inch"
                                    ></textarea>
                                    <div class="flex justify-end gap-2">
                                        <button type="button" @click="executeSpecsImport(form)" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition border-0">Xử lý & Nhập thông số</button>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <!-- Tên phiên bản bằng Tiếng Việt -->
                                    <Field v-model="form.versions[activeVersionIndex].vi.name" :field="{
                                        type: 'text',
                                        name: 'version_name_vi_' + activeVersionIndex,
                                        label: 'Tên phiên bản',
                                        placeholder: 'vd: Titanium 1.5L AT',
                                    }" />
                                    
                                    <!-- Giá phiên bản -->
                                    <Field v-model="form.versions[activeVersionIndex].price" :field="{
                                        type: 'money',
                                        name: 'version_price_' + activeVersionIndex,
                                        label: 'Giá bán (VNĐ)',
                                    }" />
                                </div>

                                <div class="mb-4 bg-white p-4 rounded-xl border border-gray-200">
                                    <!-- Ảnh đặc trưng phiên bản -->
                                    <Field 
                                        :key="'version_image_' + activeVersionIndex"
                                        v-model="form.versions[activeVersionIndex].image" 
                                        :field="{
                                            type: 'file_upload',
                                            name: 'version_image_' + activeVersionIndex,
                                            label: 'Ảnh đặc trưng của phiên bản (Hiển thị ở trang chi tiết xe)',
                                        }" 
                                    />
                                </div>

                                <div class="mb-4 bg-white p-4 rounded-xl border border-gray-200">
                                    <!-- Ảnh đại diện phiên bản show ở card sản phẩm xe -->
                                    <Field 
                                        :key="'version_image_thumbnail_' + activeVersionIndex"
                                        v-model="form.versions[activeVersionIndex].image_thumbnail" 
                                        :field="{
                                            type: 'file_upload',
                                            name: 'version_image_thumbnail_' + activeVersionIndex,
                                            label: 'Ảnh đại diện phiên bản (Hiển thị ở các card dòng sản phẩm xe, không hiển thị trong chi tiết xe)',
                                        }" 
                                    />
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <!-- Trạng thái hoạt động -->
                                    <Field v-model="form.versions[activeVersionIndex].status" :field="{
                                        type: 'radio_list',
                                        name: 'version_status_' + activeVersionIndex,
                                        label: 'Trạng thái phiên bản',
                                        options: [
                                            { id: 'ACTIVE', label: 'Hoạt động' },
                                            { id: 'INACTIVE', label: 'Tạm ẩn' },
                                        ]
                                    }" />

                                    <!-- Thứ tự sắp xếp -->
                                    <Field v-model="form.versions[activeVersionIndex].sort_order" :field="{
                                        type: 'number',
                                        name: 'version_sort_' + activeVersionIndex,
                                        label: 'Thứ tự sắp xếp',
                                    }" />
                                </div>

                                <!-- Version Colors List -->
                                <div class="border-t border-gray-150 pt-5 mt-5">
                                    <div class="flex justify-between items-center mb-3">
                                        <p class="text-sm font-bold text-emerald-750 uppercase flex items-center gap-1 cursor-pointer select-none" @click="showColorsSection = !showColorsSection">
                                            <span>🎨</span>
                                            <span>Màu sắc riêng của phiên bản này (Colors)</span>
                                            <span class="text-gray-400 text-xs font-normal normal-case ml-1">{{ showColorsSection ? '▼' : '►' }}</span>
                                        </p>
                                        <button v-show="showColorsSection" type="button" class="text-xs text-emerald-600 hover:text-emerald-800 font-bold bg-transparent border-0 cursor-pointer" @click="addVersionColor(form, activeVersionIndex)">
                                            ＋ Thêm màu mới cho phiên bản
                                        </button>
                                    </div>

                                    <div v-show="showColorsSection" class="space-y-4">
                                        <div v-for="(color, cIdx) in form.versions[activeVersionIndex].colors" :key="cIdx" class="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:shadow-xs transition duration-150 relative">
                                            <button 
                                                type="button" 
                                                class="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 border border-red-200 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition" 
                                                @click="removeVersionColor(form, activeVersionIndex, cIdx)"
                                                title="Xóa màu này"
                                            >
                                                ✕
                                            </button>

                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <Field v-model="form.versions[activeVersionIndex].colors[cIdx].name" :field="{
                                                    type: 'text',
                                                    name: 'ver_' + activeVersionIndex + '_color_name_' + cIdx,
                                                    label: 'Tên màu sắc',
                                                    placeholder: 'vd: Trắng Pearl / Đen Panther',
                                                }" />
                                                
                                                <div class="field">
                                                    <label class="flex items-center label mb-1">
                                                        <span class="text-xs font-bold text-gray-700">Mã màu Hex & Chọn màu trực quan</span>
                                                    </label>
                                                    <div class="flex items-center gap-2">
                                                        <input 
                                                            type="color" 
                                                            v-model="form.versions[activeVersionIndex].colors[cIdx].color_code"
                                                            class="w-11 h-[38px] p-0.5 rounded-lg border border-gray-300 cursor-pointer bg-white shrink-0"
                                                        />
                                                        <InputText 
                                                            type="text" 
                                                            v-model="form.versions[activeVersionIndex].colors[cIdx].color_code"
                                                            placeholder="vd: #ffffff"
                                                            class="w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="border-t border-gray-200 pt-3 mt-3 space-y-3">
                                                <p class="text-[11px] font-bold text-indigo-750 uppercase tracking-wider">Hình ảnh 360° phiên bản</p>
                                                
                                                <div class="bg-white p-3 rounded-lg border border-gray-150">
                                                    <Field 
                                                        :key="'ver_' + activeVersionIndex + '_color_image_360_internal_' + cIdx"
                                                        v-model="form.versions[activeVersionIndex].colors[cIdx].image_360_internal" 
                                                        :field="{
                                                            type: 'file_upload',
                                                            name: 'ver_' + activeVersionIndex + '_color_image_360_internal_' + cIdx,
                                                            label: 'Ảnh Panorama 360° (Nội thất)',
                                                        }" 
                                                    />
                                                </div>

                                                <div class="bg-white p-3 rounded-lg border border-gray-150">
                                                    <Field 
                                                        :key="'ver_' + activeVersionIndex + '_color_images_360_' + cIdx"
                                                        v-model="form.versions[activeVersionIndex].colors[cIdx].images_360" 
                                                        :field="{
                                                            type: 'file_upload',
                                                            name: 'ver_' + activeVersionIndex + '_color_images_360_' + cIdx,
                                                            label: 'Bộ ảnh xoay 360° Ngoại thất cho màu này (Chọn nhiều ảnh theo thứ tự xoay)',
                                                            multiple: true,
                                                        }" 
                                                    />
                                                </div>

                                                <div class="bg-white p-3 rounded-lg border border-gray-150">
                                                    <Field 
                                                        :key="'ver_' + activeVersionIndex + '_color_images_360_internal_' + cIdx"
                                                        v-model="form.versions[activeVersionIndex].colors[cIdx].images_360_internal" 
                                                        :field="{
                                                            type: 'file_upload',
                                                            name: 'ver_' + activeVersionIndex + '_color_images_360_internal_' + cIdx,
                                                            label: 'Bộ ảnh xoay 360° Nội thất cho màu này (Chọn nhiều ảnh theo thứ tự xoay)',
                                                            multiple: true,
                                                        }" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="!form.versions[activeVersionIndex].colors || form.versions[activeVersionIndex].colors.length === 0" class="text-xs text-gray-400 italic py-2">
                                            Chưa cấu hình màu sắc riêng nào cho phiên bản này. Phiên bản này sẽ kế thừa bảng màu chung của dòng xe.
                                        </div>
                                    </div>
                                </div>

                                <!-- Dynamic Specifications List -->
                                <div class="border-t border-gray-150 pt-5 mt-5">
                                    <div class="flex justify-between items-center mb-3">
                                        <p class="text-sm font-bold text-indigo-700 uppercase flex items-center gap-1 cursor-pointer select-none" @click="showSpecsSection = !showSpecsSection">
                                            <span>📋</span>
                                            <span>Nhóm thông số kỹ thuật chi tiết (Specs)</span>
                                            <span class="text-gray-400 text-xs font-normal normal-case ml-1">{{ showSpecsSection ? '▼' : '►' }}</span>
                                        </p>
                                        <button v-show="showSpecsSection" type="button" class="text-xs text-indigo-650 hover:text-indigo-850 font-bold bg-transparent border-0 cursor-pointer" @click="addCustomSpec(form, activeVersionIndex)">
                                            ＋ Thêm nhóm thông số mới
                                        </button>
                                    </div>
                                    
                                    <div v-show="showSpecsSection" class="space-y-4">
                                        <div v-for="(spec, sIdx) in form.versions[activeVersionIndex].customSpecs" :key="sIdx" class="bg-gray-50 border border-gray-200 p-4 rounded-xl hover:shadow-xs transition duration-150 relative">
                                            <button 
                                                type="button" 
                                                class="absolute top-3 right-3 text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 hover:bg-red-100 border border-red-200 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition" 
                                                @click="removeCustomSpec(form, activeVersionIndex, sIdx)"
                                                title="Xóa nhóm thông số này"
                                            >
                                                ✕
                                            </button>

                                            <div class="grid grid-cols-1 gap-4">
                                                <div>
                                                    <label class="block text-xs font-bold text-gray-700 mb-1">Tiêu đề nhóm thông số</label>
                                                    <input 
                                                        v-model="spec.title" 
                                                        type="text" 
                                                        class="w-full max-w-md bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                                        placeholder="Tên nhóm (vd: Vận hành, Ngoại thất...)" 
                                                    />
                                                </div>
                                                <div>
                                                    <label class="block text-xs font-bold text-gray-700 mb-1">Nội dung chi tiết (RichText)</label>
                                                    <div class="border rounded-lg bg-white overflow-hidden">
                                                        <CustomEditor 
                                                            :modelValue="spec.content" 
                                                            @change="spec.content = $event" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="!form.versions[activeVersionIndex].customSpecs || form.versions[activeVersionIndex].customSpecs.length === 0" class="text-xs text-gray-400 italic py-2">
                                            Chưa cấu hình nhóm thông số nào cho phiên bản này. Hãy bấm "＋ Thêm nhóm thông số mới".
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab 4: Thiết kế trang (Shopify Mode Fullscreen Editor Overlay) -->
            <teleport to="body">
                <div v-if="activeFormTab === 'builder'" class="fixed inset-0 z-[9999] bg-[#f6f6f7] flex flex-col font-sans select-none overflow-hidden h-screen w-screen">
                    <!-- Shopify-style Topbar -->
                    <div class="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-200 text-gray-900 shrink-0">
                        <div class="flex items-center space-x-4">
                            <button 
                                type="button" 
                                class="flex items-center text-xs font-bold text-gray-750 hover:text-gray-900 transition bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-lg border border-gray-300 cursor-pointer"
                                @click="activeFormTab = 'general'"
                            >
                                ← Quay lại
                            </button>
                            <div class="h-4 w-[1px] bg-gray-300"></div>
                            <div class="flex flex-col">
                                <span class="text-[9px] uppercase font-bold tracking-widest text-gray-500 font-mono">Trình dựng trang trực quan</span>
                                <span class="text-xs font-bold text-gray-900 mt-0.5">Shopify Editor Mode — {{ form.vi?.title || item.title || 'Dòng xe' }}</span>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-3">
                            <button 
                                type="button"
                                class="bg-white hover:bg-gray-50 text-gray-755 hover:text-gray-900 text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors border border-solid border-gray-300 h-9 flex items-center justify-center"
                                @click="activeFormTab = 'general'"
                            >
                                Đóng
                            </button>
                            <button 
                                type="button"
                                class="bg-[#008060] hover:bg-[#006e52] disabled:bg-gray-300 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-xs border-0 h-9 flex items-center justify-center"
                                @click="submit"
                                :disabled="form.processing"
                            >
                                {{ form.processing ? 'Đang lưu...' : 'Lưu thay đổi' }}
                            </button>
                        </div>
                    </div>
                    
                    <!-- Flash Messages inside Fullscreen Editor -->
                    <div v-if="$page.props.flash?.success || $page.props.flash?.error || Object.keys($page.props.errors || {}).length > 0" class="px-6 py-2 bg-white border-b border-gray-200 shrink-0">
                        <FlashMessages />
                    </div>
                    
                    <!-- Fullscreen Workspace -->
                    <div class="flex-1 bg-[#f6f6f7] overflow-hidden relative h-full w-full">
                        <BlockEditor 
                            v-model="form.layout_blocks" 
                            :vehicle-slug="form.vi.slug || item.slug" 
                            :vehicle-data="form"
                            :fullscreen="true"
                        />
                    </div>
                </div>
            </teleport>
            
            <!-- Modal Tạo Phụ Kiện Nhanh -->
            <teleport to="body">
                <div v-if="showCreateAccessoryModal" class="fixed inset-0 z-[9999] flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <!-- Backdrop overlay -->
                    <div class="fixed inset-0 bg-black/50 transition-opacity" @click="closeCreateAccessoryModal"></div>

                    <!-- Modal content card -->
                    <div class="relative w-full max-w-2xl mx-auto my-6 bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh] z-10 border border-gray-200">
                        <!-- Header -->
                        <div class="flex items-center justify-between p-5 border-b border-gray-200 rounded-t shrink-0">
                            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                                🎒 {{ isEditAccessory ? 'Chỉnh Sửa Phụ Kiện' : 'Tạo Phụ Kiện Mới' }}
                            </h3>
                            <button
                                type="button"
                                class="text-gray-400 hover:text-gray-600 bg-transparent border-0 text-xl font-semibold leading-none outline-none focus:outline-none cursor-pointer"
                                @click="closeCreateAccessoryModal"
                            >
                                ×
                            </button>
                        </div>

                        <!-- Body (Scrollable) -->
                        <div class="flex-1 p-6 overflow-y-auto space-y-5 text-gray-700 max-h-[70vh]">
                            <!-- Language Tabs in Modal -->
                            <div class="flex border-b mb-4 gap-2">
                                <button 
                                    type="button" 
                                    class="py-2 px-4 font-bold text-xs border-b-2 focus:outline-none cursor-pointer"
                                    :class="modalTab === 'vi' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                                    @click="modalTab = 'vi'"
                                >
                                    🇻🇳 Tiếng Việt
                                </button>
                                <button 
                                    type="button" 
                                    class="py-2 px-4 font-bold text-xs border-b-2 focus:outline-none cursor-pointer"
                                    :class="modalTab === 'en' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
                                    @click="modalTab = 'en'"
                                >
                                    🇬🇧 English
                                </button>
                            </div>

                            <!-- Translated fields -->
                            <div v-show="modalTab === 'vi'" class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tên phụ kiện (Tiếng Việt) <span class="text-red-500">*</span></label>
                                    <input 
                                        v-model="newAccessoryForm.vi.title" 
                                        type="text" 
                                        placeholder="Ví dụ: Nắp thùng cuộn điện Ford Ranger Wildtrak"
                                        class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                        required
                                    />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mô tả ngắn (Tiếng Việt)</label>
                                    <Field v-model="newAccessoryForm.vi.description" :field="{
                                        type: 'richtext',
                                        name: 'new_accessory_description_vi',
                                        label: false,
                                        placeholder: 'Mô tả tóm tắt tính năng...',
                                    }" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tính tương thích (Tiếng Việt)</label>
                                    <textarea 
                                        v-model="newAccessoryForm.vi.compatibility_text" 
                                        placeholder="Thông tin chi tiết về các phiên bản xe tương thích..."
                                        class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 h-20 resize-y"
                                    ></textarea>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Thông tin an toàn (Tiếng Việt)</label>
                                    <textarea 
                                        v-model="newAccessoryForm.vi.safety_text" 
                                        placeholder="Hướng dẫn an toàn khi sử dụng..."
                                        class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 h-20 resize-y"
                                    ></textarea>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mô tả chi tiết sản phẩm (Tiếng Việt)</label>
                                    <Field v-model="newAccessoryForm.vi.product_desc_text" :field="{
                                        type: 'richtext',
                                        name: 'new_accessory_product_desc_vi',
                                        label: false,
                                    }" />
                                </div>
                            </div>

                            <div v-show="modalTab === 'en'" class="space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tên phụ kiện (Tiếng Anh)</label>
                                    <input 
                                        v-model="newAccessoryForm.en.title" 
                                        type="text" 
                                        placeholder="Ví dụ: Electric Roller Shutter Ford Ranger"
                                        class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mô tả ngắn (Tiếng Anh)</label>
                                    <Field v-model="newAccessoryForm.en.description" :field="{
                                        type: 'richtext',
                                        name: 'new_accessory_description_en',
                                        label: false,
                                        placeholder: 'Short description...',
                                    }" />
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tính tương thích (Tiếng Anh)</label>
                                    <textarea 
                                        v-model="newAccessoryForm.en.compatibility_text" 
                                        placeholder="Compatibility details..."
                                        class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 h-20 resize-y"
                                    ></textarea>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Thông tin an toàn (Tiếng Anh)</label>
                                    <textarea 
                                        v-model="newAccessoryForm.en.safety_text" 
                                        placeholder="Safety guidelines..."
                                        class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 h-20 resize-y"
                                    ></textarea>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mô tả chi tiết sản phẩm (Tiếng Anh)</label>
                                    <Field v-model="newAccessoryForm.en.product_desc_text" :field="{
                                        type: 'richtext',
                                        name: 'new_accessory_product_desc_en',
                                        label: false,
                                    }" />
                                </div>
                            </div>

                            <!-- General settings -->
                            <div class="border-t pt-4 mt-6">
                                <h4 class="text-xs font-extrabold text-indigo-600 uppercase tracking-wider mb-4">Thông tin chung</h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <!-- Code -->
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mã sản phẩm</label>
                                        <input 
                                            v-model="newAccessoryForm.code" 
                                            type="text" 
                                            placeholder="Ví dụ: RANGER-EXT-001"
                                            class="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                        />
                                    </div>

                                    <!-- Price -->
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Giá bán (VNĐ)</label>
                                        <Field v-model="newAccessoryForm.price" :field="{
                                            type: 'money',
                                            name: 'new_accessory_price',
                                            label: false,
                                            placeholder: 'Ví dụ: 15000000',
                                        }" />
                                    </div>

                                    <!-- Brand Selection -->
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Thương hiệu</label>
                                        <Field v-model="newAccessoryForm.brand_id" :field="{
                                            type: 'select_single',
                                            name: 'new_accessory_brand_id',
                                            label: false,
                                            placeholder: 'Chọn thương hiệu',
                                            options: (brandsList || []).map(b => ({ id: b.id, label: b.title }))
                                        }" />
                                    </div>

                                    <!-- Categories Selection -->
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Danh mục phụ kiện</label>
                                        <Field v-model="newAccessoryForm.categories" :field="{
                                            type: 'select_multiple',
                                            name: 'new_accessory_categories',
                                            label: false,
                                            placeholder: 'Chọn danh mục',
                                            options: (accessoryCategoriesList || []).map(c => ({ id: c.id, label: c.title }))
                                        }" />
                                    </div>

                                    <!-- Thumbnail image -->
                                    <div class="col-span-2">
                                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Ảnh đại diện phụ kiện</label>
                                        <Field v-model="newAccessoryForm.image" :field="{
                                            type: 'file_upload',
                                            name: 'new_accessory_image',
                                            label: false,
                                        }" />
                                    </div>

                                    <!-- Gallery images -->
                                    <div class="col-span-2">
                                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Thư viện ảnh chi tiết</label>
                                        <Field v-model="newAccessoryForm.images" :field="{
                                            type: 'file_upload',
                                            name: 'new_accessory_images',
                                            label: false,
                                            multiple: true,
                                        }" />
                                    </div>

                                    <!-- Brochure fields -->
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Đường dẫn tài liệu Brochure (Link ngoài)</label>
                                        <Field v-model="newAccessoryForm.brochure_url" :field="{
                                            type: 'text',
                                            name: 'new_accessory_brochure_url',
                                            label: false,
                                            placeholder: 'vd: https://domain.com/catalog.pdf',
                                        }" />
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tải lên file tài liệu Brochure (PDF)</label>
                                        <Field v-model="newAccessoryForm.brochure_file" :field="{
                                            type: 'file_upload',
                                            name: 'new_accessory_brochure_file',
                                            label: false,
                                            accept: 'application/pdf',
                                        }" />
                                    </div>

                                    <!-- Dynamic Features -->
                                    <div class="col-span-2 border-t pt-4">
                                        <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tính năng nổi bật</label>
                                        <div v-for="(feat, idx) in newAccessoryForm.features" :key="idx" class="flex gap-2 items-center mb-2">
                                            <input 
                                                v-model="newAccessoryForm.features[idx]" 
                                                type="text" 
                                                placeholder="Ví dụ: Chống nước IP67, Chất liệu nhôm đúc..."
                                                class="block flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                                            />
                                            <button type="button" class="text-red-500 text-sm font-semibold hover:underline shrink-0" @click="removeModalFeature(idx)">✕</button>
                                        </div>
                                        <button type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3 py-1.5 rounded cursor-pointer transition border border-gray-300 focus:outline-none" @click="addModalFeature">
                                            + Thêm tính năng
                                        </button>
                                </div>
                            </div>
                        </div>
                    </div>

                        <!-- Footer -->
                        <div class="flex items-center justify-end p-4 border-t border-gray-200 rounded-b shrink-0 gap-3">
                            <button
                                type="button"
                                class="bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition border border-gray-300 h-9 flex items-center justify-center focus:outline-none"
                                @click="closeCreateAccessoryModal"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="button"
                                class="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-xs font-bold px-5 py-2 rounded-lg cursor-pointer transition shadow-sm border-0 h-9 flex items-center justify-center focus:outline-none"
                                @click="saveNewAccessory"
                                :disabled="isSavingAccessory"
                            >
                                {{ isSavingAccessory ? 'Đang lưu...' : (isEditAccessory ? 'Lưu thay đổi' : 'Tạo phụ kiện') }}
                            </button>
                        </div>
                    </div>
                </div>
            </teleport>

            <!-- Tab 4: Phụ kiện xe -->
            <div v-show="activeFormTab === 'accessories'" class="space-y-6">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-150 pb-5 mb-6">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">🎒 Phụ kiện của xe</h3>
                            <p class="text-sm text-gray-500 mt-1">Danh sách các phụ kiện chính hãng tương thích với dòng xe này. Bạn có thể gỡ bỏ phụ kiện hiện tại hoặc tạo phụ kiện mới.</p>
                        </div>
                        <div class="flex flex-wrap items-center gap-3">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Số lượng: {{ (form.accessories || []).length }} phụ kiện
                            </span>
                            <button 
                                type="button"
                                @click="form.accessories = []"
                                class="text-xs text-red-600 hover:text-red-800 font-semibold transition-colors cursor-pointer focus:outline-none"
                            >
                                Gỡ tất cả
                            </button>
                            <button 
                                type="button"
                                @click="openCreateAccessoryModal"
                                class="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-lg shadow-sm transition cursor-pointer focus:outline-none flex items-center gap-1"
                            >
                                <span>➕</span> Tạo phụ kiện mới
                            </button>
                        </div>
                    </div>

                    <!-- Filter & Search Controls -->
                    <div class="flex flex-col sm:flex-row gap-4 mb-6">
                        <div class="flex-1 relative">
                            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input 
                                v-model="accessorySearch" 
                                type="text" 
                                placeholder="Tìm theo tên hoặc mã phụ kiện..." 
                                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900"
                            />
                        </div>
                        <div class="sm:w-64">
                            <select 
                                v-model="accessoryFilterCategory" 
                                class="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 cursor-pointer"
                            >
                                <option value="all">Tất cả danh mục</option>
                                <option value="interior">Nội thất (Interior)</option>
                                <option value="exterior">Ngoại thất (Exterior)</option>
                                <option value="tech">Công nghệ (Tech)</option>
                                <option value="wheels">Mâm &amp; Lốp (Wheels)</option>
                                <option value="performance">Hiệu suất (Performance)</option>
                            </select>
                        </div>
                    </div>

                    <!-- Accessories Grid -->
                    <div v-if="filteredAccessoriesList.length === 0" class="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                        <svg class="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v4.5m15 3.5l-3-3m0 0l-3 3m3-3V17" />
                        </svg>
                        <p class="text-sm font-semibold text-gray-500">Chưa có phụ kiện nào được liên kết hoặc tìm thấy</p>
                    </div>
                    
                    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2">
                        <div 
                            v-for="acc in filteredAccessoriesList" 
                            :key="acc.id"
                            class="relative border border-gray-200 bg-white rounded-lg p-3 select-none flex gap-3 items-start"
                        >
                            <!-- Accessory Image -->
                            <div class="w-16 h-16 rounded-md overflow-hidden bg-gray-50 border border-gray-150 flex-shrink-0 relative">
                                <img 
                                    v-if="getFeatureImage(acc.image)" 
                                    :src="getFeatureImage(acc.image)" 
                                    :alt="acc.title"
                                    class="w-full h-full object-cover"
                                />
                                <div v-else class="w-full h-full flex items-center justify-center text-2xl bg-gray-100 text-gray-400">
                                    🎒
                                </div>
                            </div>

                            <!-- Right Content Info -->
                            <div class="flex-1 min-w-0 flex flex-col justify-between h-full">
                                <div>
                                    <div class="flex items-start justify-between gap-2">
                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block truncate">
                                            {{ acc.code || 'N/A' }}
                                        </span>
                                        <div class="flex items-center gap-1">
                                            <!-- Edit Button -->
                                            <button 
                                                type="button"
                                                @click="openEditAccessoryModal(acc)"
                                                class="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 border border-transparent hover:border-indigo-200 bg-gray-55 hover:bg-indigo-50 text-gray-400 hover:text-indigo-650 cursor-pointer focus:outline-none flex-shrink-0"
                                                title="Chỉnh sửa thông tin phụ kiện"
                                            >
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                            <!-- Remove/Detach Button -->
                                            <button 
                                                type="button"
                                                @click="toggleAccessorySelection(acc.id)"
                                                class="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200 border border-transparent hover:border-red-200 bg-gray-55 hover:bg-red-50 text-gray-400 hover:text-red-650 cursor-pointer focus:outline-none flex-shrink-0"
                                                title="Gỡ phụ kiện khỏi xe này"
                                            >
                                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <h4 class="text-xs font-semibold text-gray-900 mt-0.5 line-clamp-2 pr-1 leading-tight" :title="acc.title">
                                        {{ acc.title }}
                                    </h4>
                                </div>

                                <!-- Bottom Tag -->
                                <div class="flex flex-wrap items-center gap-1.5 mt-2 pt-1 border-t border-gray-100/50">
                                    <span class="text-[9px] font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                                        {{ getCategoryLabel(acc.category) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab: Tính năng xe -->
            <div v-show="activeFormTab === 'features'" class="space-y-4">
                <!-- Quản lý các nhóm tính năng -->
                <div class="card bg-white border border-gray-200 rounded-2xl shadow-xs">
                    <div class="card-header font-bold text-gray-700 bg-gray-50 border-b border-gray-200 p-4 text-sm">
                        📁 Quản lý các nhóm tính năng
                    </div>
                    <div class="card-body p-4 space-y-4">
                        <div class="flex flex-wrap gap-2 items-center">
                            <span 
                                v-for="(cat, cIdx) in featureCategories" 
                                :key="cIdx"
                                class="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-150"
                            >
                                <span>{{ cat }}</span>
                                <button 
                                    type="button" 
                                    class="text-indigo-400 hover:text-indigo-650 font-bold bg-transparent border-0 cursor-pointer text-[10px] p-0.5 leading-none transition"
                                    @click="removeFeatureCategory(cIdx)"
                                    title="Xóa nhóm này"
                                >
                                    ✕
                                </button>
                            </span>
                        </div>
                        <div class="flex gap-2 max-w-md mt-2">
                            <InputText 
                                v-model="newCategoryName"
                                type="text"
                                placeholder="Nhập tên nhóm mới (vd: Nội thất, Ngoại thất...)"
                                class="w-full text-xs"
                                @keyup.enter="addFeatureCategory"
                            />
                            <button 
                                type="button" 
                                class="btn btn-indigo text-xs py-2 px-4 whitespace-nowrap"
                                @click="addFeatureCategory"
                            >
                                + Thêm nhóm
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Danh sách tính năng (Master-Detail Layout) -->
                <div class="grid grid-cols-12 gap-5 items-start">
                    <!-- MASTER PANE (4/12 cols) -->
                    <div class="col-span-12 lg:col-span-4 bg-white p-4 rounded-2xl border border-gray-200 space-y-4 shadow-sm">
                        <div class="flex items-center justify-between pb-2 border-b border-gray-200">
                            <span class="font-bold text-xs uppercase text-gray-500 tracking-wider">Danh sách tính năng</span>
                            <span class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {{ features.length }} tính năng
                            </span>
                        </div>

                        <div v-if="!features || features.length === 0" class="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p class="text-xs text-gray-400 italic">Chưa có tính năng nào</p>
                        </div>

                        <Draggable
                            v-else
                            v-model="features"
                            item-key="title"
                            handle=".feature-drag-handle"
                            :animation="200"
                            class="space-y-2 max-h-[500px] overflow-y-auto pr-1"
                        >
                            <template #item="{ element, index }">
                                <div 
                                    class="flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition duration-155 group gap-2"
                                    :class="activeFeatureIndex === index 
                                        ? 'bg-indigo-50/85 border-indigo-250 ring-2 ring-indigo-500/10' 
                                        : 'bg-white hover:bg-gray-50 border-gray-200'"
                                    @click="activeFeatureIndex = index"
                                >
                                    <div class="flex items-center space-x-2.5 overflow-hidden flex-1">
                                        <!-- Drag Handle -->
                                        <div class="feature-drag-handle cursor-grab text-gray-450 hover:text-gray-700 transition shrink-0 text-sm">
                                            ☰
                                        </div>
                                        <!-- Thumbnail Image -->
                                        <img v-if="getFeatureImage(element.image)" :src="getFeatureImage(element.image)" class="w-8 h-6 object-cover rounded bg-gray-100 shrink-0 border border-gray-150" />
                                        <div v-else class="w-8 h-6 flex items-center justify-center bg-gray-100 text-gray-400 text-[10px] rounded shrink-0 border border-gray-150">✨</div>
                                        
                                        <!-- Title & Category Badge -->
                                        <div class="flex flex-col truncate flex-1 min-w-0">
                                            <span class="text-xs font-bold text-gray-750 truncate">
                                                {{ element.title || 'Tính năng chưa đặt tên' }}
                                            </span>
                                            <div class="flex items-center gap-1.5 mt-0.5">
                                                <span 
                                                    class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.25 rounded-full border"
                                                    :class="[
                                                        element.category === 'Thiết kế' || element.category === 'design'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-150'
                                                            : element.category === 'Vận hành' || element.category === 'performance'
                                                                ? 'bg-orange-50 text-orange-700 border-orange-150'
                                                                : element.category === 'Công nghệ' || element.category === 'tech'
                                                                    ? 'bg-purple-50 text-purple-700 border-purple-150'
                                                                    : element.category === 'An toàn' || element.category === 'safety'
                                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                                                                        : 'bg-gray-50 text-gray-700 border-gray-200'
                                                    ]"
                                                >
                                                    {{ element.category || 'Chưa phân nhóm' }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Delete Button -->
                                    <button 
                                        type="button" 
                                        class="text-red-500 hover:text-red-700 text-xs bg-red-50 hover:bg-red-100 w-5 h-5 flex items-center justify-center rounded-md border border-red-250 cursor-pointer shrink-0 transition"
                                        @click.stop="removeFeature(index)"
                                        title="Xóa tính năng"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </template>
                        </Draggable>

                        <button 
                            type="button" 
                            class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded-xl border-0 cursor-pointer transition shadow-xs w-full flex items-center justify-center gap-1.5 focus:outline-none"
                            @click="addFeature"
                        >
                            <span>➕ Thêm tính năng mới</span>
                        </button>
                    </div>

                    <!-- DETAIL PANE (8/12 cols) -->
                    <div class="col-span-12 lg:col-span-8 bg-white p-5 rounded-2xl border border-gray-200 space-y-5 shadow-sm" v-if="features[activeFeatureIndex]">
                        <div class="flex justify-between items-center pb-3 border-b border-gray-150">
                            <h4 class="font-bold text-gray-800 text-sm md:text-base">
                                Chi tiết: {{ features[activeFeatureIndex].title || 'Tính năng chưa đặt tên' }}
                            </h4>
                            <span 
                                class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border"
                                :class="[
                                    features[activeFeatureIndex].category === 'Thiết kế' || features[activeFeatureIndex].category === 'design'
                                        ? 'bg-blue-50 text-blue-700 border-blue-150'
                                        : features[activeFeatureIndex].category === 'Vận hành' || features[activeFeatureIndex].category === 'performance'
                                            ? 'bg-orange-50 text-orange-700 border-orange-150'
                                            : features[activeFeatureIndex].category === 'Công nghệ' || features[activeFeatureIndex].category === 'tech'
                                                ? 'bg-purple-50 text-purple-700 border-purple-150'
                                                : features[activeFeatureIndex].category === 'An toàn' || features[activeFeatureIndex].category === 'safety'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                                                    : 'bg-gray-50 text-gray-700 border-gray-200'
                                ]"
                            >
                                {{ features[activeFeatureIndex].category || 'Chưa phân nhóm' }}
                            </span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-12 gap-5">
                            <!-- Left form elements -->
                            <div class="col-span-12 md:col-span-8 space-y-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="field">
                                        <label class="block text-xs font-bold text-gray-700 mb-1">Tên tính năng</label>
                                        <InputText 
                                            v-model="features[activeFeatureIndex].title" 
                                            type="text" 
                                            placeholder="vd: Hệ thống hỗ trợ đỗ xe tự động 2.0"
                                            class="w-full text-xs"
                                        />
                                    </div>
                                    <div class="field">
                                        <label class="block text-xs font-bold text-gray-700 mb-1">Phân loại nhóm</label>
                                        <select 
                                            v-model="features[activeFeatureIndex].category"
                                            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 h-[38px] cursor-pointer"
                                        >
                                            <option v-for="cat in featureCategories" :key="cat" :value="cat">{{ cat }}</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="field">
                                    <label class="block text-xs font-bold text-gray-700 mb-1">Mô tả chi tiết</label>
                                    <textarea 
                                        v-model="features[activeFeatureIndex].description" 
                                        @input="features[activeFeatureIndex].desc = features[activeFeatureIndex].description"
                                        class="w-full border border-gray-300 rounded-lg p-3 text-xs text-gray-850 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y h-32"
                                        placeholder="Mô tả các chi tiết nổi bật của tính năng này..."
                                    ></textarea>
                                </div>
                            </div>

                            <!-- Right upload field -->
                            <div class="col-span-12 md:col-span-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <Field 
                                    :key="'feat_image_' + activeFeatureIndex"
                                    v-model="features[activeFeatureIndex].image" 
                                    :field="{
                                        type: 'file_upload',
                                        name: 'feat_image_' + activeFeatureIndex,
                                        label: 'Hình ảnh minh họa',
                                    }" 
                                />
                            </div>
                        </div>
                    </div>
                    <div v-else-if="features.length > 0" class="col-span-12 lg:col-span-8 bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-400 italic shadow-sm">
                        Hãy chọn một tính năng ở danh sách bên trái để chỉnh sửa thông tin.
                    </div>
                </div>
            </div>

            <!-- Tab 5: Cấu hình SEO -->
            <div v-show="activeFormTab === 'seo'">
                <!-- SEO Settings -->
                <SeoFields :modelValue="form[currentTab]" @update:modelValue="form[currentTab] = $event" />
            </div>

        </template>

        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field v-model="form.category_ids" :field="{
                        type: 'select_multiple',
                        name: 'category_ids',
                        label: 'Danh mục xe',
                        keyBy: 'id',
                        labelBy: 'title',
                        options: categories,
                        emptyLabel: '-- Chọn danh mục --',
                    }" />

                    <Field v-model="form.type" :field="{
                        type: 'dropdown',
                        name: 'type',
                        label: 'Phân loại xe',
                        options: [
                            { id: 'suv', label: 'SUV' },
                            { id: 'pickup', label: 'Bán tải (Pickup)' },
                            { id: 'commercial', label: 'Xe thương mại (Commercial)' },
                        ],
                        emptyLabel: '-- Chọn phân loại xe --',
                    }" />

                    <Field v-model="form.base_price" :field="{
                        type: 'money',
                        name: 'base_price',
                        label: 'Giá niêm yết (VNĐ)',
                    }" />

                    <Field v-model="form.is_best_seller" :field="{
                        type: 'radio_list',
                        name: 'is_best_seller',
                        label: 'Dòng xe bán chạy (Best Seller)',
                        options: [
                            { id: 1, label: 'Có' },
                            { id: 0, label: 'Không' },
                        ]
                    }" />

                    <Field v-model="form.status" :field="{
                        type: 'radio_list',
                        name: 'status',
                        label: 'Trạng thái',
                        options: schema.columns.status.list,
                    }" />

                    <Field v-model="form.sort_order" :field="{
                        type: 'number',
                        name: 'sort_order',
                        label: 'Thứ tự hiển thị',
                    }" />
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
import draggable from 'vuedraggable'

export default {
    components: {
        Draggable: draggable
    },
    props: ['item', 'schema', 'data'],

    data() {
        return {
            currentTab: 'vi',
            activeFormTab: 'general',
            activeColorIndex: 0,
            activeVersionIndex: 0,
            activeFeatureIndex: 0,
            accessorySearch: '',
            accessoryFilterCategory: 'all',
            showSpecsImportModal: false,
            specsImportText: '',
            showColorsSection: true,
            showSpecsSection: true,
            newCategoryName: '',
            showCreateAccessoryModal: false,
            isSavingAccessory: false,
            isEditAccessory: false,
            editingAccessoryId: null,
            modalTab: 'vi',
            newAccessoryForm: {
                brand_id: null,
                code: '',
                price: 0,
                categories: [],
                image: null,
                images: [],
                features: [],
                vehicles: [],
                brochure_url: '',
                brochure_file: null,
                vi: {
                    title: '',
                    description: '',
                    compatibility_text: '',
                    safety_text: '',
                    product_desc_text: '',
                },
                en: {
                    title: '',
                    description: '',
                    compatibility_text: '',
                    safety_text: '',
                    product_desc_text: '',
                }
            },
            tabs: [
                { id: 'general', name: 'ℹ️ Thông tin chung & Ảnh' },
                { id: 'versions', name: '⚙️ Phiên bản & Thông số' },
                { id: 'accessories', name: '🎒 Phụ kiện xe' },
                { id: 'features', name: '✨ Tính năng xe' },
                { id: 'builder', name: '🧱 Thiết kế trang' },
                { id: 'seo', name: '🔍 Cấu hình SEO' }
            ],
            categories: this.data?.categories ?? [],
            formData: this.initFormData(this.item),
        }
    },

    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
        'formData.versions': {
            deep: true,
            handler(newVersions) {
                if (!newVersions) return;
                newVersions.forEach(ver => {
                    if (ver.customSpecs && Array.isArray(ver.customSpecs)) {
                        const mappedSpecs = ver.customSpecs.map(s => ({
                            title: s.title ?? '',
                            content: s.content ?? ''
                        }));
                        if (JSON.stringify(ver.specs) !== JSON.stringify(mappedSpecs)) {
                            ver.specs = mappedSpecs;
                        }
                    }
                });
            }
        }
    },

    computed: {
        brandsList() {
            console.log('Brands data:', this.data?.brands);
            return this.data?.brands || [];
        },
        accessoryCategoriesList() {
            return this.data?.accessory_categories || [];
        },
        filteredAccessoriesList() {
            const list = this.data?.accessories ?? [];
            const search = (this.accessorySearch || '').toLowerCase().trim();
            const category = this.accessoryFilterCategory || 'all';

            return list.filter(acc => {
                // Chỉ hiển thị phụ kiện đã gán cho xe hiện tại (so sánh an toàn kiểu dữ liệu)
                const isSelected = (this.formData.accessories || []).some(id => String(id) === String(acc.id));
                if (!isSelected) return false;

                const matchesSearch = !search || 
                    (acc.title && acc.title.toLowerCase().includes(search)) || 
                    (acc.code && acc.code.toLowerCase().includes(search));

                const matchesCategory = category === 'all' || acc.category === category;

                return matchesSearch && matchesCategory;
            });
        },
        featureCategories: {
            get() {
                if (!this.formData.layout_blocks) return ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"];
                const block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
                return block?.data?.categories || ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"];
            },
            set(val) {
                if (!this.formData.layout_blocks) this.formData.layout_blocks = [];
                let block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
                if (!block) {
                    block = {
                        type: 'FeaturesList',
                        data: {
                            features: [],
                            categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"]
                        }
                    };
                    this.formData.layout_blocks.push(block);
                }
                if (!block.data) {
                    block.data = { features: [], categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"] };
                }
                block.data.categories = val;
            }
        },
        features: {
            get() {
                if (!this.formData.layout_blocks) return [];
                const block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
                return block?.data?.features || [];
            },
            set(val) {
                if (!this.formData.layout_blocks) this.formData.layout_blocks = [];
                let block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
                if (!block) {
                    block = {
                        type: 'FeaturesList',
                        data: {
                            features: [],
                            categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"]
                        }
                    };
                    this.formData.layout_blocks.push(block);
                }
                if (!block.data) {
                    block.data = { features: [], categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"] };
                }
                block.data.features = val;
            }
        }
    },

    methods: {
        initFormData(item) {
            const data = {
                status: 'ACTIVE',
                sort_order: 0,
                is_best_seller: 0,
                base_price: 0,
                type: 'suv',
                category_ids: [],
                image: null,
                image_thumbnail: null,
                image_featured: null,
                video_url: '',
                video: null,
                images: [],
                images_360_external: [],
                images_360_internal: [],
                image_360_internal_url: '',
                versions: [],
                layout_blocks: [],
                accessories: [],
                ...item,
            }
            if (Array.isArray(data.categories) && data.categories.length > 0) {
                data.category_ids = data.categories.map(c => (typeof c === 'object' ? c.id : c)).filter(Boolean);
            } else if (Array.isArray(data.category_ids) && data.category_ids.length > 0) {
                data.category_ids = data.category_ids.map(c => (typeof c === 'object' ? c.id : c)).filter(Boolean);
            } else if (data.category_id) {
                data.category_ids = [data.category_id];
            } else {
                data.category_ids = [];
            }
            data.images_360_external = data.images_360_external || []
            data.images_360_internal = data.images_360_internal || []
            data.layout_blocks = data.layout_blocks || []
            
            // Convert boolean is_best_seller to integer for radio_list
            if (typeof data.is_best_seller === 'boolean') {
                data.is_best_seller = data.is_best_seller ? 1 : 0
            } else if (data.is_best_seller === true || data.is_best_seller === 'true' || data.is_best_seller === '1') {
                data.is_best_seller = 1
            } else {
                data.is_best_seller = 0
            }
            
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                const fallback = loc === 'vi' ? item : {}
                data[loc] = {
                    title:            trans?.title            ?? fallback.title            ?? '',
                    slug:             trans?.slug             ?? fallback.slug             ?? '',
                    tagline:          trans?.tagline          ?? fallback.tagline          ?? '',
                    description:      trans?.description      ?? fallback.description      ?? '',
                    // SEO fields
                    seo_meta_title:       trans?.seo_meta_title       ?? '',
                    seo_slug:             trans?.seo_slug             ?? '',
                    seo_meta_description: trans?.seo_meta_description ?? '',
                    seo_meta_keywords:    trans?.seo_meta_keywords    ?? '',
                    seo_meta_robots:      trans?.seo_meta_robots      ?? '',
                    seo_canonical:        trans?.seo_canonical        ?? '',
                    seo_image:            trans?.seo_image            ?? '',
                    seo_schemas:          trans?.seo_schemas          ?? '',
                }
            })



            // Parse existing versions with locales & default empty specs
            data.versions = (data.versions || []).map(ver => {
                let customSpecs = [];
                let rawSpecs = ver.specs;
                if (typeof rawSpecs === 'string') {
                    try {
                        rawSpecs = JSON.parse(rawSpecs);
                    } catch (e) {
                        rawSpecs = null;
                    }
                }
                
                if (Array.isArray(rawSpecs)) {
                    // New format: Array of { title, content }
                    customSpecs = rawSpecs.map(s => ({
                        title: s.title ?? s.category ?? '',
                        content: s.content ?? ''
                    }));
                } else if (rawSpecs && typeof rawSpecs === 'object') {
                    if (Array.isArray(rawSpecs.detailed_specs)) {
                        // Crawled format
                        customSpecs = rawSpecs.detailed_specs.map(s => ({
                            title: s.title ?? s.category ?? '',
                            content: s.content ?? ''
                        }));
                    } else {
                        // Old flat key-value pairs
                        const oldKeyLabels = {
                            engine: 'Động cơ',
                            power: 'Công suất cực đại',
                            torque: 'Mô-men xoắn cực đại',
                            transmission: 'Hộp số',
                            drivetrain: 'Hệ dẫn động',
                            dimensions: 'Kích thước (DxRxC)',
                            clearance: 'Khoảng sáng gầm',
                            fuelEconomy: 'Tiêu hao nhiên liệu'
                        };
                        let listItems = [];
                        Object.entries(rawSpecs).forEach(([key, val]) => {
                            if (val && typeof val === 'string') {
                                const label = oldKeyLabels[key] || key;
                                listItems.push(`<li><strong>${label}</strong>: ${val}</li>`);
                            }
                        });
                        const content = listItems.length > 0 ? `<ul>${listItems.join('')}</ul>` : '';
                        if (content) {
                            customSpecs = [
                                { title: 'Thông số chung', content: content }
                            ];
                        }
                    }
                }

                if (customSpecs.length === 0) {
                    customSpecs = [
                        { title: 'Vận hành', content: '' },
                        { title: 'Thiết kế bánh xe', content: '' },
                        { title: 'Ngoại thất', content: '' },
                        { title: 'Nội thất', content: '' },
                        { title: 'Công nghệ', content: '' },
                        { title: 'Hỗ trợ Người Lái & An toàn', content: '' }
                    ];
                }

                const verData = {
                    id: ver.id,
                    price: ver.price ?? 0,
                    status: ver.status ?? 'ACTIVE',
                    sort_order: ver.sort_order ?? 0,
                    image: ver.image ?? null,
                    image_thumbnail: ver.image_thumbnail ?? null,
                    showSpecs: false,
                    customSpecs: customSpecs,
                    specs: customSpecs,
                    colors: (ver.colors || []).map(col => {
                        let code = col.color_code ?? col.hex ?? '';
                        if (code && !code.startsWith('#')) {
                            code = '#' + code;
                        }
                        return {
                            name: col.name ?? col.color_name ?? '',
                            color_code: code || '#cbd5e1',
                            images_360: col.images_360 ?? [],
                            image_360_internal: col.image_360_internal ?? null,
                            images_360_internal: col.images_360_internal ?? [],
                        };
                    })
                }
                locales.forEach(loc => {
                    let trans = null
                    if (ver.translations && Array.isArray(ver.translations)) {
                        trans = ver.translations.find(t => t.locale === loc)
                    }
                    const fallback = loc === 'vi' ? ver : {}
                    verData[loc] = {
                        name: trans?.name ?? fallback.name ?? ''
                    }
                })
                return verData
            })

            return data
        },



        addVersion(form) {
            if (!form.versions) form.versions = []
            
            const defaultSpecs = [
                { title: 'Vận hành', content: '' },
                { title: 'Thiết kế bánh xe', content: '' },
                { title: 'Ngoại thất', content: '' },
                { title: 'Nội thất', content: '' },
                { title: 'Công nghệ', content: '' },
                { title: 'Hỗ trợ Người Lái & An toàn', content: '' }
            ];

            form.versions.push({
                price: 0,
                status: 'ACTIVE',
                sort_order: form.versions.length + 1,
                image: null,
                image_thumbnail: null,
                showSpecs: true,
                customSpecs: defaultSpecs,
                specs: defaultSpecs,
                vi: { name: '' },
                en: { name: '' }
            })
            this.activeVersionIndex = form.versions.length - 1
        },

        removeVersion(form, index) {
            if (form.versions) {
                form.versions.splice(index, 1)
                if (this.activeVersionIndex >= form.versions.length) {
                    this.activeVersionIndex = Math.max(0, form.versions.length - 1)
                }
            }
        },

        duplicateVersion(form, index) {
            const ver = form.versions[index];
            if (!ver) return;

            const cloneObject = (obj) => {
                if (obj === null || typeof obj !== 'object') return obj;
                if (obj instanceof File) return obj;
                if (obj instanceof Date) return new Date(obj.getTime());
                if (Array.isArray(obj)) return obj.map(item => cloneObject(item));
                const cloned = {};
                for (const key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        cloned[key] = cloneObject(obj[key]);
                    }
                }
                return cloned;
            };

            const clonedVersion = cloneObject(ver);
            
            // Adjust properties to indicate a copy
            if (clonedVersion.vi && clonedVersion.vi.name) {
                clonedVersion.vi.name = `${clonedVersion.vi.name} (Bản sao)`;
            }
            if (clonedVersion.en && clonedVersion.en.name) {
                clonedVersion.en.name = `${clonedVersion.en.name} (Copy)`;
            }
            clonedVersion.id = undefined; // Force backend to treat it as a new version
            clonedVersion.sort_order = form.versions.length + 1;

            form.versions.push(clonedVersion);
            this.activeVersionIndex = form.versions.length - 1;
        },

        handleCloneColorsFromVersion(form, event) {
            const sourceIndex = event.target.value;
            if (sourceIndex === "" || sourceIndex === undefined || sourceIndex === null) return;
            
            const sourceVer = form.versions[sourceIndex];
            const targetVer = form.versions[this.activeVersionIndex];
            
            if (sourceVer && targetVer && sourceVer.colors && sourceVer.colors.length > 0) {
                if (confirm(`Bạn có chắc chắn muốn sao chép toàn bộ bảng màu từ phiên bản "${sourceVer.vi?.name || 'này'}" không? Bảng màu cũ của phiên bản hiện tại sẽ bị xóa.`)) {
                    const cloneObject = (obj) => {
                        if (obj === null || typeof obj !== 'object') return obj;
                        if (obj instanceof File) return obj;
                        if (Array.isArray(obj)) return obj.map(item => cloneObject(item));
                        const cloned = {};
                        for (const key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                                cloned[key] = cloneObject(obj[key]);
                            }
                        }
                        return cloned;
                    };
                    targetVer.colors = cloneObject(sourceVer.colors);
                }
            } else {
                alert("Phiên bản được chọn không có cấu hình màu sắc nào.");
            }
            // Reset dropdown
            event.target.value = "";
        },

        handleCloneSpecsFromVersion(form, event) {
            const sourceIndex = event.target.value;
            if (sourceIndex === "" || sourceIndex === undefined || sourceIndex === null) return;
            
            const sourceVer = form.versions[sourceIndex];
            const targetVer = form.versions[this.activeVersionIndex];
            
            if (sourceVer && targetVer && sourceVer.customSpecs && sourceVer.customSpecs.length > 0) {
                if (confirm(`Bạn có chắc chắn muốn sao chép thông số kỹ thuật từ phiên bản "${sourceVer.vi?.name || 'này'}" không? Thông số cũ của phiên bản hiện tại sẽ bị ghi đè.`)) {
                    const cloneObject = (obj) => {
                        if (obj === null || typeof obj !== 'object') return obj;
                        if (obj instanceof File) return obj;
                        if (Array.isArray(obj)) return obj.map(item => cloneObject(item));
                        const cloned = {};
                        for (const key in obj) {
                            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                                cloned[key] = cloneObject(obj[key]);
                            }
                        }
                        return cloned;
                    };
                    targetVer.customSpecs = cloneObject(sourceVer.customSpecs);
                }
            } else {
                alert("Phiên bản được chọn không có thông số kỹ thuật nào.");
            }
            // Reset dropdown
            event.target.value = "";
        },

        executeSpecsImport(form) {
            if (!this.specsImportText || !this.specsImportText.trim()) {
                alert("Vui lòng dán nội dung thông số kỹ thuật trước khi bấm xử lý.");
                return;
            }

            const lines = this.specsImportText.split('\n').map(l => l.trim()).filter(Boolean);
            const parsedGroups = [];
            let currentGroup = null;

            const knownCategories = [
                'vận hành', 'thiết kế bánh xe', 'ngoại thất', 'nội thất', 'công nghệ', 
                'hỗ trợ người lái & an toàn', 'an toàn', 'kích thước', 'động cơ & hộp số',
                'hệ thống treo', 'tiêu hao nhiên liệu', 'trang bị'
            ];

            lines.forEach(line => {
                const lowerLine = line.toLowerCase();
                const isHeader = knownCategories.includes(lowerLine) || 
                                 (line.length < 40 && !line.includes(':') && !line.startsWith('-') && !line.match(/^\d+\./));

                if (isHeader) {
                    currentGroup = {
                        title: line,
                        items: []
                    };
                    parsedGroups.push(currentGroup);
                } else {
                    if (!currentGroup) {
                        currentGroup = {
                            title: 'Thông số chung',
                            items: []
                        };
                        parsedGroups.push(currentGroup);
                    }
                    currentGroup.items.push(line);
                }
            });

            const ver = form.versions[this.activeVersionIndex];
            if (!ver.customSpecs) ver.customSpecs = [];

            parsedGroups.forEach(g => {
                const contentHtml = `<ul class="list-disc pl-4 space-y-1">\n` + 
                    g.items.map(item => {
                        const colonIndex = item.indexOf(':');
                        if (colonIndex > -1) {
                            const key = item.substring(0, colonIndex).trim();
                            const val = item.substring(colonIndex + 1).trim();
                            return `  <li>${key}: <strong>${val}</strong></li>`;
                        }
                        return `  <li>${item}</li>`;
                    }).join('\n') + 
                    `\n</ul>`;

                const existing = ver.customSpecs.find(s => s.title.toLowerCase() === g.title.toLowerCase());
                if (existing) {
                    existing.content = existing.content ? (existing.content + '<br/>' + contentHtml) : contentHtml;
                } else {
                    ver.customSpecs.push({
                        title: g.title,
                        content: contentHtml
                    });
                }
            });

            this.specsImportText = '';
            this.showSpecsImportModal = false;
            alert("Đã nhập thông số thành công!");
        },

        addCustomSpec(form, versionIndex) {
            const ver = form.versions[versionIndex];
            if (!ver.customSpecs) {
                ver.customSpecs = [];
            }
            form.versions[versionIndex].customSpecs.push({ title: '', content: '' });
        },

        removeCustomSpec(form, versionIndex, specIndex) {
            const ver = form.versions[versionIndex];
            if (ver.customSpecs) {
                form.versions[versionIndex].customSpecs.splice(specIndex, 1);
            }
        },

        addVersionColor(form, versionIndex) {
            const ver = form.versions[versionIndex];
            if (!ver.colors) {
                form.versions[versionIndex].colors = [];
            }
            form.versions[versionIndex].colors.push({
                name: '',
                color_code: '#cbd5e1',
                images_360: [],
                image_360_internal: null,
                images_360_internal: [],
            });
        },

        removeVersionColor(form, versionIndex, colorIndex) {
            const ver = form.versions[versionIndex];
            if (ver && ver.colors) {
                form.versions[versionIndex].colors.splice(colorIndex, 1);
            }
        },

        toggleAccessorySelection(id) {
            if (!this.formData.accessories) {
                this.formData.accessories = [];
            }
            const idx = this.formData.accessories.findIndex(item => String(item) === String(id));
            if (idx > -1) {
                this.formData.accessories.splice(idx, 1);
            } else {
                this.formData.accessories.push(id);
            }
        },

        isAccessorySelected(id) {
            return (this.formData.accessories || []).some(item => String(item) === String(id));
        },

        getCategoryLabel(category) {
            const labels = {
                interior: 'Nội thất',
                exterior: 'Ngoại thất',
                tech: 'Công nghệ',
                wheels: 'Mâm & Lốp',
                performance: 'Hiệu suất'
            };
            return labels[category] || category;
        },

        isInitiallyFit(acc) {
            const vehicleTitle = this.formData.vi?.title || this.formData.title;
            if (!vehicleTitle || !acc.fit_vehicles) return false;
            return acc.fit_vehicles.some(v => typeof v === 'string' && v.toLowerCase().trim() === vehicleTitle.toLowerCase().trim());
        },

        openCreateAccessoryModal() {
            this.isEditAccessory = false;
            this.editingAccessoryId = null;
            this.newAccessoryForm = {
                brand_id: null,
                code: '',
                price: 0,
                categories: [],
                image: null,
                images: [],
                features: [],
                vehicles: [],
                brochure_url: '',
                brochure_file: null,
                vi: {
                    title: '',
                    description: '',
                    compatibility_text: '',
                    safety_text: '',
                    product_desc_text: '',
                },
                en: {
                    title: '',
                    description: '',
                    compatibility_text: '',
                    safety_text: '',
                    product_desc_text: '',
                }
            };
            this.modalTab = 'vi';
            console.log('Vehicle Form props data:', this.data);
            this.showCreateAccessoryModal = true;
        },

        closeCreateAccessoryModal() {
            this.showCreateAccessoryModal = false;
            this.isEditAccessory = false;
            this.editingAccessoryId = null;
        },

        async openEditAccessoryModal(acc) {
            this.isSavingAccessory = true;
            this.isEditAccessory = true;
            this.editingAccessoryId = acc.id;
            this.modalTab = 'vi';

            this.newAccessoryForm = {
                brand_id: null,
                code: '',
                price: 0,
                categories: [],
                image: null,
                images: [],
                features: [],
                vehicles: [],
                brochure_url: '',
                brochure_file: null,
                vi: {
                    title: '',
                    description: '',
                    compatibility_text: '',
                    safety_text: '',
                    product_desc_text: '',
                },
                en: {
                    title: '',
                    description: '',
                    compatibility_text: '',
                    safety_text: '',
                    product_desc_text: '',
                }
            };

            try {
                const url = this.route('admin.accessories.form', { id: acc.id });
                const response = await this.$axios.get(url, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
                });

                if (response.data) {
                    const data = response.data;
                    
                    this.newAccessoryForm.brand_id = data.brand_id || null;
                    this.newAccessoryForm.code = data.code || '';
                    this.newAccessoryForm.price = data.price || 0;
                    this.newAccessoryForm.image = data.image || null;
                    this.newAccessoryForm.images = data.images || [];
                    this.newAccessoryForm.brochure_url = data.brochure_url || '';
                    this.newAccessoryForm.brochure_file = data.brochure_file || null;
                    
                    if (Array.isArray(data.categories)) {
                        this.newAccessoryForm.categories = data.categories.map(c => c.id);
                    } else {
                        this.newAccessoryForm.categories = [];
                    }

                    this.newAccessoryForm.features = Array.isArray(data.features) ? [...data.features] : [];
                    this.newAccessoryForm.vehicles = Array.isArray(data.vehicles) ? [...data.vehicles] : [];

                    const translations = data.translations || [];
                    const viTrans = translations.find(t => t.locale === 'vi') || {};
                    const enTrans = translations.find(t => t.locale === 'en') || {};

                    this.newAccessoryForm.vi = {
                        title: viTrans.title || data.title || '',
                        description: viTrans.description || '',
                        compatibility_text: viTrans.compatibility_text || '',
                        safety_text: viTrans.safety_text || '',
                        product_desc_text: viTrans.product_desc_text || '',
                    };

                    this.newAccessoryForm.en = {
                        title: enTrans.title || '',
                        description: enTrans.description || '',
                        compatibility_text: enTrans.compatibility_text || '',
                        safety_text: enTrans.safety_text || '',
                        product_desc_text: enTrans.product_desc_text || '',
                    };

                    this.showCreateAccessoryModal = true;
                }
            } catch (error) {
                console.error(error);
                alert('Không thể tải thông tin phụ kiện. Lỗi: ' + (error.response?.data?.message || error.message));
            } finally {
                this.isSavingAccessory = false;
            }
        },

        addModalFeature() {
            if (!this.newAccessoryForm.features) {
                this.newAccessoryForm.features = [];
            }
            this.newAccessoryForm.features.push('');
        },

        removeModalFeature(idx) {
            if (this.newAccessoryForm.features) {
                this.newAccessoryForm.features.splice(idx, 1);
            }
        },

        getCategoryKeyById(id) {
            const cat = (this.data.accessory_categories || []).find(c => String(c.id) === String(id));
            if (!cat) return 'exterior';
            const slug = String(cat.slug || cat.title || '').toLowerCase();
            if (slug.includes('noi-that') || slug.includes('interior')) return 'interior';
            if (slug.includes('ngoai-that') || slug.includes('exterior')) return 'exterior';
            if (slug.includes('cong-nghe') || slug.includes('tech')) return 'tech';
            if (slug.includes('mam') || slug.includes('wheel')) return 'wheels';
            if (slug.includes('hieu-suat') || slug.includes('performance')) return 'performance';
            return 'exterior';
        },

        async saveNewAccessory() {
            if (!this.newAccessoryForm.vi.title || !this.newAccessoryForm.vi.title.trim()) {
                alert('Vui lòng nhập tên phụ kiện (Tiếng Việt)!');
                return;
            }

            try {
                this.isSavingAccessory = true;
                const vehicleTitle = this.formData.vi?.title || this.formData.title;

                let vehiclesPayload = [];
                if (this.isEditAccessory) {
                    vehiclesPayload = (this.newAccessoryForm.vehicles || []).map(v => ({ id: v.id }));
                    if (this.formData.id && !vehiclesPayload.some(v => String(v.id) === String(this.formData.id))) {
                        vehiclesPayload.push({ id: this.formData.id });
                    }
                } else {
                    vehiclesPayload = this.formData.id ? [{ id: this.formData.id }] : [];
                }

                const payload = {
                    status: 'ACTIVE',
                    brand_id: this.newAccessoryForm.brand_id || null,
                    code: this.newAccessoryForm.code || '',
                    price: this.newAccessoryForm.price || 0,
                    image: this.newAccessoryForm.image || null,
                    images: this.newAccessoryForm.images || [],
                    categories: (this.newAccessoryForm.categories || []).map(id => ({ id })),
                    features: this.newAccessoryForm.features || [],
                    fit_vehicles: this.isEditAccessory ? (this.newAccessoryForm.fit_vehicles || []) : (vehicleTitle ? [vehicleTitle] : []),
                    vehicles: vehiclesPayload,
                    brochure_url: this.newAccessoryForm.brochure_url || '',
                    brochure_file: this.newAccessoryForm.brochure_file || null,
                    vi: {
                        title: this.newAccessoryForm.vi.title,
                        description: this.newAccessoryForm.vi.description || '',
                        compatibility_text: this.newAccessoryForm.vi.compatibility_text || '',
                        safety_text: this.newAccessoryForm.vi.safety_text || '',
                        product_desc_text: this.newAccessoryForm.vi.product_desc_text || '',
                    },
                    en: {
                        title: this.newAccessoryForm.en.title || '',
                        description: this.newAccessoryForm.en.description || '',
                        compatibility_text: this.newAccessoryForm.en.compatibility_text || '',
                        safety_text: this.newAccessoryForm.en.safety_text || '',
                        product_desc_text: this.newAccessoryForm.en.product_desc_text || '',
                    }
                };

                let response;
                if (this.isEditAccessory) {
                    const url = this.route('admin.accessories.store', { id: this.editingAccessoryId });
                    response = await this.$axios.post(url, payload);
                } else {
                    response = await this.$axios.post(this.route('admin.accessories.store'), payload);
                }
                
                if (response.data && response.data.id) {
                    const savedAcc = {
                        id: response.data.id,
                        title: payload.vi.title,
                        code: payload.code,
                        category: (this.newAccessoryForm.categories && this.newAccessoryForm.categories.length > 0)
                            ? this.getCategoryKeyById(this.newAccessoryForm.categories[0])
                            : 'exterior',
                        fit_vehicles: payload.fit_vehicles,
                        image: response.data.image || payload.image,
                        brochure_url: payload.brochure_url,
                        brochure_file: response.data.brochure_file || payload.brochure_file,
                    };

                    if (this.isEditAccessory) {
                        // Update in local accessories list options
                        if (this.data.accessories) {
                            const idx = this.data.accessories.findIndex(acc => acc.id === savedAcc.id);
                            if (idx !== -1) {
                                this.data.accessories.splice(idx, 1, savedAcc);
                            }
                        }
                        this.closeCreateAccessoryModal();
                        alert('Cập nhật phụ kiện thành công!');
                    } else {
                        // Add to local accessories list options
                        if (!this.data.accessories) {
                            this.data.accessories = [];
                        }
                        this.data.accessories.unshift(savedAcc);

                        // Auto-select the newly created accessory
                        if (!this.formData.accessories) {
                            this.formData.accessories = [];
                        }
                        this.formData.accessories.push(savedAcc.id);

                        this.closeCreateAccessoryModal();
                        alert('Tạo phụ kiện mới thành công!');
                    }
                } else {
                    throw new Error('Không nhận được dữ liệu phản hồi hợp lệ từ server.');
                }
            } catch (error) {
                console.error(error);
                const actionText = this.isEditAccessory ? 'cập nhật' : 'tạo';
                const errorMsg = error.response?.data?.message || error.message || `Có lỗi xảy ra khi ${actionText} phụ kiện.`;
                alert('Lỗi: ' + errorMsg);
            } finally {
                this.isSavingAccessory = false;
            }
        },
        addFeatureCategory() {
            if (!this.newCategoryName || !this.newCategoryName.trim()) return;
            const name = this.newCategoryName.trim();
            if (!this.featureCategories.includes(name)) {
                this.featureCategories = [...this.featureCategories, name];
            }
            this.newCategoryName = '';
        },
        removeFeatureCategory(idx) {
            this.featureCategories = this.featureCategories.filter((_, i) => i !== idx);
        },
        getFeatureImage(image) {
            if (!image) return null;
            if (typeof image === 'string') {
                if (image.startsWith('http') || image.startsWith('/')) return image;
                return '/static/' + image;
            }
            if (image.path) {
                return '/static/' + image.path;
            }
            if (image.url) {
                return image.url;
            }
            return null;
        },
        addFeature() {
            if (!this.formData.layout_blocks) this.formData.layout_blocks = [];
            let block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
            if (!block) {
                block = {
                    type: 'FeaturesList',
                    data: {
                        features: [],
                        categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"]
                    }
                };
                this.formData.layout_blocks.push(block);
            }
            if (!block.data) {
                block.data = { features: [], categories: ["Thiết kế", "Vận hành", "Công nghệ", "An toàn"] };
            }
            if (!block.data.features) {
                block.data.features = [];
            }
            block.data.features.push({
                title: '',
                desc: '',
                description: '',
                image: null,
                category: block.data.categories?.[0] || 'Thiết kế'
            });
            this.activeFeatureIndex = block.data.features.length - 1;
        },
        removeFeature(idx) {
            if (!this.formData.layout_blocks) return;
            let block = this.formData.layout_blocks.find(b => b.type === 'FeaturesList');
            if (block && block.data && block.data.features) {
                block.data.features.splice(idx, 1);
                if (this.activeFeatureIndex >= block.data.features.length) {
                    this.activeFeatureIndex = Math.max(0, block.data.features.length - 1);
                }
            }
        }
    },
}
</script>
