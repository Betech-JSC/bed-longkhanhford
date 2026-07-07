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
                        <div v-if="['Promotions', 'ThreeSixtyViewer'].includes(blocks[activeIndex].type)" class="grid grid-cols-2 gap-3">
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
                        class="space-y-3"
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
                                <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition">
                                    <button type="button" class="text-xs text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg border border-gray-250 cursor-pointer" title="Nhấn để sửa">
                                        ⚙️
                                    </button>
                                    <button type="button" class="text-xs text-gray-500 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-lg border border-gray-250 cursor-pointer" title="Nhân bản" @click.stop="duplicateBlock(index)">
                                        ➕
                                    </button>
                                    <button type="button" class="text-xs text-red-500 hover:text-red-650 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg border border-red-200 cursor-pointer" title="Xóa" @click.stop="removeBlock(index)">
                                        ✕
                                    </button>
                                </div>
                            </div>
                        </template>
                    </Draggable>

                    <div v-else class="border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 italic text-xs">
                        Chưa có khối giao diện nào được thêm vào trang xe này. Hãy chọn tab "Thêm khối mới" để bắt đầu thiết kế.
                    </div>
                </div>

                <!-- SCENE B2: BLOCK TEMPLATE LIBRARY (TAB 2) -->
                <div v-else-if="activeTab === 'library'" class="grid grid-cols-1 gap-3">
                    <div 
                        v-for="tpl in libraryBlocks" 
                        :key="tpl.type" 
                        class="flex items-center p-3.5 bg-white border border-gray-200 hover:border-[#008060] hover:bg-emerald-50/5 rounded-xl cursor-pointer transition select-none group"
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
                    <span class="text-gray-400">🌐 https://dongnaiford.com.vn/xe/chi-tiet-xem-truoc</span>
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
                { type: 'Promotions', icon: '🎁', name: 'Ưu đãi khuyến mãi', desc: 'Thông tin quà tặng tiền mặt, bảo hiểm và quà độc quyền' },
                { type: 'ThreeSixtyViewer', icon: '🔄', name: 'Trình xem xoay 360°', desc: 'Mô phỏng đổi màu ngoại thất xe và tự do xoay góc nhìn' },
                { type: 'FeaturesGrid', icon: '🔲', name: 'Khung lưới tính năng', desc: 'Bố cục ghép ảnh dạng lưới cho Thiết kế, Nội thất, Công nghệ' },
                { type: 'VersionsGrid', icon: '🚗', name: 'Danh sách các phiên bản', desc: 'So sánh ngắn và hiển thị các phiên bản cùng mức giá' },
                { type: 'SpecsGrid', icon: '📊', name: 'Bảng so sánh thông số', desc: 'So sánh song song thông số chi tiết động cơ, hộp số...' },
                { type: 'FeaturesList', icon: '✨', name: 'Danh sách công nghệ', desc: 'Liệt kê so le các tính năng lái an toàn chủ động' },
                { type: 'AccordionFAQs', icon: '❓', name: 'Câu hỏi thường gặp', desc: 'Các thắc mắc xếp gập về bảo dưỡng, giá lăn bánh' },
                { type: 'BookingBanner', icon: '📞', name: 'Tư vấn & Đặt lịch', desc: 'Khối liên hệ hotline và liên kết đặt lịch hẹn bảo dưỡng' },
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
            let host = 'http://localhost:3000';
            const hostname = window.location.hostname;
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                host = 'http://localhost:3000';
            } else if (hostname === 'cms.dnf.betech-digital.com') {
                host = 'https://client.dnf.betech-digital.com';
            } else if (hostname === 'cms.dongnaiford.com.vn') {
                host = 'https://dongnaiford.com.vn';
            } else {
                if (hostname.startsWith('cms.')) {
                    host = window.location.origin.replace('//cms.', '//client.');
                } else {
                    host = window.location.origin;
                }
            }
            const slug = this.vehicleSlug || 'preview';
            return `${host}/san-pham/${slug}?edit=true&embed=true`;
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
                try {
                    iframe.contentWindow.postMessage({
                        type: 'INIT_PREVIEW',
                        vehicle: JSON.parse(JSON.stringify(this.vehicleData || {})),
                        blocks: JSON.parse(JSON.stringify(resolvedBlocks || [])),
                        activeIndex: this.activeIndex
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
                try {
                    iframe.contentWindow.postMessage({
                        type: 'UPDATE_BLOCKS',
                        blocks: JSON.parse(JSON.stringify(this.resolveBlockImages(this.blocks) || [])),
                        activeIndex: this.activeIndex
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
                    title: 'Kết nối ngay với chuyên viên Đồng Nai Ford',
                    phone: '1800 55 68 58',
                    btn_text: 'Đặt lịch hẹn',
                    btn_link: '/lien-he?reason=Đặt hẹn dịch vụ',
                    car_image: null,
                    title_size: 'medium',
                    title_color: '#ffffff'
                }
            }

            const list = [...this.blocks, newBlock]
            this.$emit('update:modelValue', list)
            this.activeTab = 'sections'
            this.activeIndex = list.length - 1
        },
        removeBlock(index) {
            if (confirm('Bạn có chắc chắn muốn xóa khối nội dung này không?')) {
                const list = [...this.blocks]
                list.splice(index, 1)
                this.$emit('update:modelValue', list)
                if (this.activeIndex === index) {
                    this.activeIndex = null
                } else if (this.activeIndex > index) {
                    this.activeIndex--
                }
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
