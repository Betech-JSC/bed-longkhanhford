<template>
    <div 
        class="page-builder-container flex flex-col md:flex-row bg-[#f6f6f7] overflow-hidden font-sans"
        :class="fullscreen ? 'h-full w-full rounded-none border-0 gap-0' : 'h-[calc(100vh-120px)] min-h-[750px] gap-6 border border-gray-200 rounded-2xl'"
    >
        <!-- LEFT PANEL: Sidebar Settings (4/12 width equivalent) -->
        <div 
            v-if="!isSidebarCollapsed"
            class="w-full md:w-[420px] flex flex-col bg-white border-r border-gray-200 h-full overflow-hidden select-none"
        >
            <!-- Sidebar Header -->
            <div class="px-5 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                <div class="flex items-center space-x-2">
                    <span class="flex h-3 w-3 rounded-full bg-[#008060] animate-pulse"></span>
                    <h3 class="text-sm font-bold text-gray-800 tracking-wide uppercase">Cấu hình giao diện</h3>
                </div>
                <div class="flex items-center space-x-2">
                    <!-- Back Button when editing a specific block -->
                    <button 
                        v-if="activeIndex !== null" 
                        type="button" 
                        class="flex items-center text-xs font-semibold text-gray-650 hover:text-gray-900 transition bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg border border-gray-300 cursor-pointer"
                        @click="activeIndex = null"
                    >
                        <span class="mr-1">←</span> Danh sách
                    </button>
                    <!-- Collapse Button -->
                    <button
                        type="button"
                        class="flex items-center text-xs font-semibold text-gray-650 hover:text-gray-900 transition bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg border border-gray-300 cursor-pointer"
                        @click="isSidebarCollapsed = true"
                        title="Thu gọn sidebar"
                    >
                        ←
                    </button>
                </div>
            </div>

            <!-- Tab Buttons (Only shown when not editing a specific block) -->
            <div v-if="activeIndex === null" class="flex border-b border-gray-200 bg-gray-50 p-2">
                <button 
                    type="button"
                    class="flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer border-0"
                    :class="activeTab === 'sections' ? 'bg-[#008060] text-white shadow-xs' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-150 bg-transparent'"
                    @click="activeTab = 'sections'"
                >
                    📁 Khối hiển thị ({{ blocks.length }})
                </button>
                <button 
                    type="button"
                    class="flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition duration-200 cursor-pointer border-0"
                    :class="activeTab === 'library' ? 'bg-[#008060] text-white shadow-xs' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-150 bg-transparent'"
                    @click="activeTab = 'library'"
                >
                    ✨ Thêm khối mới
                </button>
            </div>

            <!-- Scrollable Content of Left Sidebar -->
            <div class="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent bg-white">
                <!-- SCENE A: ACTIVE BLOCK DETAILS EDITOR -->
                <div v-if="activeIndex !== null && blocks[activeIndex]" class="space-y-5">
                    <div class="bg-gray-50 p-4 border border-gray-200 rounded-xl">
                        <div class="text-[10px] uppercase font-bold text-[#008060] mb-1">Đang chỉnh sửa</div>
                        <h4 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <span>{{ getBlockIcon(blocks[activeIndex].type) }}</span>
                            <span>{{ getBlockLabel(blocks[activeIndex].type) }}</span>
                        </h4>
                    </div>

                    <!-- Fields Editor Content based on Selected Block Type -->
                    <div class="space-y-4">
                        <!-- 1. HeroBanner Edit Form -->
                        <div v-if="blocks[activeIndex].type === 'HeroBanner'" class="space-y-4">
                            <div class="relative">
                                <button type="button" @click="openAIModal('HeroBanner', 'title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.title" :field="{
                                    type: 'text',
                                    name: 'hb_title_' + activeIndex,
                                    label: 'Tiêu đề lớn (Title)',
                                    placeholder: 'vd: FORD EVEREST MỚI',
                                }" />
                            </div>
                            <div class="relative">
                                <button type="button" @click="openAIModal('HeroBanner', 'tagline', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.tagline" :field="{
                                    type: 'text',
                                    name: 'hb_tag_' + activeIndex,
                                    label: 'Tagline / Slogan',
                                    placeholder: 'vd: Dấn bước. Dẫn đầu.',
                                }" />
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model="blocks[activeIndex].data.button_text" :field="{
                                    type: 'text',
                                    name: 'hb_btxt_' + activeIndex,
                                    label: 'Nhãn nút bấm',
                                }" />
                                <Field v-model="blocks[activeIndex].data.button_link" :field="{
                                    type: 'text',
                                    name: 'hb_blink_' + activeIndex,
                                    label: 'Liên kết nút bấm',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.background_image" :field="{
                                type: 'file_upload',
                                name: 'hb_bg_' + activeIndex,
                                label: 'Hình ảnh nền (Background)',
                                urlOnly: true,
                            }" />
                        </div>

                        <!-- LDP Sales Consultant Block Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'LdpSalesConsultant'" class="space-y-4">
                            <Field
                                v-model="vehicleData.sales_consultant_id"
                                :field="{
                                    type: 'dropdown',
                                    name: 'sales_consultant_id',
                                    label: 'Cố vấn phụ trách (Sales)',
                                    options: salesConsultants,
                                    emptyLabel: '-- Chọn cố vấn bán hàng --',
                                }"
                            />
                            <div class="text-xs text-gray-500 italic mt-2">
                                ℹ️ Khối này tự động hiển thị Banner thông tin chi tiết của cố vấn được chọn (tên, avatar, số điện thoại, nút gọi/nhận báo giá).
                            </div>
                        </div>

                        <!-- LDP Promotions Block Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'LdpPromotions'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'ldp_promo_title_' + activeIndex,
                                label: 'Tiêu đề khối khuyến mãi',
                                placeholder: 'vd: Chương Trình Khuyến Mãi Đặc Biệt',
                            }" />
                            <Field v-model="blocks[activeIndex].data.description" :field="{
                                type: 'textarea',
                                name: 'ldp_promo_desc_' + activeIndex,
                                label: 'Mô tả ngắn',
                                placeholder: 'vd: Nhận ưu đãi độc quyền từ Cố vấn khi đăng ký mua xe trong tháng này.',
                            }" />

                            <!-- Khuyến mãi hệ thống (Global) -->
                            <div class="border-t border-gray-200 pt-3">
                                <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">1. Khuyến mãi chung từ hệ thống</label>
                                <div class="space-y-2 max-h-48 overflow-y-auto pr-1 border rounded p-2 bg-white">
                                    <div v-for="promo in globalPromotions" :key="promo.id" class="flex items-start space-x-2 py-1">
                                        <input
                                            type="checkbox"
                                            :id="'editor-promo-' + promo.id"
                                            :value="promo.id"
                                            v-model="vehicleData.promotions.global_promotion_ids"
                                            class="mt-0.5 h-3.5 w-3.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                        />
                                        <label :for="'editor-promo-' + promo.id" class="text-xs font-medium text-gray-700 cursor-pointer">
                                            {{ promo.title }}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <!-- Khuyến mãi tự nhập (Custom) -->
                            <div class="border-t border-gray-200 pt-3">
                                <label class="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">2. Khuyến mãi riêng của bạn (Tự nhập)</label>
                                <div v-for="(promo, index) in (vehicleData.promotions ? vehicleData.promotions.custom_promotions : [])" :key="index" class="border border-gray-200 rounded p-3 mb-2 bg-gray-50/50 relative">
                                    <button type="button" class="absolute top-2 right-2 text-red-500 text-[10px] font-bold hover:underline" @click="vehicleData.promotions.custom_promotions.splice(index, 1)">❌ Xoá</button>
                                    <Field v-model="vehicleData.promotions.custom_promotions[index].title" :field="{ type: 'text', name: 'c_title_' + index, label: 'Tiêu đề' }" class="mb-1" />
                                    <Field v-model="vehicleData.promotions.custom_promotions[index].description" :field="{ type: 'textarea', name: 'c_desc_' + index, label: 'Mô tả chi tiết' }" />
                                </div>
                                <button type="button" class="btn btn-outline-primary btn-xs mt-1" @click="addCustomPromoToVehicleData">➕ Thêm khuyến mãi riêng</button>
                            </div>
                        </div>

                        <!-- 2. Promotions Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'Promotions'" class="space-y-4">
                            <div class="relative">
                                <button type="button" @click="openAIModal('Promotions', 'title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.title" :field="{
                                    type: 'text',
                                    name: 'pr_title_' + activeIndex,
                                    label: 'Tiêu đề khuyến mãi',
                                    placeholder: 'vd: Chương trình khuyến mãi đặc biệt',
                                }" />
                            </div>
                            <div class="relative">
                                <button type="button" @click="openAIModal('Promotions', 'description', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.description" :field="{
                                    type: 'textarea',
                                    name: 'pr_desc_' + activeIndex,
                                    label: 'Nội dung ngắn khuyến mãi',
                                }" />
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model="blocks[activeIndex].data.button_text" :field="{
                                    type: 'text',
                                    name: 'pr_btxt_' + activeIndex,
                                    label: 'Nhãn nút bấm',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.image" :field="{
                                type: 'file_upload',
                                name: 'pr_img_' + activeIndex,
                                label: 'Ảnh banner khuyến mãi',
                                urlOnly: true,
                            }" />
                        </div>

                        <!-- 3. ThreeSixtyViewer Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'ThreeSixtyViewer'" class="space-y-4">
                            <div class="relative">
                                <button type="button" @click="openAIModal('ThreeSixtyViewer', 'title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.title" :field="{
                                    type: 'text',
                                    name: 'tsv_title_' + activeIndex,
                                    label: 'Tiêu đề khối 360',
                                }" />
                            </div>
                            <div class="relative">
                                <button type="button" @click="openAIModal('ThreeSixtyViewer', 'description', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.description" :field="{
                                    type: 'textarea',
                                    name: 'tsv_desc_' + activeIndex,
                                    label: 'Mô tả ngắn',
                                }" />
                            </div>
                        </div>

                        <!-- 4. FeaturesGrid Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'FeaturesGrid'" class="space-y-4">
                            <div class="border-b border-slate-800 pb-3 mb-3">
                                <span class="text-xs font-bold text-blue-400"># PHẦN 1: THIẾT KẾ</span>
                                <div class="mt-2 space-y-3">
                                    <div class="relative">
                                        <button type="button" @click="openAIModal('FeaturesGrid', 'title_1', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                            ✨ AI viết
                                        </button>
                                        <Field v-model="blocks[activeIndex].data.title_1" :field="{
                                            type: 'text',
                                            name: 'fg_t1_' + activeIndex,
                                            label: 'Tiêu đề nhóm 1',
                                        }" />
                                    </div>
                                    <Field v-model="blocks[activeIndex].data.image_1" :field="{
                                        type: 'file_upload',
                                        name: 'fg_img1_' + activeIndex,
                                        label: 'Ảnh lưới 1 (Ảnh lớn trên)',
                                        urlOnly: true,
                                    }" />
                                    <div class="grid grid-cols-2 gap-3">
                                        <Field v-model="blocks[activeIndex].data.image_2" :field="{
                                            type: 'file_upload',
                                            name: 'fg_img2_' + activeIndex,
                                            label: 'Ảnh lưới 2 (dưới trái)',
                                            urlOnly: true,
                                        }" />
                                        <Field v-model="blocks[activeIndex].data.image_3" :field="{
                                            type: 'file_upload',
                                            name: 'fg_img3_' + activeIndex,
                                            label: 'Ảnh lưới 3 (dưới phải)',
                                            urlOnly: true,
                                        }" />
                                    </div>
                                </div>
                            </div>

                            <div class="border-b border-slate-800 pb-3 mb-3">
                                <span class="text-xs font-bold text-blue-400"># PHẦN 2: NỘI THẤT</span>
                                <div class="mt-2 space-y-3">
                                    <div class="relative">
                                        <button type="button" @click="openAIModal('FeaturesGrid', 'title_2', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                            ✨ AI viết
                                        </button>
                                        <Field v-model="blocks[activeIndex].data.title_2" :field="{
                                            type: 'text',
                                            name: 'fg_t2_' + activeIndex,
                                            label: 'Tiêu đề nhóm 2',
                                        }" />
                                    </div>
                                    <Field v-model="blocks[activeIndex].data.image_large" :field="{
                                        type: 'file_upload',
                                        name: 'fg_img_l_' + activeIndex,
                                        label: 'Ảnh nội thất lớn (Trái)',
                                        urlOnly: true,
                                    }" />
                                    <div class="grid grid-cols-2 gap-3">
                                        <Field v-model="blocks[activeIndex].data.image_large_2" :field="{
                                            type: 'file_upload',
                                            name: 'fg_img_l2_' + activeIndex,
                                            label: 'Ảnh phụ 1 (Phải trên)',
                                            urlOnly: true,
                                        }" />
                                        <Field v-model="blocks[activeIndex].data.image_large_3" :field="{
                                            type: 'file_upload',
                                            name: 'fg_img_l3_' + activeIndex,
                                            label: 'Ảnh phụ 2 (Phải dưới)',
                                            urlOnly: true,
                                        }" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span class="text-xs font-bold text-blue-400"># PHẦN 3: CÔNG NGHỆ VÀ THÔNG SỐ NỔI BẬT</span>
                                <div class="mt-2 space-y-3">
                                    <div class="relative">
                                        <button type="button" @click="openAIModal('FeaturesGrid', 'title_3', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                            ✨ AI viết
                                        </button>
                                        <Field v-model="blocks[activeIndex].data.title_3" :field="{
                                            type: 'text',
                                            name: 'fg_t3_' + activeIndex,
                                            label: 'Tiêu đề nhóm 3',
                                        }" />
                                    </div>
                                    <Field v-model="blocks[activeIndex].data.split_image" :field="{
                                        type: 'file_upload',
                                        name: 'fg_img_s_' + activeIndex,
                                        label: 'Ảnh công nghệ (Trái)',
                                        urlOnly: true,
                                    }" />
                                    <div class="relative">
                                        <button type="button" @click="openAIModal('FeaturesGrid', 'split_title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                            ✨ AI viết
                                        </button>
                                        <Field v-model="blocks[activeIndex].data.split_title" :field="{
                                            type: 'text',
                                            name: 'fg_split_title_' + activeIndex,
                                            label: 'Tiêu đề cột thông số (Phải)',
                                        }" />
                                    </div>
                                    
                                    <div class="space-y-2">
                                        <label class="text-xs font-semibold text-slate-300">Các chỉ số nổi bật:</label>
                                        <div v-for="(feat, featIndex) in blocks[activeIndex].data.split_features" :key="featIndex" class="flex gap-2 items-center bg-slate-900 border border-slate-800 p-2.5 rounded-xl relative">
                                            <input v-model="feat.value" type="text" class="w-1/3 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" placeholder="vd: 12-inch" />
                                            <input v-model="feat.label" type="text" class="w-2/3 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white" placeholder="vd: Màn hình dọc" />
                                            <button type="button" class="text-red-400 hover:text-red-500 font-bold ml-1 text-sm bg-slate-950/60 w-6 h-6 flex items-center justify-center rounded border border-slate-800" @click="removeSplitFeature(activeIndex, featIndex)">✕</button>
                                        </div>
                                        <button type="button" class="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 mt-1.5" @click="addSplitFeature(activeIndex)">
                                            + Thêm chỉ số
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 5. VersionsGrid Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'VersionsGrid'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'vg_title_' + activeIndex,
                                label: 'Tiêu đề danh sách phiên bản',
                            }" />
                            <div class="space-y-3">
                                <label class="text-xs font-semibold text-slate-300">Mô tả ngắn từng phiên bản:</label>
                                <div v-for="(desc, descIndex) in blocks[activeIndex].data.descriptions" :key="descIndex" class="space-y-1 bg-slate-900/50 p-3 border border-slate-800 rounded-xl">
                                    <span class="text-[10px] text-slate-400 uppercase font-bold">Phiên bản #{{ descIndex + 1 }}</span>
                                    <textarea 
                                        v-model="blocks[activeIndex].data.descriptions[descIndex]" 
                                        class="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white resize-none h-16 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                        placeholder="Nhập thông tin giới thiệu phiên bản..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <!-- 6. SpecsGrid Info -->
                        <div v-else-if="blocks[activeIndex].type === 'SpecsGrid'" class="p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 text-xs leading-relaxed">
                            💡 **Thông tin tự động:** Khối bảng so sánh thông số không cần cài đặt thêm nội dung. Nó sẽ tự động đồng bộ và hiển thị thông số chi tiết của các phiên bản xe đã lưu ở tab chung trên frontend.
                        </div>

                        <!-- 7. FeaturesList Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'FeaturesList'" class="space-y-4">
                            <div class="flex justify-between items-center">
                                <label class="text-xs font-bold text-slate-300">Danh sách tính năng:</label>
                                <button type="button" class="text-xs text-blue-400 hover:text-blue-300 font-bold" @click="addFeature(activeIndex)">
                                    + Thêm tính năng
                                </button>
                            </div>
                            <div v-for="(feat, fIndex) in blocks[activeIndex].data.features" :key="fIndex" class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                                <button type="button" class="absolute top-2.5 right-2.5 text-red-400 hover:text-red-500 font-bold text-xs" @click="removeFeature(activeIndex, fIndex)">✕ Xóa</button>
                                <span class="text-[9px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Tính năng #{{ fIndex + 1 }}</span>
                                
                                <div class="relative">
                                    <button type="button" @click="openAIModal('FeaturesList', 'title', activeIndex, fIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                        ✨ AI viết
                                    </button>
                                    <Field v-model="blocks[activeIndex].data.features[fIndex].title" :field="{
                                        type: 'text',
                                        name: 'fl_t_' + activeIndex + '_' + fIndex,
                                        label: 'Tên tính năng',
                                    }" />
                                </div>
                                <div class="relative">
                                    <button type="button" @click="openAIModal('FeaturesList', 'description', activeIndex, fIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                        ✨ AI viết
                                    </button>
                                    <Field v-model="blocks[activeIndex].data.features[fIndex].description" :field="{
                                        type: 'textarea',
                                        name: 'fl_d_' + activeIndex + '_' + fIndex,
                                        label: 'Mô tả ngắn',
                                    }" />
                                </div>
                                <Field v-model="blocks[activeIndex].data.features[fIndex].image" :field="{
                                    type: 'file_upload',
                                    name: 'fl_img_' + activeIndex + '_' + fIndex,
                                    label: 'Ảnh minh họa',
                                    urlOnly: true,
                                }" />
                            </div>
                        </div>

                        <!-- 8. AccordionFAQs Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'AccordionFAQs'" class="space-y-4">
                            <div class="flex justify-between items-center">
                                <label class="text-xs font-bold text-slate-300">Danh sách câu hỏi:</label>
                                <button type="button" class="text-xs text-blue-400 hover:text-blue-300 font-bold" @click="addFaq(activeIndex)">
                                    + Thêm câu hỏi
                                </button>
                            </div>
                            <div v-for="(faq, faqIndex) in blocks[activeIndex].data.faqs" :key="faqIndex" class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                                <button type="button" class="absolute top-2.5 right-2.5 text-red-400 hover:text-red-500 font-bold text-xs" @click="removeFaq(activeIndex, faqIndex)">✕ Xóa</button>
                                <span class="text-[9px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Câu hỏi #{{ faqIndex + 1 }}</span>
                                
                                <div class="relative">
                                    <button type="button" @click="openAIModal('AccordionFAQs', 'q', activeIndex, faqIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                        ✨ AI viết
                                    </button>
                                    <Field v-model="blocks[activeIndex].data.faqs[faqIndex].q" :field="{
                                        type: 'text',
                                        name: 'faq_q_' + activeIndex + '_' + faqIndex,
                                        label: 'Câu hỏi (Question)',
                                        placeholder: 'vd: Xe bảo hành bao lâu?',
                                    }" />
                                </div>
                                <div class="relative">
                                    <button type="button" @click="openAIModal('AccordionFAQs', 'a', activeIndex, faqIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                        ✨ AI viết
                                    </button>
                                    <Field v-model="blocks[activeIndex].data.faqs[faqIndex].a" :field="{
                                        type: 'textarea',
                                        name: 'faq_a_' + activeIndex + '_' + faqIndex,
                                        label: 'Câu trả lời (Answer)',
                                    }" />
                                </div>
                            </div>
                        </div>

                        <!-- 9. BookingBanner Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'BookingBanner'" class="space-y-4">
                            <div class="relative">
                                <button type="button" @click="openAIModal('BookingBanner', 'title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.title" :field="{
                                    type: 'text',
                                    name: 'bb_title_' + activeIndex,
                                    label: 'Tiêu đề Banner',
                                }" />
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model="blocks[activeIndex].data.phone" :field="{
                                    type: 'text',
                                    name: 'bb_phone_' + activeIndex,
                                    label: 'Số điện thoại',
                                }" />
                                <Field v-model="blocks[activeIndex].data.btn_text" :field="{
                                    type: 'text',
                                    name: 'bb_btn_text_' + activeIndex,
                                    label: 'Nhãn nút đặt lịch',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.btn_link" :field="{
                                type: 'text',
                                name: 'bb_btn_link_' + activeIndex,
                                label: 'Liên kết đặt lịch',
                            }" />
                            <Field v-model="blocks[activeIndex].data.car_image" :field="{
                                type: 'file_upload',
                                name: 'bb_car_image_' + activeIndex,
                                label: 'Ảnh xe đè',
                                urlOnly: true,
                            }" />
                        </div>

                        <!-- 10. TestimonialSlider Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'TestimonialSlider'" class="space-y-4">
                            <div class="relative">
                                <button type="button" @click="openAIModal('TestimonialSlider', 'title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.title" :field="{
                                    type: 'text',
                                    name: 'ts_title_' + activeIndex,
                                    label: 'Tiêu đề mục đánh giá',
                                    placeholder: 'vd: Khách hàng nói gì về chúng tôi?',
                                }" />
                            </div>
                            <div class="flex justify-between items-center">
                                <label class="text-xs font-bold text-slate-300">Danh sách đánh giá:</label>
                                <button type="button" class="text-xs text-blue-400 hover:text-blue-300 font-bold" @click="addTestimonial(activeIndex)">
                                    + Thêm đánh giá
                                </button>
                            </div>
                            <div v-for="(review, rIndex) in blocks[activeIndex].data.reviews" :key="rIndex" class="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 relative">
                                <button type="button" class="absolute top-2.5 right-2.5 text-red-400 hover:text-red-500 font-bold text-xs" @click="removeTestimonial(activeIndex, rIndex)">✕ Xóa</button>
                                <span class="text-[9px] uppercase font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">Đánh giá #{{ rIndex + 1 }}</span>
                                <Field v-model="blocks[activeIndex].data.reviews[rIndex].name" :field="{
                                    type: 'text',
                                    name: 'ts_name_' + activeIndex + '_' + rIndex,
                                    label: 'Tên khách hàng',
                                    placeholder: 'vd: Anh Nguyễn Văn A',
                                }" />
                                <div class="relative">
                                    <button type="button" @click="openAIModal('TestimonialSlider', 'content', activeIndex, rIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                        ✨ AI viết
                                    </button>
                                    <Field v-model="blocks[activeIndex].data.reviews[rIndex].content" :field="{
                                        type: 'textarea',
                                        name: 'ts_content_' + activeIndex + '_' + rIndex,
                                        label: 'Nội dung nhận xét',
                                        placeholder: 'vd: Rất hài lòng với dịch vụ tại Long Khánh Ford...',
                                    }" />
                                </div>
                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Số sao (1-5)</label>
                                        <select
                                            v-model.number="blocks[activeIndex].data.reviews[rIndex].rating"
                                            class="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        >
                                            <option :value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                                            <option :value="4">⭐⭐⭐⭐ (4 sao)</option>
                                            <option :value="3">⭐⭐⭐ (3 sao)</option>
                                            <option :value="2">⭐⭐ (2 sao)</option>
                                            <option :value="1">⭐ (1 sao)</option>
                                        </select>
                                    </div>
                                    <Field v-model="blocks[activeIndex].data.reviews[rIndex].role" :field="{
                                        type: 'text',
                                        name: 'ts_role_' + activeIndex + '_' + rIndex,
                                        label: 'Chức danh / Xe đã mua',
                                        placeholder: 'vd: Chủ xe Everest 2024',
                                    }" />
                                </div>
                                <Field v-model="blocks[activeIndex].data.reviews[rIndex].avatar" :field="{
                                    type: 'file_upload',
                                    name: 'ts_avatar_' + activeIndex + '_' + rIndex,
                                    label: 'Ảnh đại diện (tuỳ chọn)',
                                    urlOnly: true,
                                }" />
                            </div>
                        </div>

                        <!-- 11. VideoShowcase Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'VideoShowcase'" class="space-y-4">
                            <div class="relative">
                                <button type="button" @click="openAIModal('VideoShowcase', 'title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.title" :field="{
                                    type: 'text',
                                    name: 'vs_title_' + activeIndex,
                                    label: 'Tiêu đề mục video',
                                    placeholder: 'vd: Trải nghiệm Ford Everest trên mọi cung đường',
                                }" />
                            </div>
                            <div class="relative">
                                <button type="button" @click="openAIModal('VideoShowcase', 'description', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.description" :field="{
                                    type: 'textarea',
                                    name: 'vs_desc_' + activeIndex,
                                    label: 'Mô tả ngắn',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.video_url" :field="{
                                type: 'text',
                                name: 'vs_url_' + activeIndex,
                                label: 'Link video YouTube hoặc TikTok',
                                placeholder: 'vd: https://www.youtube.com/watch?v=...',
                            }" />
                            <Field v-model="blocks[activeIndex].data.thumbnail" :field="{
                                type: 'file_upload',
                                name: 'vs_thumb_' + activeIndex,
                                label: 'Ảnh thumbnail (nếu bỏ trống sẽ lấy tự động từ video)',
                                urlOnly: true,
                            }" />
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kiểu hiển thị</label>
                                <div class="grid grid-cols-2 gap-2">
                                    <button
                                        v-for="opt in [{value: 'embed', label: '▶ Nhúng trực tiếp'}, {value: 'lightbox', label: '🔳 Lightbox popup'}]"
                                        :key="opt.value"
                                        type="button"
                                        class="py-1.5 px-2 text-xs rounded-lg font-medium border transition-all text-center cursor-pointer"
                                        :class="(blocks[activeIndex].data.display_mode || 'embed') === opt.value ? 'bg-[#008060] text-white border-[#008060] shadow-xs' : 'bg-white text-gray-750 border-gray-300 hover:bg-gray-50'"
                                        @click="blocks[activeIndex].data.display_mode = opt.value"
                                    >
                                        {{ opt.label }}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 12. CountdownTimer Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'CountdownTimer'" class="space-y-4">
                            <div class="relative">
                                <button type="button" @click="openAIModal('CountdownTimer', 'title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.title" :field="{
                                    type: 'text',
                                    name: 'ct_title_' + activeIndex,
                                    label: 'Tiêu đề ưu đãi',
                                    placeholder: 'vd: Ưu đãi cuối tháng — Sắp kết thúc!',
                                }" />
                            </div>
                            <div class="relative">
                                <button type="button" @click="openAIModal('CountdownTimer', 'subtitle', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.subtitle" :field="{
                                    type: 'text',
                                    name: 'ct_subtitle_' + activeIndex,
                                    label: 'Dòng phụ (Subtitle)',
                                    placeholder: 'vd: Nhận ngay ưu đãi lên đến 100 triệu đồng',
                                }" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Ngày kết thúc</label>
                                <input
                                    type="datetime-local"
                                    v-model="blocks[activeIndex].data.end_date"
                                    class="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model="blocks[activeIndex].data.button_text" :field="{
                                    type: 'text',
                                    name: 'ct_btn_' + activeIndex,
                                    label: 'Nhãn nút bấm',
                                    placeholder: 'vd: Đăng ký ngay',
                                }" />
                                <Field v-model="blocks[activeIndex].data.button_link" :field="{
                                    type: 'text',
                                    name: 'ct_blink_' + activeIndex,
                                    label: 'Liên kết nút bấm',
                                    placeholder: 'vd: /lien-he',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.background_image" :field="{
                                type: 'file_upload',
                                name: 'ct_bg_' + activeIndex,
                                label: 'Ảnh nền (tuỳ chọn)',
                                urlOnly: true,
                            }" />
                        </div>

                        <!-- 13. ComparisonTable Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'ComparisonTable'" class="space-y-4">
                            <div class="relative">
                                <button type="button" @click="openAIModal('ComparisonTable', 'title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.title" :field="{
                                    type: 'text',
                                    name: 'cpt_title_' + activeIndex,
                                    label: 'Tiêu đề bảng so sánh',
                                    placeholder: 'vd: Ford Everest vs Toyota Fortuner',
                                }" />
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model="blocks[activeIndex].data.ford_name" :field="{
                                    type: 'text',
                                    name: 'cpt_ford_' + activeIndex,
                                    label: 'Tên xe Ford',
                                    placeholder: 'vd: Ford Everest',
                                }" />
                                <Field v-model="blocks[activeIndex].data.competitor_name" :field="{
                                    type: 'text',
                                    name: 'cpt_comp_' + activeIndex,
                                    label: 'Tên xe đối thủ',
                                    placeholder: 'vd: Toyota Fortuner',
                                }" />
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model="blocks[activeIndex].data.ford_image" :field="{
                                    type: 'file_upload',
                                    name: 'cpt_ford_img_' + activeIndex,
                                    label: 'Ảnh xe Ford',
                                    urlOnly: true,
                                }" />
                                <Field v-model="blocks[activeIndex].data.competitor_image" :field="{
                                    type: 'file_upload',
                                    name: 'cpt_comp_img_' + activeIndex,
                                    label: 'Ảnh xe đối thủ',
                                    urlOnly: true,
                                }" />
                            </div>
                            <div class="flex justify-between items-center">
                                <label class="text-xs font-bold text-slate-300">Tiêu chí so sánh:</label>
                                <button type="button" class="text-xs text-blue-400 hover:text-blue-300 font-bold" @click="addComparisonRow(activeIndex)">
                                    + Thêm tiêu chí
                                </button>
                            </div>
                            <div v-for="(row, rowIndex) in blocks[activeIndex].data.rows" :key="rowIndex" class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2 relative">
                                <button type="button" class="absolute top-2 right-2 text-red-400 hover:text-red-500 font-bold text-xs" @click="removeComparisonRow(activeIndex, rowIndex)">✕</button>
                                <Field v-model="blocks[activeIndex].data.rows[rowIndex].criteria" :field="{
                                    type: 'text',
                                    name: 'cpt_cr_' + activeIndex + '_' + rowIndex,
                                    label: 'Tiêu chí',
                                    placeholder: 'vd: Động cơ',
                                }" />
                                <div class="grid grid-cols-2 gap-2">
                                    <input v-model="blocks[activeIndex].data.rows[rowIndex].ford_value" type="text" class="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800" placeholder="Giá trị Ford" />
                                    <input v-model="blocks[activeIndex].data.rows[rowIndex].competitor_value" type="text" class="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-800" placeholder="Giá trị đối thủ" />
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase mb-1">Bên thắng</label>
                                    <div class="flex gap-2">
                                        <button type="button" class="flex-1 py-1 text-[10px] rounded font-bold border cursor-pointer"
                                            :class="blocks[activeIndex].data.rows[rowIndex].winner === 'ford' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-white text-gray-500 border-gray-200'"
                                            @click="blocks[activeIndex].data.rows[rowIndex].winner = 'ford'"
                                        >✓ Ford</button>
                                        <button type="button" class="flex-1 py-1 text-[10px] rounded font-bold border cursor-pointer"
                                            :class="blocks[activeIndex].data.rows[rowIndex].winner === 'tie' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-white text-gray-500 border-gray-200'"
                                            @click="blocks[activeIndex].data.rows[rowIndex].winner = 'tie'"
                                        >= Hòa</button>
                                        <button type="button" class="flex-1 py-1 text-[10px] rounded font-bold border cursor-pointer"
                                            :class="blocks[activeIndex].data.rows[rowIndex].winner === 'competitor' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-white text-gray-500 border-gray-200'"
                                            @click="blocks[activeIndex].data.rows[rowIndex].winner = 'competitor'"
                                        >✓ Đối thủ</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 14. GalleryMasonry Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'GalleryMasonry'" class="space-y-4">
                            <div class="relative">
                                <button type="button" @click="openAIModal('GalleryMasonry', 'title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.title" :field="{
                                    type: 'text',
                                    name: 'gm_title_' + activeIndex,
                                    label: 'Tiêu đề bộ sưu tập',
                                    placeholder: 'vd: Hình ảnh thực tế tại Long Khánh Ford',
                                }" />
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Số cột hiển thị</label>
                                <div class="grid grid-cols-3 gap-2">
                                    <button
                                        v-for="col in [2, 3, 4]"
                                        :key="col"
                                        type="button"
                                        class="py-1.5 px-2 text-xs rounded-lg font-medium border transition-all text-center cursor-pointer"
                                        :class="(blocks[activeIndex].data.columns || 3) === col ? 'bg-[#008060] text-white border-[#008060] shadow-xs' : 'bg-white text-gray-750 border-gray-300 hover:bg-gray-50'"
                                        @click="blocks[activeIndex].data.columns = col"
                                    >
                                        {{ col }} cột
                                    </button>
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <label class="text-xs font-bold text-slate-300">Danh sách ảnh:</label>
                                <button type="button" class="text-xs text-blue-400 hover:text-blue-300 font-bold" @click="addGalleryImage(activeIndex)">
                                    + Thêm ảnh
                                </button>
                            </div>
                            <div v-for="(img, imgIndex) in blocks[activeIndex].data.images" :key="imgIndex" class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2 relative">
                                <button type="button" class="absolute top-2 right-2 text-red-400 hover:text-red-500 font-bold text-xs" @click="removeGalleryImage(activeIndex, imgIndex)">✕</button>
                                <span class="text-[9px] uppercase font-bold text-slate-400">Ảnh #{{ imgIndex + 1 }}</span>
                                <Field v-model="blocks[activeIndex].data.images[imgIndex].src" :field="{
                                    type: 'file_upload',
                                    name: 'gm_img_' + activeIndex + '_' + imgIndex,
                                    label: 'Hình ảnh',
                                    urlOnly: true,
                                }" />
                                <Field v-model="blocks[activeIndex].data.images[imgIndex].caption" :field="{
                                    type: 'text',
                                    name: 'gm_cap_' + activeIndex + '_' + imgIndex,
                                    label: 'Chú thích ảnh (tuỳ chọn)',
                                    placeholder: 'vd: Khu vực showroom chính',
                                }" />
                            </div>
                        </div>

                        <!-- 15. SocialProof Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'SocialProof'" class="space-y-4">
                            <div class="relative">
                                <button type="button" @click="openAIModal('SocialProof', 'title', activeIndex)" class="absolute top-0 right-0 z-10 text-[10px] text-blue-400 hover:text-blue-300 bg-transparent border-0 p-1 flex items-center gap-1 font-semibold" title="Viết bằng AI">
                                    ✨ AI viết
                                </button>
                                <Field v-model="blocks[activeIndex].data.title" :field="{
                                    type: 'text',
                                    name: 'sp_title_' + activeIndex,
                                    label: 'Tiêu đề khối',
                                    placeholder: 'vd: Tại sao chọn Long Khánh Ford?',
                                }" />
                            </div>
                            <div class="flex justify-between items-center">
                                <label class="text-xs font-bold text-slate-300">Các con số ấn tượng:</label>
                                <button type="button" class="text-xs text-blue-400 hover:text-blue-300 font-bold" @click="addStatItem(activeIndex)">
                                    + Thêm chỉ số
                                </button>
                            </div>
                            <div v-for="(stat, sIndex) in blocks[activeIndex].data.stats" :key="sIndex" class="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2 relative">
                                <button type="button" class="absolute top-2 right-2 text-red-400 hover:text-red-500 font-bold text-xs" @click="removeStatItem(activeIndex, sIndex)">✕</button>
                                <div class="grid grid-cols-2 gap-2">
                                    <Field v-model="blocks[activeIndex].data.stats[sIndex].value" :field="{
                                        type: 'text',
                                        name: 'sp_val_' + activeIndex + '_' + sIndex,
                                        label: 'Con số',
                                        placeholder: 'vd: 5000+',
                                    }" />
                                    <Field v-model="blocks[activeIndex].data.stats[sIndex].label" :field="{
                                        type: 'text',
                                        name: 'sp_lbl_' + activeIndex + '_' + sIndex,
                                        label: 'Mô tả',
                                        placeholder: 'vd: Xe đã bán',
                                    }" />
                                </div>
                                <Field v-model="blocks[activeIndex].data.stats[sIndex].icon" :field="{
                                    type: 'text',
                                    name: 'sp_ico_' + activeIndex + '_' + sIndex,
                                    label: 'Biểu tượng (emoji hoặc icon class)',
                                    placeholder: 'vd: 🚗 hoặc 🏆',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.background_image" :field="{
                                type: 'file_upload',
                                name: 'sp_bg_' + activeIndex,
                                label: 'Ảnh nền (tuỳ chọn)',
                                urlOnly: true,
                            }" />
                        </div>

                        <!-- 16. InstallmentCalculator Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'InstallmentCalculator'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'ic_title_' + activeIndex,
                                label: 'Tiêu đề khối trả góp',
                                placeholder: 'vd: Bảng Tính Chi Phí Trả Góp Ước Tính',
                            }" />
                            <Field v-model="blocks[activeIndex].data.subtitle" :field="{
                                type: 'text',
                                name: 'ic_sub_' + activeIndex,
                                label: 'Mô tả phụ',
                                placeholder: 'vd: Chỉ từ 20% giá trị xe, hỗ trợ vay đến 8 năm',
                            }" />
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model.number="blocks[activeIndex].data.interest_rate" :field="{
                                    type: 'text',
                                    name: 'ic_ir_' + activeIndex,
                                    label: 'Lãi suất (%/năm)',
                                    placeholder: '7.9',
                                }" />
                                <Field v-model.number="blocks[activeIndex].data.max_years" :field="{
                                    type: 'text',
                                    name: 'ic_my_' + activeIndex,
                                    label: 'Năm vay tối đa',
                                    placeholder: '8',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.custom_price" :field="{
                                type: 'text',
                                name: 'ic_cp_' + activeIndex,
                                label: 'Giá tham khảo tùy chỉnh (nếu bỏ trống tự lấy giá xe)',
                                placeholder: 'vd: 850000000',
                            }" />
                            <Field v-model="blocks[activeIndex].data.zalo_button_text" :field="{
                                type: 'text',
                                name: 'ic_zb_' + activeIndex,
                                label: 'Nhãn nút liên hệ Zalo',
                                placeholder: 'vd: Nhận bảng tính chi tiết qua Zalo',
                            }" />
                        </div>

                        <!-- 17. CountdownOfferBanner Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'CountdownOfferBanner'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'cob_title_' + activeIndex,
                                label: 'Tiêu đề khuyến mãi',
                                placeholder: 'vd: CHƯƠNG TRÌNH ƯU ĐÃI ĐẶC BIỆT THÁNG NÀY',
                            }" />
                            <Field v-model="blocks[activeIndex].data.subtitle" :field="{
                                type: 'text',
                                name: 'cob_sub_' + activeIndex,
                                label: 'Mô tả chương trình',
                                placeholder: 'vd: Đăng ký ngay để giữ suất quà tặng...',
                            }" />
                            <div class="grid grid-cols-2 gap-3">
                                <Field v-model="blocks[activeIndex].data.end_date" :field="{
                                    type: 'text',
                                    name: 'cob_ed_' + activeIndex,
                                    label: 'Hạn đếm ngược (YYYY-MM-DD HH:mm)',
                                    placeholder: 'vd: 2026-08-15 23:59',
                                }" />
                                <Field v-model.number="blocks[activeIndex].data.remaining_slots" :field="{
                                    type: 'text',
                                    name: 'cob_rs_' + activeIndex,
                                    label: 'Số suất còn lại',
                                    placeholder: '3',
                                }" />
                            </div>
                            <Field v-model="blocks[activeIndex].data.button_text" :field="{
                                type: 'text',
                                name: 'cob_btn_' + activeIndex,
                                label: 'Nhãn nút đăng ký giữ suất',
                                placeholder: 'vd: Đăng Ký Giữ Suất Ưu Đãi',
                            }" />
                            <Field v-model="blocks[activeIndex].data.background_image" :field="{
                                type: 'file_upload',
                                name: 'cob_bg_' + activeIndex,
                                label: 'Ảnh nền khối ưu đãi',
                                urlOnly: true,
                            }" />
                        </div>

                        <!-- 18. DualVehicleComparison Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'DualVehicleComparison'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'dvc_title_' + activeIndex,
                                label: 'Tiêu đề khối so sánh',
                                placeholder: 'vd: SO SÁNH TRỰC QUAN 2 DÒNG XE',
                            }" />
                            <Field v-model="blocks[activeIndex].data.subtitle" :field="{
                                type: 'text',
                                name: 'dvc_sub_' + activeIndex,
                                label: 'Mô tả phụ',
                                placeholder: 'vd: Lựa chọn dòng xe phù hợp nhất...',
                            }" />
                            <Field v-model="blocks[activeIndex].data.consultant_note_1" :field="{
                                type: 'textarea',
                                name: 'dvc_cn1_' + activeIndex,
                                label: 'Ghi chú tư vấn cho Xe thứ nhất',
                                placeholder: 'vd: Phù hợp di chuyển gia đình đô thị...',
                            }" />
                            <Field v-model="blocks[activeIndex].data.consultant_note_2" :field="{
                                type: 'textarea',
                                name: 'dvc_cn2_' + activeIndex,
                                label: 'Ghi chú tư vấn cho Xe thứ hai',
                                placeholder: 'vd: Mạnh mẽ vượt địa hình...',
                            }" />
                        </div>

                        <!-- 19. LdpVehiclesGrid Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'LdpVehiclesGrid'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'lvg_title_' + activeIndex,
                                label: 'Tiêu đề khối danh sách xe',
                                placeholder: 'vd: Dòng xe Cố vấn phụ trách',
                            }" />
                            <Field v-model="blocks[activeIndex].data.subtitle" :field="{
                                type: 'textarea',
                                name: 'lvg_sub_' + activeIndex,
                                label: 'Mô tả phụ',
                                placeholder: 'vd: Chọn dòng xe quý khách quan tâm để xem bảng giá...',
                            }" />
                            <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                                ℹ️ Khối này tự động lấy tất cả các dòng xe được chỉ định cho Cố vấn bán hàng này trong tab <strong>Thông tin chung</strong> để hiển thị dưới dạng lưới showroom kèm tab lọc phân loại.
                            </div>
                        </div>

                        <!-- 20. LdpUsedVehicles Edit Form -->
                        <div v-else-if="blocks[activeIndex].type === 'LdpUsedVehicles'" class="space-y-4">
                            <Field v-model="blocks[activeIndex].data.title" :field="{
                                type: 'text',
                                name: 'luv_title_' + activeIndex,
                                label: 'Tiêu đề khối xe đã qua sử dụng',
                                placeholder: 'vd: Xe Đã Qua Sử Dụng Chất Lượng Cao',
                            }" />
                            <Field v-model="blocks[activeIndex].data.subtitle" :field="{
                                type: 'textarea',
                                name: 'luv_sub_' + activeIndex,
                                label: 'Mô tả phụ',
                                placeholder: 'vd: Tuyển chọn các dòng xe Ford lướt được kiểm tra 167 điểm kỹ thuật...',
                            }" />
                            <Field v-model="blocks[activeIndex].data.limit" :field="{
                                type: 'number',
                                name: 'luv_limit_' + activeIndex,
                                label: 'Số lượng xe hiển thị tối đa',
                                placeholder: '10',
                            }" />
                            <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
                                ℹ️ Khối này tự động kết nối với module <strong>Xe đã qua sử dụng</strong> trong CMS để trình chiếu Slider các mẫu xe Ford Assured chính hãng.
                            </div>
                        </div>
                    </div>

                    <!-- Styling & Layout Panel -->
                    <div class="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                        <div class="text-xs font-bold text-[#008060] flex items-center gap-1.5 border-b border-gray-200 pb-2">
                            <span>🎨</span>
                            <span>Cấu hình kiểu dáng</span>
                        </div>
                        
                        <!-- Alignment Option -->
                        <div>
                            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Căn lề chữ / Phần tử (Alignment)</label>
                            <div class="grid grid-cols-3 gap-2">
                                <button 
                                    v-for="opt in [{value: 'left', label: 'Trái'}, {value: 'center', label: 'Giữa'}, {value: 'right', label: 'Phải'}]"
                                    :key="opt.value"
                                    type="button" 
                                    class="py-1.5 px-2 text-xs rounded-lg font-medium border transition-all text-center cursor-pointer"
                                    :class="getAlignValue(blocks[activeIndex]) === opt.value ? 'bg-[#008060] text-white border-[#008060] shadow-xs' : 'bg-white text-gray-750 border-gray-300 hover:bg-gray-50'"
                                    @click="blocks[activeIndex].data.align = opt.value"
                                >
                                    {{ opt.label }}
                                </button>
                            </div>
                        </div>

                        <!-- Title Size & Title Color -->
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cỡ chữ tiêu đề</label>
                                <select 
                                    v-model="blocks[activeIndex].data.title_size" 
                                    class="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="small">Nhỏ</option>
                                    <option value="medium">Vừa (Mặc định)</option>
                                    <option value="large">Lớn</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Màu chữ tiêu đề</label>
                                <div class="flex gap-2 items-center">
                                    <input 
                                        type="color" 
                                        :value="lowercaseColor(blocks[activeIndex].data.title_color)" 
                                        @input="blocks[activeIndex].data.title_color = $event.target.value"
                                        class="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 bg-transparent p-0 shrink-0"
                                    />
                                    <input 
                                        type="text" 
                                        v-model="blocks[activeIndex].data.title_color" 
                                        placeholder="#ffffff"
                                        class="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-800 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Description Size & Description Color (for Promotions, ThreeSixtyViewer) -->
                        <div v-if="['Promotions', 'ThreeSixtyViewer', 'VideoShowcase'].includes(blocks[activeIndex].type)" class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cỡ chữ mô tả</label>
                                <select 
                                    v-model="blocks[activeIndex].data.desc_size" 
                                    class="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="small">Nhỏ</option>
                                    <option value="medium">Vừa (Mặc định)</option>
                                    <option value="large">Lớn</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Màu chữ mô tả</label>
                                <div class="flex gap-2 items-center">
                                    <input 
                                        type="color" 
                                        :value="lowercaseColor(blocks[activeIndex].data.desc_color)" 
                                        @input="blocks[activeIndex].data.desc_color = $event.target.value"
                                        class="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 bg-transparent p-0 shrink-0"
                                    />
                                    <input 
                                        type="text" 
                                        v-model="blocks[activeIndex].data.desc_color" 
                                        placeholder="#1a1a1a"
                                        class="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-800 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Tagline Color (for HeroBanner only) -->
                        <div v-if="blocks[activeIndex].type === 'HeroBanner'">
                            <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Màu chữ Tagline / Slogan</label>
                            <div class="flex gap-2 items-center">
                                <input 
                                    type="color" 
                                    :value="lowercaseColor(blocks[activeIndex].data.tagline_color)" 
                                    @input="blocks[activeIndex].data.tagline_color = $event.target.value"
                                    class="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 bg-transparent p-0 shrink-0"
                                />
                                <input 
                                    type="text" 
                                    v-model="blocks[activeIndex].data.tagline_color" 
                                    placeholder="#ffffff"
                                    class="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-800 uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        <!-- 🛠️ BỐ CỤC & MÀU SẮC (CUSTOM LAYOUT) -->
                        <div class="mt-6 pt-6 border-t border-gray-200 space-y-4">
                            <div class="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                                <h5 class="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                                    ⚙️ Cấu hình Bố cục & Màu sắc
                                </h5>
                                <p class="text-[10px] text-blue-700 mt-1">
                                    Tùy chỉnh khoảng cách, màu sắc nền, màu chữ và thẻ định danh cho khối này.
                                </p>
                            </div>

                            <!-- Anchor ID -->
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">ID định danh liên kết (Anchor ID)</label>
                                <input 
                                    type="text" 
                                    v-model="blocks[activeIndex].anchorId" 
                                    placeholder="vd: uu-dai, thong-so, faq (viết liền không dấu)"
                                    class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <!-- Background Color -->
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Màu nền tùy chọn (Background Color)</label>
                                <div class="flex gap-2 items-center">
                                    <input 
                                        type="color" 
                                        :value="lowercaseColor(getLayoutSetting(blocks[activeIndex], 'bg_color', '#ffffff'))" 
                                        @input="setLayoutSetting(blocks[activeIndex], 'bg_color', $event.target.value)"
                                        class="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 bg-transparent p-0 shrink-0"
                                    />
                                    <input 
                                        type="text" 
                                        :value="getLayoutSetting(blocks[activeIndex], 'bg_color', '')"
                                        @input="setLayoutSetting(blocks[activeIndex], 'bg_color', $event.target.value)"
                                        placeholder="Mặc định (Trong suốt)"
                                        class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <!-- Text Color -->
                            <div>
                                <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Màu chữ tùy chọn (Text Color)</label>
                                <div class="flex gap-2 items-center">
                                    <input 
                                        type="color" 
                                        :value="lowercaseColor(getLayoutSetting(blocks[activeIndex], 'text_color', '#000000'))" 
                                        @input="setLayoutSetting(blocks[activeIndex], 'text_color', $event.target.value)"
                                        class="w-8 h-8 rounded-lg cursor-pointer border border-gray-200 bg-transparent p-0 shrink-0"
                                    />
                                    <input 
                                        type="text" 
                                        :value="getLayoutSetting(blocks[activeIndex], 'text_color', '')"
                                        @input="setLayoutSetting(blocks[activeIndex], 'text_color', $event.target.value)"
                                        placeholder="Mặc định"
                                        class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <!-- Padding Spacing -->
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Khoảng lề trên (Padding Top)</label>
                                    <select 
                                        :value="getLayoutSetting(blocks[activeIndex], 'padding_top', 'default')"
                                        @change="setLayoutSetting(blocks[activeIndex], 'padding_top', $event.target.value)"
                                        class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="default">Mặc định</option>
                                        <option value="none">Sát lề (0px)</option>
                                        <option value="small">Nhỏ (16px)</option>
                                        <option value="medium">Vừa (48px)</option>
                                        <option value="large">Lớn (80px)</option>
                                        <option value="xlarge">Cực lớn (120px)</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Khoảng lề dưới (Padding Bottom)</label>
                                    <select 
                                        :value="getLayoutSetting(blocks[activeIndex], 'padding_bottom', 'default')"
                                        @change="setLayoutSetting(blocks[activeIndex], 'padding_bottom', $event.target.value)"
                                        class="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="default">Mặc định</option>
                                        <option value="none">Sát lề (0px)</option>
                                        <option value="small">Nhỏ (16px)</option>
                                        <option value="medium">Vừa (48px)</option>
                                        <option value="large">Lớn (80px)</option>
                                        <option value="xlarge">Cực lớn (120px)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SCENE B1: SECTIONS LIST (TAB 1) -->
                <div v-else-if="activeTab === 'sections'">
                    <Draggable
                        v-if="blocks && blocks.length > 0"
                        tag="div"
                        v-model="blocks"
                        item-key="id"
                        handle=".list-handle"
                        :animation="200"
                        :group="{ name: 'blocks', pull: true, put: true }"
                        class="space-y-3 min-h-[60px]"
                        @add="onLibraryBlockAdd"
                    >
                        <template #item="{ index, element }">
                            <div 
                                class="flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xs p-3.5 rounded-xl cursor-pointer transition select-none group"
                                :class="{'ring-2 ring-[#008060] border-transparent bg-emerald-50/5': activeIndex === index}"
                                @click="activeIndex = index"
                            >
                                <div class="flex items-center space-x-2">
                                    <!-- Drag Handle -->
                                    <div class="list-handle cursor-move p-1 text-gray-400 hover:text-gray-655 transition">
                                        <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm7 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                                        </svg>
                                    </div>
                                    <!-- Manual arrows Up/Down -->
                                    <div class="flex flex-col items-center justify-center -space-y-1 mr-1 select-none">
                                        <button 
                                            type="button" 
                                            :disabled="index === 0"
                                            @click.stop="moveUp(index)"
                                            class="p-0.5 text-[10px] text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                            title="Di chuyển lên"
                                        >
                                            ▲
                                        </button>
                                        <button 
                                            type="button" 
                                            :disabled="index === blocks.length - 1"
                                            @click.stop="moveDown(index)"
                                            class="p-0.5 text-[10px] text-gray-400 hover:text-gray-700 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                            title="Di chuyển xuống"
                                        >
                                            ▼
                                        </button>
                                    </div>
                                    <div class="flex flex-col">
                                        <!-- Interactive position select dropdown -->
                                        <div class="flex items-center" @click.stop>
                                            <select 
                                                :value="index" 
                                                @change="moveBlockToPosition(index, Number($event.target.value))"
                                                class="pos-select bg-gray-100 hover:bg-gray-250 text-gray-750 text-[9px] font-bold uppercase tracking-wider rounded border border-gray-300 focus:outline-none cursor-pointer"
                                            >
                                                <option v-for="(n, i) in blocks.length" :key="i" :value="i">
                                                    Khối {{ i + 1 }}
                                                </option>
                                            </select>
                                        </div>
                                        <span class="text-xs font-bold text-gray-800 flex items-center gap-1.5 mt-1">
                                            <span>{{ getBlockIcon(element.type) }}</span>
                                            <span>{{ getBlockLabel(element.type) }}</span>
                                        </span>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-1">
                                    <button type="button" class="text-xs text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg border border-gray-250 cursor-pointer" title="Nhấn để sửa">
                                        ⚙️
                                    </button>
                                    <button type="button" class="text-xs text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg border border-gray-250 cursor-pointer" title="Nhân bản" @click.stop="duplicateBlock(index)">
                                        ➕
                                    </button>
                                    <button type="button" class="text-xs text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg border border-red-200 cursor-pointer" title="Xóa khối này" @click.stop="removeBlock(index)">
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </template>
                    </Draggable>

                    <!-- Empty state: also needs to be a droppable target -->
                    <Draggable
                        v-else
                        tag="div"
                        v-model="blocks"
                        item-key="id"
                        :group="{ name: 'blocks', pull: true, put: true }"
                        :animation="200"
                        class="min-h-[200px]"
                        @add="onLibraryBlockAdd"
                    >
                        <template #item="{ element }">
                            <div></div>
                        </template>
                        <template #header>
                            <div class="border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 italic text-xs">
                                Chưa có khối nào. Kéo khối từ tab "Thêm khối mới" hoặc nhấn vào để thêm.
                            </div>
                        </template>
                    </Draggable>
                </div>

                <!-- SCENE B2: BLOCK TEMPLATE LIBRARY (TAB 2) — Draggable Source -->
                <div v-else-if="activeTab === 'library'">
                    <p class="text-[10px] text-gray-400 mb-3 italic">💡 Nhấn vào khối để thêm nhanh, hoặc kéo thả vào danh sách bên trái.</p>
                    <Draggable
                        tag="div"
                        :list="libraryBlocks"
                        :clone="cloneLibraryBlock"
                        item-key="type"
                        :group="{ name: 'blocks', pull: 'clone', put: false }"
                        :sort="false"
                        :animation="200"
                        class="grid grid-cols-1 gap-3"
                    >
                        <template #item="{ element: tpl }">
                            <div 
                                class="flex items-center p-3.5 bg-white border border-gray-200 hover:border-[#008060] hover:bg-emerald-50/5 rounded-xl cursor-grab active:cursor-grabbing transition select-none group"
                                @click="addBlockType(tpl.type)"
                            >
                                <div class="h-10 w-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg text-lg group-hover:bg-emerald-50/10 group-hover:border-[#008060] transition">
                                    {{ tpl.icon }}
                                </div>
                                <div class="ml-3.5 flex-1">
                                    <h4 class="text-xs font-bold text-gray-800 group-hover:text-[#008060] transition">{{ tpl.name }}</h4>
                                    <p class="text-[10px] text-gray-500 mt-0.5">{{ tpl.desc }}</p>
                                </div>
                                <span class="text-gray-400 group-hover:text-[#008060] text-xs font-black transition">＋</span>
                            </div>
                        </template>
                    </Draggable>
                </div>
            </div>
        </div>

        <!-- RIGHT PANEL: Live Visual Preview Browser Mockup (8/12 equivalent) -->
        <div class="flex-1 flex flex-col bg-[#f6f6f7] h-full overflow-hidden relative">
            <!-- Floating toggle sidebar button (only shown when sidebar is collapsed) -->
            <button 
                v-if="isSidebarCollapsed"
                type="button"
                class="absolute top-1/2 left-0 -translate-y-1/2 z-[999] bg-white text-gray-750 hover:text-black border border-gray-250 border-l-0 rounded-r-lg w-7 h-14 flex items-center justify-center cursor-pointer shadow-md transition-all hover:w-8 hover:bg-gray-50"
                @click="isSidebarCollapsed = false"
                title="Mở rộng sidebar"
            >
                <span class="font-bold text-base">→</span>
            </button>

            <!-- Simulated Browser Address Bar -->
            <div class="flex items-center px-4 py-3 bg-gray-100 border-b border-gray-200 shrink-0">
                <div class="flex space-x-1.5 mr-4 select-none">
                    <span class="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                    <span class="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
                </div>
                <div class="flex-1 bg-white border border-gray-300 rounded-lg py-1 px-4 text-gray-500 text-xs font-mono truncate select-all flex items-center space-x-2">
                    <span class="text-gray-400">🌐 {{ iframeUrl }}</span>
                </div>
                <span class="text-[10px] text-[#008060] font-bold uppercase ml-4 select-none tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Preview
                </span>
            </div>

            <!-- Embedded NextJS Realtime Iframe Preview -->
            <div class="flex-1 bg-[#f6f6f7] overflow-hidden relative w-full h-full">
                <iframe 
                    ref="previewIframe"
                    :src="iframeUrl"
                    class="w-full h-full border-0 bg-[#fafafa]"
                    @load="onIframeLoad"
                ></iframe>
            </div>
        </div>

        <FileManager
            v-if="showMediaManager"
            v-model:show="showMediaManager"
            @onSelect="onSelectMedia"
            :multiple="false"
        />

        <Dialog header="Viết nội dung bằng AI (Gemini)" v-model:visible="showAIPromptModal" :style="{ width: '400px' }" :draggable="false" :modal="true">
            <div class="space-y-4 pt-2">
                <p class="text-xs text-gray-400">
                    AI sẽ tự động viết nội dung phù hợp cho dòng xe <strong>{{ vehicleData.title || (vehicleData.vi && vehicleData.vi.title) || 'Xe Ford' }}</strong> tại phần <strong>{{ aiTarget.sectionName }}</strong>.
                </p>
                <div>
                    <label class="block text-xs font-semibold text-gray-400 mb-1">Yêu cầu đặc biệt (tùy chọn):</label>
                    <textarea 
                        v-model="aiUserPrompt" 
                        placeholder="Ví dụ: viết ngắn gọn, nhấn mạnh về tính an toàn, có icon biểu tượng cảm xúc..." 
                        class="w-full text-xs p-2 border border-slate-700 bg-slate-950 text-white rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        rows="3"
                    ></textarea>
                </div>
            </div>
            <template #footer>
                <Button variant="white" @click="showAIPromptModal = false" label="Hủy" class="btn-xs" />
                <Button type="button" class="ml-2 btn-primary btn-xs" @click="generateAIContent" :loading="aiLoading">
                    <span v-if="aiLoading">Đang tạo...</span>
                    <span v-else>Tạo nội dung</span>
                </Button>
            </template>
        </Dialog>
    </div>
</template>

<script>
import Draggable from 'vuedraggable'
import FileManager from '@/Components/FileManager.vue'

export default {
    name: 'BlockEditor',
    components: { Draggable, FileManager },
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        vehicleSlug: {
            type: String,
            default: '',
        },
        vehicleData: {
            type: Object,
            default: () => ({}),
        },
        fullscreen: {
            type: Boolean,
            default: false,
        },
        salesConsultants: {
            type: Array,
            default: () => [],
        },
        globalPromotions: {
            type: Array,
            default: () => [],
        },
        allVehicles: {
            type: Array,
            default: () => [],
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            showAIPromptModal: false,
            aiLoading: false,
            aiUserPrompt: '',
            aiTarget: {
                sectionType: '',
                sectionName: '',
                fieldType: '',
                blockIndex: -1,
                subIndex: null
            },
            activeTab: 'sections', // 'sections' or 'library'
            activeIndex: null, // Index of the block being edited in Left Panel
            iframeLoaded: false,
            isSidebarCollapsed: false, // Control sidebar toggle collapse/expand
            showMediaManager: false,
            mediaTarget: null, // { index, field, subIndex }
            libraryBlocks: [
                { type: 'HeroBanner', icon: '📢', name: 'Banner lớn (Hero)', desc: 'Banner trần viền ấn tượng, có chữ và nút bấm hành động' },
                { type: 'LdpVehiclesGrid', icon: '🚘', name: 'Danh sách dòng xe (Showroom)', desc: 'Lưới hiển thị các dòng xe Cố vấn bán hàng phụ trách kèm bộ lọc' },
                { type: 'LdpUsedVehicles', icon: '🚙', name: 'Xe đã qua sử dụng (Slider)', desc: 'Slide hiển thị các dòng xe Ford cũ chính hãng (Ford Assured)' },
                { type: 'LdpSalesConsultant', icon: '👤', name: 'Cố vấn bán hàng LDP', desc: 'Hiển thị Banner thông tin của Cố vấn phụ trách trang LDP' },
                { type: 'LdpPromotions', icon: '🎁', name: 'Khuyến mãi LDP', desc: 'Hiển thị các chương trình khuyến mãi đã chọn hoặc tự nhập' },
                { type: 'Promotions', icon: '🎁', name: 'Ưu đãi khuyến mãi (Tùy biến)', desc: 'Thông tin quà tặng tiền mặt, bảo hiểm và quà độc quyền' },
                { type: 'ThreeSixtyViewer', icon: '🔄', name: 'Trình xem xoay 360°', desc: 'Mô phỏng đổi màu ngoại thất xe và tự do xoay góc nhìn' },
                { type: 'FeaturesGrid', icon: '🔲', name: 'Khung lưới tính năng', desc: 'Bố cục ghép ảnh dạng lưới cho Thiết kế, Nội thất, Công nghệ' },
                { type: 'VersionsGrid', icon: '🚗', name: 'Danh sách các phiên bản', desc: 'So sánh ngắn và hiển thị các phiên bản cùng mức giá' },
                { type: 'SpecsGrid', icon: '📊', name: 'Bảng so sánh thông số', desc: 'So sánh song song thông số chi tiết động cơ, hộp số...' },
                { type: 'FeaturesList', icon: '✨', name: 'Danh sách công nghệ', desc: 'Liệt kê so le các tính năng lái an toàn chủ động' },
                { type: 'AccordionFAQs', icon: '❓', name: 'Câu hỏi thường gặp', desc: 'Các thắc mắc xếp gập về bảo dưỡng, giá lăn bánh' },
                { type: 'BookingBanner', icon: '📞', name: 'Tư vấn & Đặt lịch', desc: 'Khối liên hệ hotline và liên kết đặt lịch hẹn bảo dưỡng' },
                { type: 'TestimonialSlider', icon: '💬', name: 'Đánh giá khách hàng', desc: 'Slider hiển thị nhận xét và đánh giá sao từ khách hàng thực tế' },
                { type: 'VideoShowcase', icon: '🎬', name: 'Video giới thiệu xe', desc: 'Nhúng video YouTube hoặc TikTok review xe, lái thử' },
                { type: 'CountdownTimer', icon: '⏰', name: 'Đếm ngược ưu đãi', desc: 'Tạo urgency với bộ đếm ngược thời hạn chương trình khuyến mãi' },
                { type: 'ComparisonTable', icon: '⚖️', name: 'So sánh với đối thủ', desc: 'Bảng so sánh nhanh xe Ford vs đối thủ cạnh tranh' },
                { type: 'GalleryMasonry', icon: '🖼️', name: 'Bộ sưu tập ảnh', desc: 'Hiển thị nhiều ảnh dạng lưới Masonry (ảnh thực tế xe, showroom)' },
                { type: 'SocialProof', icon: '📱', name: 'Bằng chứng xã hội', desc: 'Hiển thị số liệu thống kê ấn tượng (số xe bán, năm kinh nghiệm)' },
                { type: 'InstallmentCalculator', icon: '🧮', name: 'Bảng tính chi phí trả góp', desc: 'Slider kéo chọn tỷ lệ trả trước & số tháng để tính số tiền trả gốc lãi hàng tháng' },
                { type: 'CountdownOfferBanner', icon: '🔥', name: 'Đếm ngược ưu đãi & Giữ suất', desc: 'Đồng hồ đếm ngược thời gian thực + hiển thị số suất còn lại + đăng ký giữ suất quà' },
                { type: 'DualVehicleComparison', icon: '⚖️', name: 'So sánh song song 2 xe', desc: 'Bảng so sánh trực quan các thông số nổi bật dành riêng cho LDP chọn 2 xe' },
            ]
        }
    },
    computed: {
        blocks: {
            get() {
                return this.modelValue || []
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        },
        iframeUrl() {
            let host = 'https://longkhanhford.com.vn';
            const hostname = window.location.hostname;
            const port = window.location.port;
            if (port === '8000' || hostname === 'localhost' || hostname === '127.0.0.1') {
                host = 'http://localhost:3000';
            } else {
                host = 'https://longkhanhford.com.vn';
            }
            const slug = this.vehicleSlug || 'preview';
            return `${host}/${slug}?edit=true&embed=true`;
        }
    },
    watch: {
        modelValue: {
            handler(newVal) {
                this.ensureBlockIds();
            },
            immediate: true,
            deep: true
        },
        blocks: {
            handler(newVal) {
                // Keep active index in bounds if list size shrinks
                if (this.activeIndex !== null && this.activeIndex >= newVal.length) {
                    this.activeIndex = null
                }
                this.syncToIframe();
            },
            deep: true
        },
        activeIndex(newVal) {
            this.syncActiveIndex();
        },
        vehicleData: {
            handler(newVal) {
                this.syncVehicleData();
            },
            deep: true
        }
    },
    mounted() {
        window.addEventListener('message', this.handleIframeMessage);
    },
    beforeUnmount() {
        window.removeEventListener('message', this.handleIframeMessage);
    },
    methods: {
        ensureBlockIds() {
            let changed = false;
            const currentBlocks = this.modelValue || [];
            const updated = currentBlocks.map(block => {
                if (!block.id) {
                    changed = true;
                    return {
                        ...block,
                        id: 'block_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now()
                    };
                }
                return block;
            });
            if (changed) {
                this.$emit('update:modelValue', updated);
            }
        },
        onSelectMedia(files) {
            if (files && files.length > 0 && this.mediaTarget) {
                const file = files[0];
                const fileUrl = file.static_url || file.path;

                const { index, field, subIndex } = this.mediaTarget;
                const list = JSON.parse(JSON.stringify(this.blocks));
                if (list[index]) {
                    if (field === 'features' && subIndex !== undefined) {
                        if (!list[index].data.features) {
                            list[index].data.features = [];
                        }
                        if (list[index].data.features[subIndex]) {
                            list[index].data.features[subIndex].image = fileUrl;
                        }
                    } else {
                        list[index].data[field] = fileUrl;
                    }
                    
                    this.$emit('update:modelValue', list);
                    this.syncToIframe();
                }
            }
            this.showMediaManager = false;
            this.mediaTarget = null;
        },
        addCustomPromoToVehicleData() {
            if (!this.vehicleData.promotions) {
                this.vehicleData.$set ? this.vehicleData.$set(this.vehicleData, 'promotions', { global_promotion_ids: [], custom_promotions: [] }) : (this.vehicleData.promotions = { global_promotion_ids: [], custom_promotions: [] });
            }
            if (!this.vehicleData.promotions.custom_promotions) {
                this.vehicleData.promotions.custom_promotions = [];
            }
            this.vehicleData.promotions.custom_promotions.push({
                title: '',
                description: '',
                image: null,
                link: ''
            });
        },
        getLayoutSetting(block, key, defaultValue = '') {
            if (!block.layout_settings) {
                return defaultValue;
            }
            return block.layout_settings[key] !== undefined ? block.layout_settings[key] : defaultValue;
        },
        setLayoutSetting(block, key, value) {
            if (!block.layout_settings) {
                this.$set ? this.$set(block, 'layout_settings', {}) : (block.layout_settings = {});
            }
            block.layout_settings[key] = value;
            this.$emit('update:modelValue', [...this.blocks]);
            this.syncToIframe();
        },
        lowercaseColor(val) {
            if (!val || typeof val !== 'string') return '#ffffff';
            let cleaned = val.trim();
            if (!cleaned.startsWith('#')) {
                cleaned = '#' + cleaned;
            }
            if (cleaned.length !== 7) {
                if (cleaned.length === 4) {
                    const r = cleaned[1];
                    const g = cleaned[2];
                    const b = cleaned[3];
                    return (`#${r}${r}${g}${g}${b}${b}`).toLowerCase();
                }
                return '#ffffff';
            }
            return cleaned.toLowerCase();
        },
        onIframeLoad() {
            this.iframeLoaded = true;
            this.syncAllData();
        },
        syncAllData() {
            const iframe = this.$refs.previewIframe;
            if (iframe && iframe.contentWindow && this.iframeLoaded) {
                const resolvedBlocks = this.resolveBlockImages(this.blocks);
                
                // Resolve promotions and sales consultant
                let resolvedPromotions = { global: [], custom: [] };
                let resolvedConsultant = null;
                if (this.vehicleData) {
                    if (this.vehicleData.promotions) {
                        const globalIds = this.vehicleData.promotions.global_promotion_ids || [];
                        const allPromos = this.globalPromotions || [];
                        resolvedPromotions.global = allPromos.filter(p => globalIds.includes(p.id)).map(p => ({
                            id: p.id,
                            title: p.title,
                            slug: p.slug,
                            image_url: p.image_url || (p.image ? this.resolveImageUrl(p.image) : null),
                            description: p.description || ''
                        }));
                        
                        resolvedPromotions.custom = (this.vehicleData.promotions.custom_promotions || []).map(p => ({
                            title: p.title || '',
                            description: p.description || '',
                            image_url: p.image ? this.resolveImageUrl(p.image) : null,
                            link: p.link || ''
                        }));
                    }
                    if (this.vehicleData.sales_consultant_id) {
                        const allConsultants = this.salesConsultants || [];
                        const c = allConsultants.find(x => x.id == this.vehicleData.sales_consultant_id);
                        if (c) {
                            resolvedConsultant = {
                                id: c.id,
                                name: c.name,
                                avatar: c.avatar,
                                phone: c.phone,
                                zalo_url: c.zalo_url,
                                job_title: c.job_title,
                                short_bio: c.short_bio
                            };
                        }
                    }
                }

                try {
                    iframe.contentWindow.postMessage({
                        type: 'INIT_PREVIEW',
                        vehicle: JSON.parse(JSON.stringify(this.vehicleData || {})),
                        blocks: JSON.parse(JSON.stringify(resolvedBlocks || [])),
                        activeIndex: this.activeIndex,
                        promotions: resolvedPromotions,
                        salesConsultant: resolvedConsultant,
                        allVehicles: JSON.parse(JSON.stringify(this.allVehicles || []))
                    }, '*');
                } catch (e) {
                    console.error('Failed to postMessage INIT_PREVIEW:', e);
                }
            }
        },
        syncToIframe() {
            if (!this.iframeLoaded) return;
            const iframe = this.$refs.previewIframe;
            if (iframe && iframe.contentWindow) {
                // Resolve promotions and sales consultant
                let resolvedPromotions = { global: [], custom: [] };
                let resolvedConsultant = null;
                if (this.vehicleData) {
                    if (this.vehicleData.promotions) {
                        const globalIds = this.vehicleData.promotions.global_promotion_ids || [];
                        const allPromos = this.globalPromotions || [];
                        resolvedPromotions.global = allPromos.filter(p => globalIds.includes(p.id)).map(p => ({
                            id: p.id,
                            title: p.title,
                            slug: p.slug,
                            image_url: p.image_url || (p.image ? this.resolveImageUrl(p.image) : null),
                            description: p.description || ''
                        }));
                        
                        resolvedPromotions.custom = (this.vehicleData.promotions.custom_promotions || []).map(p => ({
                            title: p.title || '',
                            description: p.description || '',
                            image_url: p.image ? this.resolveImageUrl(p.image) : null,
                            link: p.link || ''
                        }));
                    }
                    if (this.vehicleData.sales_consultant_id) {
                        const allConsultants = this.salesConsultants || [];
                        const c = allConsultants.find(x => x.id == this.vehicleData.sales_consultant_id);
                        if (c) {
                            resolvedConsultant = {
                                id: c.id,
                                name: c.name,
                                avatar: c.avatar,
                                phone: c.phone,
                                zalo_url: c.zalo_url,
                                job_title: c.job_title,
                                short_bio: c.short_bio
                            };
                        }
                    }
                }

                try {
                    iframe.contentWindow.postMessage({
                        type: 'UPDATE_BLOCKS',
                        blocks: JSON.parse(JSON.stringify(this.resolveBlockImages(this.blocks) || [])),
                        activeIndex: this.activeIndex,
                        promotions: resolvedPromotions,
                        salesConsultant: resolvedConsultant,
                        allVehicles: JSON.parse(JSON.stringify(this.allVehicles || []))
                    }, '*');
                } catch (e) {
                    console.error('Failed to postMessage UPDATE_BLOCKS:', e);
                }
            }
        },
        syncActiveIndex() {
            if (!this.iframeLoaded) return;
            const iframe = this.$refs.previewIframe;
            if (iframe && iframe.contentWindow) {
                try {
                    iframe.contentWindow.postMessage({
                        type: 'UPDATE_ACTIVE_INDEX',
                        activeIndex: this.activeIndex
                    }, '*');
                } catch (e) {
                    console.error('Failed to postMessage UPDATE_ACTIVE_INDEX:', e);
                }
            }
        },
        syncVehicleData() {
            if (!this.iframeLoaded) return;
            const iframe = this.$refs.previewIframe;
            if (iframe && iframe.contentWindow) {
                try {
                    iframe.contentWindow.postMessage({
                        type: 'UPDATE_VEHICLE',
                        vehicle: JSON.parse(JSON.stringify(this.vehicleData || {}))
                    }, '*');
                } catch (e) {
                    console.error('Failed to postMessage UPDATE_VEHICLE:', e);
                }
            }
        },
        handleIframeMessage(event) {
            const data = event.data;
            if (!data || typeof data !== 'object') return;

            if (data.type === 'SELECT_BLOCK') {
                if (data.index !== undefined) {
                    this.activeIndex = data.index;
                }
            } else if (data.type === 'OPEN_FILE_MANAGER') {
                if (data.index !== undefined && data.field !== undefined) {
                    this.mediaTarget = {
                        index: data.index,
                        field: data.field,
                        subIndex: data.subIndex
                    };
                    this.showMediaManager = true;
                }
            } else if (data.type === 'SYNC_BLOCKS_FROM_IFRAME') {
                if (data.blocks) {
                    this.$emit('update:modelValue', data.blocks);
                }
                if (data.activeIndex !== undefined) {
                    this.activeIndex = data.activeIndex;
                }
            }
        },
        resolveBlockImages(blocks) {
            const cloned = JSON.parse(JSON.stringify(blocks || []));
            cloned.forEach(block => {
                if (block.data) {
                    if (block.type === 'HeroBanner') {
                        block.data.background_image = this.resolveImageUrl(block.data.background_image);
                    } else if (block.type === 'Promotions') {
                        block.data.image = this.resolveImageUrl(block.data.image);
                    } else if (block.type === 'FeaturesGrid') {
                        block.data.image_1 = this.resolveImageUrl(block.data.image_1);
                        block.data.image_2 = this.resolveImageUrl(block.data.image_2);
                        block.data.image_3 = this.resolveImageUrl(block.data.image_3);
                        block.data.image_large = this.resolveImageUrl(block.data.image_large);
                        block.data.split_image = this.resolveImageUrl(block.data.split_image);
                    } else if (block.type === 'FeaturesList' && block.data.features) {
                        block.data.features.forEach(f => {
                            f.image = this.resolveImageUrl(f.image);
                        });
                    } else if (block.type === 'BookingBanner') {
                        block.data.car_image = this.resolveImageUrl(block.data.car_image);
                    } else if (block.type === 'TestimonialSlider' && block.data.reviews) {
                        block.data.reviews.forEach(r => {
                            r.avatar = this.resolveImageUrl(r.avatar);
                        });
                    } else if (block.type === 'VideoShowcase') {
                        block.data.thumbnail = this.resolveImageUrl(block.data.thumbnail);
                    } else if (block.type === 'CountdownTimer') {
                        block.data.background_image = this.resolveImageUrl(block.data.background_image);
                    } else if (block.type === 'ComparisonTable') {
                        block.data.ford_image = this.resolveImageUrl(block.data.ford_image);
                        block.data.competitor_image = this.resolveImageUrl(block.data.competitor_image);
                    } else if (block.type === 'GalleryMasonry' && block.data.images) {
                        block.data.images.forEach(img => {
                            img.src = this.resolveImageUrl(img.src);
                        });
                    } else if (block.type === 'SocialProof') {
                        block.data.background_image = this.resolveImageUrl(block.data.background_image);
                    }
                }
            });
            return cloned;
        },
        getBlockLabel(type) {
            return {
                HeroBanner: 'Banner lớn (Hero Banner)',
                Promotions: 'Khuyến mãi lớn (Promotions)',
                ThreeSixtyViewer: 'Xoay 360 độ (360 Viewer)',
                FeaturesGrid: 'Khung lưới tính năng (Features Grid)',
                VersionsGrid: 'Danh sách các phiên bản (Versions Grid)',
                SpecsGrid: 'Bảng so sánh thông số (Specs Grid)',
                FeaturesList: 'Danh sách công nghệ (Features List)',
                AccordionFAQs: 'Câu hỏi thường gặp (Accordion FAQs)',
                BookingBanner: 'Tư vấn & Đặt lịch (Booking Banner)',
                TestimonialSlider: 'Đánh giá khách hàng (Testimonials)',
                VideoShowcase: 'Video giới thiệu xe (Video)',
                CountdownTimer: 'Đếm ngược ưu đãi (Countdown)',
                ComparisonTable: 'So sánh với đối thủ (Comparison)',
                GalleryMasonry: 'Bộ sưu tập ảnh (Gallery)',
                SocialProof: 'Bằng chứng xã hội (Social Proof)',
                InstallmentCalculator: 'Bảng tính chi phí trả góp (Installment Calculator)',
                CountdownOfferBanner: 'Đếm ngược ưu đãi & Giữ suất (Countdown Offer)',
                DualVehicleComparison: 'So sánh song song 2 xe (Dual Vehicle Comparison)',
                LdpVehiclesGrid: 'Danh sách dòng xe phụ trách (LdpVehiclesGrid)',
                LdpUsedVehicles: 'Xe đã qua sử dụng (LdpUsedVehicles)',
            }[type] || type
        },
        getBlockIcon(type) {
            return {
                HeroBanner: '📢',
                Promotions: '🎁',
                ThreeSixtyViewer: '🔄',
                FeaturesGrid: '🔲',
                VersionsGrid: '🚗',
                SpecsGrid: '📊',
                FeaturesList: '✨',
                AccordionFAQs: '❓',
                BookingBanner: '📞',
                TestimonialSlider: '💬',
                VideoShowcase: '🎬',
                CountdownTimer: '⏰',
                ComparisonTable: '⚖️',
                GalleryMasonry: '🖼️',
                SocialProof: '📱',
                InstallmentCalculator: '🧮',
                CountdownOfferBanner: '🔥',
                DualVehicleComparison: '⚖️',
                LdpVehiclesGrid: '🚘',
                LdpUsedVehicles: '🚙',
            }[type] || '📦'
        },
        addBlockType(type) {
            const newBlock = {
                id: 'block_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
                type: type,
                is_collapsed: false,
                data: {}
            }

            // Initialize default structural settings
            if (type === 'HeroBanner') {
                newBlock.data = {
                    title: '',
                    tagline: '',
                    button_text: 'Tìm hiểu thêm',
                    button_link: '/lien-he',
                    background_image: null,
                    align: 'center',
                    title_size: 'medium',
                    title_color: '#ffffff',
                    tagline_color: '#ffffff'
                }
            } else if (type === 'Promotions') {
                newBlock.data = {
                    title: '',
                    description: '',
                    image: null,
                    button_text: 'Nhận báo giá ngay',
                    align: 'left',
                    title_size: 'medium',
                    title_color: '#0562d2',
                    desc_size: 'medium',
                    desc_color: '#1a1a1a'
                }
            } else if (type === 'ThreeSixtyViewer') {
                newBlock.data = {
                    title: '',
                    description: '',
                    align: 'left',
                    title_size: 'medium',
                    title_color: '#0562d2',
                    desc_size: 'medium',
                    desc_color: '#1a1a1a'
                }
            } else if (type === 'FeaturesGrid') {
                newBlock.data = {
                    align: 'center',
                    title_1: '',
                    image_1: null,
                    image_2: null,
                    image_3: null,
                    title_2: '',
                    image_large: null,
                    image_large_2: null,
                    image_large_3: null,
                    title_3: '',
                    split_image: null,
                    split_title: '',
                    split_features: [
                        { value: '10-Cấp', label: 'Hộp số tự động điện tử' },
                        { value: 'Bi-Turbo 2.0L', label: 'Động cơ Diesel mạnh mẽ' }
                    ]
                }
            } else if (type === 'VersionsGrid') {
                newBlock.data = {
                    align: 'center',
                    title: '',
                    descriptions: ['', '', '']
                }
            } else if (type === 'SpecsGrid') {
                newBlock.data = {
                    align: 'center'
                }
            } else if (type === 'FeaturesList') {
                newBlock.data = {
                    align: 'center',
                    features: [
                        { title: 'Hệ thống phanh khẩn cấp', description: 'Tự động phát hiện chướng ngại vật phía trước và phanh giảm thiểu tai nạn.', image: null }
                    ]
                }
            } else if (type === 'AccordionFAQs') {
                newBlock.data = {
                    align: 'left',
                    faqs: [
                        { q: 'Chi phí bảo dưỡng xe định kỳ là bao nhiêu?', a: 'Tùy thuộc vào các cấp bảo dưỡng nhỏ hay lớn, trung bình giao động từ 1.5 - 4.5 triệu đồng.', is_open: true }
                    ]
                }
            } else if (type === 'BookingBanner') {
                newBlock.data = {
                    align: 'left',
                    title: 'Kết nối ngay với chuyên viên Long Khánh Ford',
                    phone: '0812 86 86 22',
                    btn_text: 'Đặt lịch hẹn',
                    btn_link: '/lien-he?reason=Đặt hẹn dịch vụ',
                    car_image: null,
                    title_size: 'medium',
                    title_color: '#ffffff'
                }
            } else if (type === 'TestimonialSlider') {
                newBlock.data = {
                    align: 'center',
                    title: 'Khách hàng nói gì về chúng tôi?',
                    title_size: 'medium',
                    title_color: '#1a1a1a',
                    reviews: [
                        { name: 'Anh Nguyễn Văn A', content: 'Dịch vụ tại Long Khánh Ford rất chuyên nghiệp và tận tâm. Tôi rất hài lòng!', rating: 5, role: 'Chủ xe Everest 2024', avatar: null }
                    ]
                }
            } else if (type === 'VideoShowcase') {
                newBlock.data = {
                    align: 'center',
                    title: '',
                    description: '',
                    video_url: '',
                    thumbnail: null,
                    display_mode: 'embed',
                    title_size: 'medium',
                    title_color: '#1a1a1a'
                }
            } else if (type === 'CountdownTimer') {
                newBlock.data = {
                    align: 'center',
                    title: 'Ưu đãi đặc biệt — Sắp kết thúc!',
                    subtitle: 'Nhận ngay ưu đãi lên đến 100 triệu đồng',
                    end_date: '',
                    button_text: 'Đăng ký ngay',
                    button_link: '/lien-he',
                    background_image: null,
                    title_size: 'medium',
                    title_color: '#ffffff'
                }
            } else if (type === 'ComparisonTable') {
                newBlock.data = {
                    align: 'center',
                    title: '',
                    ford_name: '',
                    competitor_name: '',
                    ford_image: null,
                    competitor_image: null,
                    title_size: 'medium',
                    title_color: '#1a1a1a',
                    rows: [
                        { criteria: 'Động cơ', ford_value: '', competitor_value: '', winner: 'ford' },
                        { criteria: 'Hộp số', ford_value: '', competitor_value: '', winner: 'ford' },
                        { criteria: 'Giá bán', ford_value: '', competitor_value: '', winner: 'tie' },
                    ]
                }
            } else if (type === 'GalleryMasonry') {
                newBlock.data = {
                    align: 'center',
                    title: 'Hình ảnh thực tế',
                    columns: 3,
                    title_size: 'medium',
                    title_color: '#1a1a1a',
                    images: [
                        { src: null, caption: '' },
                        { src: null, caption: '' },
                        { src: null, caption: '' },
                    ]
                }
            } else if (type === 'SocialProof') {
                newBlock.data = {
                    align: 'center',
                    title: 'Tại sao chọn Long Khánh Ford?',
                    background_image: null,
                    title_size: 'medium',
                    title_color: '#ffffff',
                    stats: [
                        { value: '5000+', label: 'Xe đã bán', icon: '🚗' },
                        { value: '15+', label: 'Năm kinh nghiệm', icon: '🏆' },
                        { value: '4.9/5', label: 'Đánh giá trung bình', icon: '⭐' },
                        { value: '50+', label: 'Nhân viên chuyên nghiệp', icon: '👨‍💼' },
                    ]
                }
            } else if (type === 'InstallmentCalculator') {
                newBlock.data = {
                    title: 'Bảng Tính Chi Phí Trả Góp Ước Tính',
                    subtitle: 'Chỉ từ 20% giá trị xe, hỗ trợ vay đến 8 năm với lãi suất ưu đãi',
                    interest_rate: 7.9,
                    max_years: 8,
                    default_downpayment_pct: 20,
                    custom_price: '',
                    zalo_button_text: 'Nhận bảng tính chi tiết qua Zalo',
                    align: 'center',
                    title_size: 'medium',
                    title_color: '#1a1a1a'
                }
            } else if (type === 'CountdownOfferBanner') {
                newBlock.data = {
                    title: 'CHƯƠNG TRÌNH ƯU ĐÃI ĐẶC BIỆT THÁNG NÀY',
                    subtitle: 'Đăng ký ngay để giữ suất quà tặng phụ kiện & giảm trực tiếp tiền mặt',
                    end_date: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
                    remaining_slots: 3,
                    button_text: 'Đăng Ký Giữ Suất Ưu Đãi',
                    background_image: null,
                    align: 'center',
                    title_size: 'medium',
                    title_color: '#ffffff'
                }
            } else if (type === 'DualVehicleComparison') {
                newBlock.data = {
                    title: 'SO SÁNH TRỰC QUAN 2 DÒNG XE',
                    subtitle: 'Lựa chọn dòng xe phù hợp nhất với nhu cầu sử dụng của bạn',
                    consultant_note_1: 'Phù hợp di chuyển gia đình đô thị, tiết kiệm nhiên liệu.',
                    consultant_note_2: 'Mạnh mẽ vượt địa hình, khoang hành lý cực rộng rãi.',
                    align: 'center',
                    title_size: 'medium',
                    title_color: '#1a1a1a'
                }
            } else if (type === 'LdpVehiclesGrid') {
                newBlock.data = {
                    title: 'Dòng xe Cố vấn phụ trách',
                    subtitle: 'Chọn dòng xe quý khách quan tâm để xem bảng giá, thông số và ưu đãi độc quyền.',
                    align: 'center',
                    title_size: 'medium',
                    title_color: '#00095b'
                }
            } else if (type === 'LdpUsedVehicles') {
                newBlock.data = {
                    title: 'Xe Đã Qua Sử Dụng Chất Lượng Cao',
                    subtitle: 'Tuyển chọn các dòng xe Ford lướt được kiểm tra 167 điểm kỹ thuật, bảo hành chính hãng, nguồn gốc minh bạch.',
                    limit: 10,
                    align: 'center',
                    title_size: 'medium',
                    title_color: '#00095b'
                }
            }

            const list = [...this.blocks, newBlock]
            this.$emit('update:modelValue', list)
            this.activeTab = 'sections'
            this.activeIndex = list.length - 1
        },
        removeBlock(index) {
            const list = [...this.blocks]
            list.splice(index, 1)
            this.$emit('update:modelValue', list)
            if (this.activeIndex === index) {
                this.activeIndex = null
            } else if (this.activeIndex > index) {
                this.activeIndex--
            }
        },
        duplicateBlock(index) {
            const list = [...this.blocks]
            const blockCopy = JSON.parse(JSON.stringify(list[index]))
            blockCopy.id = 'block_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now()
            list.splice(index + 1, 0, blockCopy)
            this.$emit('update:modelValue', list)
            this.activeIndex = index + 1
        },
        moveUp(index) {
            if (index <= 0) return
            this.swapBlocks(index, index - 1)
        },
        moveDown(index) {
            if (index >= this.blocks.length - 1) return
            this.swapBlocks(index, index + 1)
        },
        swapBlocks(i, j) {
            const list = [...this.blocks]
            const temp = list[i]
            list[i] = list[j]
            list[j] = temp
            
            // Adjust activeIndex to follow the block
            if (this.activeIndex === i) {
                this.activeIndex = j
            } else if (this.activeIndex === j) {
                this.activeIndex = i
            }
            
            this.$emit('update:modelValue', list)
        },
        moveBlockToPosition(currentIndex, targetIndex) {
            if (currentIndex === targetIndex) return
            if (targetIndex < 0 || targetIndex >= this.blocks.length) return
            
            const list = [...this.blocks]
            const [movedBlock] = list.splice(currentIndex, 1)
            list.splice(targetIndex, 0, movedBlock)
            
            // Adjust activeIndex
            if (this.activeIndex === currentIndex) {
                this.activeIndex = targetIndex
            } else {
                if (currentIndex < this.activeIndex && this.activeIndex <= targetIndex) {
                    this.activeIndex--
                } else if (targetIndex <= this.activeIndex && this.activeIndex < currentIndex) {
                    this.activeIndex++
                }
            }
            
            this.$emit('update:modelValue', list)
        },
        getAlignValue(block) {
            if (!block || !block.data) return 'center'
            if (block.data.align) return block.data.align
            if (['Promotions', 'ThreeSixtyViewer', 'AccordionFAQs', 'BookingBanner'].includes(block.type)) {
                return 'left'
            }
            return 'center'
        },

        // Helper methods for FeaturesGrid
        addSplitFeature(blockIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            if (!list[blockIndex].data.split_features) {
                list[blockIndex].data.split_features = []
            }
            list[blockIndex].data.split_features.push({ value: '', label: '' })
            this.$emit('update:modelValue', list)
        },
        removeSplitFeature(blockIndex, featIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            list[blockIndex].data.split_features.splice(featIndex, 1)
            this.$emit('update:modelValue', list)
        },

        // Helper methods for FeaturesList
        addFeature(blockIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            if (!list[blockIndex].data.features) {
                list[blockIndex].data.features = []
            }
            list[blockIndex].data.features.push({ title: '', description: '', image: null })
            this.$emit('update:modelValue', list)
        },
        removeFeature(blockIndex, fIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            list[blockIndex].data.features.splice(fIndex, 1)
            this.$emit('update:modelValue', list)
        },

        // Helper methods for AccordionFAQs
        addFaq(blockIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            if (!list[blockIndex].data.faqs) {
                list[blockIndex].data.faqs = []
            }
            list[blockIndex].data.faqs.push({ q: '', a: '', is_open: true })
            this.$emit('update:modelValue', list)
        },
        removeFaq(blockIndex, faqIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            list[blockIndex].data.faqs.splice(faqIndex, 1)
            this.$emit('update:modelValue', list)
        },
        toggleFaqOpen(blockIndex, faqIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            const faq = list[blockIndex].data.faqs[faqIndex]
            faq.is_open = !faq.is_open
            this.$emit('update:modelValue', list)
        },

        // Helper methods for TestimonialSlider
        addTestimonial(blockIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            if (!list[blockIndex].data.reviews) {
                list[blockIndex].data.reviews = []
            }
            list[blockIndex].data.reviews.push({ name: '', content: '', rating: 5, role: '', avatar: null })
            this.$emit('update:modelValue', list)
        },
        removeTestimonial(blockIndex, rIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            list[blockIndex].data.reviews.splice(rIndex, 1)
            this.$emit('update:modelValue', list)
        },

        // Helper methods for ComparisonTable
        addComparisonRow(blockIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            if (!list[blockIndex].data.rows) {
                list[blockIndex].data.rows = []
            }
            list[blockIndex].data.rows.push({ criteria: '', ford_value: '', competitor_value: '', winner: 'ford' })
            this.$emit('update:modelValue', list)
        },
        removeComparisonRow(blockIndex, rowIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            list[blockIndex].data.rows.splice(rowIndex, 1)
            this.$emit('update:modelValue', list)
        },

        // Helper methods for GalleryMasonry
        addGalleryImage(blockIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            if (!list[blockIndex].data.images) {
                list[blockIndex].data.images = []
            }
            list[blockIndex].data.images.push({ src: null, caption: '' })
            this.$emit('update:modelValue', list)
        },
        removeGalleryImage(blockIndex, imgIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            list[blockIndex].data.images.splice(imgIndex, 1)
            this.$emit('update:modelValue', list)
        },

        // Helper methods for SocialProof
        addStatItem(blockIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            if (!list[blockIndex].data.stats) {
                list[blockIndex].data.stats = []
            }
            list[blockIndex].data.stats.push({ value: '', label: '', icon: '📊' })
            this.$emit('update:modelValue', list)
        },
        removeStatItem(blockIndex, sIndex) {
            const list = JSON.parse(JSON.stringify(this.blocks))
            list[blockIndex].data.stats.splice(sIndex, 1)
            this.$emit('update:modelValue', list)
        },

        // Drag-and-drop from Library to Layout
        cloneLibraryBlock(tpl) {
            // Create a shell object with just type and id. 
            // The actual data initialization will happen in onLibraryBlockAdd.
            return {
                id: 'block_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),
                type: tpl.type,
                is_collapsed: false,
                data: {}
            }
        },
        onLibraryBlockAdd(evt) {
            // When a block is dragged from library, it arrives as a shell.
            // We need to initialize its data using addBlockType logic.
            const newIndex = evt.newIndex
            const list = [...this.blocks]
            const block = list[newIndex]
            if (block && block.data && Object.keys(block.data).length === 0) {
                // Re-initialize data for the new block type
                const tempBlock = { data: {} }
                this._initBlockData(block.type, tempBlock)
                block.data = tempBlock.data
                this.$emit('update:modelValue', list)
                this.activeIndex = newIndex
                this.activeTab = 'sections'
            }
        },
        _initBlockData(type, block) {
            if (type === 'HeroBanner') {
                block.data = { title: '', tagline: '', button_text: 'Tìm hiểu thêm', button_link: '/lien-he', background_image: null, align: 'center', title_size: 'medium', title_color: '#ffffff', tagline_color: '#ffffff' }
            } else if (type === 'Promotions') {
                block.data = { title: '', description: '', image: null, button_text: 'Nhận báo giá ngay', align: 'left', title_size: 'medium', title_color: '#0562d2', desc_size: 'medium', desc_color: '#1a1a1a' }
            } else if (type === 'ThreeSixtyViewer') {
                block.data = { title: '', description: '', align: 'left', title_size: 'medium', title_color: '#0562d2', desc_size: 'medium', desc_color: '#1a1a1a' }
            } else if (type === 'FeaturesGrid') {
                block.data = { align: 'center', title_1: '', image_1: null, image_2: null, image_3: null, title_2: '', image_large: null, image_large_2: null, image_large_3: null, title_3: '', split_image: null, split_title: '', split_features: [{ value: '', label: '' }] }
            } else if (type === 'VersionsGrid') {
                block.data = { align: 'center', title: '', descriptions: ['', '', ''] }
            } else if (type === 'SpecsGrid') {
                block.data = { align: 'center' }
            } else if (type === 'FeaturesList') {
                block.data = { align: 'center', features: [{ title: '', description: '', image: null }] }
            } else if (type === 'AccordionFAQs') {
                block.data = { align: 'left', faqs: [{ q: '', a: '', is_open: true }] }
            } else if (type === 'BookingBanner') {
                block.data = { align: 'left', title: 'Kết nối ngay với chuyên viên Long Khánh Ford', phone: '0812 86 86 22', btn_text: 'Đặt lịch hẹn', btn_link: '/lien-he', car_image: null, title_size: 'medium', title_color: '#ffffff' }
            } else if (type === 'TestimonialSlider') {
                block.data = { align: 'center', title: 'Khách hàng nói gì về chúng tôi?', title_size: 'medium', title_color: '#1a1a1a', reviews: [{ name: '', content: '', rating: 5, role: '', avatar: null }] }
            } else if (type === 'VideoShowcase') {
                block.data = { align: 'center', title: '', description: '', video_url: '', thumbnail: null, display_mode: 'embed', title_size: 'medium', title_color: '#1a1a1a' }
            } else if (type === 'CountdownTimer') {
                block.data = { align: 'center', title: 'Ưu đãi đặc biệt — Sắp kết thúc!', subtitle: '', end_date: '', button_text: 'Đăng ký ngay', button_link: '/lien-he', background_image: null, title_size: 'medium', title_color: '#ffffff' }
            } else if (type === 'ComparisonTable') {
                block.data = { align: 'center', title: '', ford_name: '', competitor_name: '', ford_image: null, competitor_image: null, title_size: 'medium', title_color: '#1a1a1a', rows: [{ criteria: '', ford_value: '', competitor_value: '', winner: 'ford' }] }
            } else if (type === 'GalleryMasonry') {
                block.data = { align: 'center', title: 'Hình ảnh thực tế', columns: 3, title_size: 'medium', title_color: '#1a1a1a', images: [{ src: null, caption: '' }] }
            } else if (type === 'SocialProof') {
                block.data = { align: 'center', title: 'Tại sao chọn Long Khánh Ford?', background_image: null, title_size: 'medium', title_color: '#ffffff', stats: [{ value: '', label: '', icon: '🚗' }] }
            }
        },

        // Image URL helpers
        resolveImageUrl(image) {
            if (!image) return ''
            if (typeof image === 'string') {
                if (image.startsWith('http') || image.startsWith('data:') || image.startsWith('//')) return image
                if (/^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}|localhost)(:[0-9]+)?\//.test(image)) {
                    return window.location.protocol + '//' + image
                }
                return this.staticUrl(image)
            }
            if (typeof image === 'object') {
                if (image.path && typeof image.path === 'string') {
                    if (image.path.startsWith('http') || image.path.startsWith('data:') || image.path.startsWith('//')) return image.path
                    if (/^([a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}|localhost)(:[0-9]+)?\//.test(image.path)) {
                        return window.location.protocol + '//' + image.path
                    }
                    return this.staticUrl(image.path)
                }
                if (image.url && typeof image.url === 'string') return image.url
            }
            return ''
        },
        getBackgroundStyle(image) {
            const url = this.resolveImageUrl(image)
            if (url) {
                return { backgroundImage: `url(${url})` }
            }
            return {}
        },
        openAIModal(sectionType, fieldType, blockIndex, subIndex = null) {
            const sectionNames = {
                HeroBanner: 'Banner lớn (Hero)',
                Promotions: 'Khuyến mãi (Promotions)',
                ThreeSixtyViewer: 'Khám phá 360 độ',
                FeaturesGrid: 'Lưới tính năng (FeaturesGrid)',
                FeaturesList: 'Danh sách tính năng (FeaturesList)',
                AccordionFAQs: 'Hỏi đáp (AccordionFAQs)',
                BookingBanner: 'Banner đặt lịch (BookingBanner)',
                TestimonialSlider: 'Đánh giá khách hàng (Testimonials)',
                VideoShowcase: 'Video giới thiệu (VideoShowcase)',
                CountdownTimer: 'Đếm ngược ưu đãi (CountdownTimer)',
                ComparisonTable: 'So sánh đối thủ (ComparisonTable)',
                GalleryMasonry: 'Bộ sưu tập ảnh (GalleryMasonry)',
                SocialProof: 'Bằng chứng xã hội (SocialProof)',
            };
            this.aiTarget = {
                sectionType,
                sectionName: sectionNames[sectionType] || sectionType,
                fieldType,
                blockIndex,
                subIndex
            };
            this.aiUserPrompt = '';
            this.showAIPromptModal = true;
        },
        generateAIContent() {
            if (this.aiLoading) return;
            this.aiLoading = true;

            const vehicleTitle = this.vehicleData.title || (this.vehicleData.vi && this.vehicleData.vi.title) || 'Xe Ford';

            this.$axios.post(this.route('api.vehicles.generateBlockContent'), {
                vehicle_title: vehicleTitle,
                section_type: this.aiTarget.sectionType,
                field_type: this.aiTarget.fieldType,
                user_prompt: this.aiUserPrompt
            })
            .then(res => {
                if (res.data && res.data.success) {
                    const content = res.data.content;
                    const list = JSON.parse(JSON.stringify(this.blocks));
                    const targetBlock = list[this.aiTarget.blockIndex];
                    if (targetBlock) {
                        if (this.aiTarget.subIndex !== null && this.aiTarget.subIndex !== undefined) {
                            if (this.aiTarget.sectionType === 'FeaturesList' && targetBlock.data.features) {
                                targetBlock.data.features[this.aiTarget.subIndex][this.aiTarget.fieldType] = content;
                            } else if (this.aiTarget.sectionType === 'AccordionFAQs' && targetBlock.data.faqs) {
                                targetBlock.data.faqs[this.aiTarget.subIndex][this.aiTarget.fieldType] = content;
                            }
                        } else {
                            targetBlock.data[this.aiTarget.fieldType] = content;
                        }
                        this.$emit('update:modelValue', list);
                        this.syncToIframe();
                    }
                    this.showAIPromptModal = false;
                } else {
                    alert(res.data.message || 'Lỗi sinh nội dung AI');
                }
            })
            .catch(err => {
                console.error(err);
                const msg = err.response?.data?.message || 'Có lỗi xảy ra khi kết nối tới AI API';
                alert(msg);
            })
            .finally(() => {
                this.aiLoading = false;
            });
        }
    }
}
</script>

<style scoped>
/* Scrollbar styles for modern scroll */
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: #cbd5e1; /* Gray thumb */
    border-radius: 20px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}

/* Page builder container background colors */
.page-builder-container {
    background-color: #f6f6f7 !important; /* Shopify Light Gray */
}

/* Light Theme Design System Overrides for CMS Page Builder inputs */
.page-builder-container :deep(input[type="text"]),
.page-builder-container :deep(input[type="number"]),
.page-builder-container :deep(textarea),
.page-builder-container :deep(select),
.page-builder-container :deep(.p-inputtext),
.page-builder-container :deep(.p-inputtextarea),
.page-builder-container :deep(.p-dropdown),
.page-builder-container :deep(.p-selectbutton),
.page-builder-container :deep(.bg-gray-50) {
    background-color: #ffffff !important; /* White inputs */
    color: #1a1a1a !important; /* Dark text */
    border: 1px solid #cbd5e1 !important; /* light gray border */
    border-radius: 6px !important;
    padding: 0.625rem 0.875rem !important;
    font-size: 0.8rem !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
}

/* Specific Select Tag dropdown styling */
.page-builder-container :deep(select) {
    height: 42px !important;
    appearance: none !important;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") !important;
    background-repeat: no-repeat !important;
    background-position: right 0.75rem center !important;
    background-size: 1rem !important;
    padding-right: 2rem !important;
    cursor: pointer;
}

.page-builder-container :deep(select.pos-select) {
    height: 20px !important;
    padding: 0px 1.25rem 0px 0.375rem !important;
    font-size: 9px !important;
    background-position: right 0.25rem center !important;
    background-size: 0.6rem !important;
    box-shadow: none !important;
    border-radius: 4px !important;
}

/* Hover and Focus States */
.page-builder-container :deep(input[type="text"]:hover),
.page-builder-container :deep(input[type="number"]:hover),
.page-builder-container :deep(textarea:hover),
.page-builder-container :deep(select:hover),
.page-builder-container :deep(.p-inputtext:hover),
.page-builder-container :deep(.p-inputtextarea:hover),
.page-builder-container :deep(.p-dropdown:hover) {
    border-color: #94a3b8 !important;
    background-color: #ffffff !important;
}

.page-builder-container :deep(input[type="text"]:focus),
.page-builder-container :deep(input[type="number"]:focus),
.page-builder-container :deep(textarea:focus),
.page-builder-container :deep(select:focus),
.page-builder-container :deep(.p-inputtext:focus),
.page-builder-container :deep(.p-inputtextarea:focus),
.page-builder-container :deep(.p-dropdown:focus) {
    border-color: #008060 !important; /* Shopify green */
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px rgba(0, 128, 96, 0.15) !important;
    outline: none !important;
}

/* Textarea min height */
.page-builder-container :deep(textarea),
.page-builder-container :deep(.p-inputtextarea) {
    min-height: 84px !important;
    line-height: 1.6 !important;
    resize: vertical !important;
}

/* Light layout overrides for file uploads & media selector */
.page-builder-container :deep(.bg-gray-50) {
    background-color: #f9fafb !important;
    border: 1px dashed #cbd5e1 !important;
    border-radius: 6px !important;
    color: #4b5563 !important;
    padding: 0.75rem !important;
}
.page-builder-container :deep(.bg-gray-50:hover) {
    background-color: #f3f4f6 !important;
    border-color: #94a3b8 !important;
    color: #1f2937 !important;
}
.page-builder-container :deep(.border-gray-400),
.page-builder-container :deep(.border-gray-300),
.page-builder-container :deep(.border-gray-250),
.page-builder-container :deep(.border-gray-200) {
    border-color: #cbd5e1 !important;
    border-style: dashed !important;
}
.page-builder-container :deep(.text-gray-600),
.page-builder-container :deep(.text-gray-700) {
    color: #4b5563 !important;
}

/* Premium Color picker swatch customization */
.page-builder-container input[type="color"] {
    -webkit-appearance: none;
    border: 1px solid #cbd5e1 !important;
    border-radius: 6px !important;
    width: 42px !important;
    height: 42px !important;
    cursor: pointer;
    background: transparent !important;
    padding: 0 !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
}
.page-builder-container input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0 !important;
}
.page-builder-container input[type="color"]::-webkit-color-swatch {
    border: none !important;
    border-radius: 5px !important;
}

/* Label visual design overrides (clean typography) */
.page-builder-container :deep(label),
.page-builder-container label {
    color: #4b5563 !important; /* gray-600 */
    font-size: 11px !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    margin-bottom: 6px !important;
    display: block !important;
}

/* Active index border highlights */
.page-builder-container .ring-2.ring-blue-500 {
    --tw-ring-color: #008060 !important;
}
.page-builder-container .text-blue-400 {
    color: #008060 !important;
}
</style>
