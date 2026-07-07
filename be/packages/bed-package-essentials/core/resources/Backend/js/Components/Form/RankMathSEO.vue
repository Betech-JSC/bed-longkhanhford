<template>
    <div class="card border border-gray-200 shadow-sm mt-6">
        <div class="card-header bg-gray-50 border-b border-gray-200 py-3 px-4 flex items-center justify-between">
            <h3 class="font-bold text-sm text-[#00095b] flex items-center m-0">
                <span class="mr-2 text-base">📊</span> Rank Math SEO Analyzer
            </h3>
            <div class="flex items-center space-x-2">
                <span class="text-xs font-semibold text-gray-500">Điểm SEO:</span>
                <span 
                    class="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-xs transition-colors duration-300"
                    :class="scoreColorClass"
                >
                    {{ score }} / 100
                </span>
            </div>
        </div>

        <div class="card-body p-4 space-y-4">
            <!-- Focus Keyword Input -->
            <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    Từ khóa chính (Focus Keyword)
                </label>
                <input 
                    type="text" 
                    v-model="focusKeyword"
                    @input="updateKeyword"
                    placeholder="Nhập từ khóa chính để phân tích bài viết (ví dụ: ford ranger wildtrak)"
                    class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-[#0562d2] focus:border-[#0562d2] focus:outline-none transition shadow-xs"
                />
            </div>

            <!-- Tab Headers -->
            <div class="border-b border-gray-200">
                <nav class="flex space-x-4 -mb-px">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab.id"
                        @click="activeTab = tab.id"
                        type="button"
                        class="pb-2 text-xs font-bold uppercase tracking-wider border-b-2 bg-transparent border-0 cursor-pointer transition-colors duration-200 px-1"
                        :class="activeTab === tab.id ? 'border-[#0562d2] text-[#0562d2]' : 'border-transparent text-gray-400 hover:text-gray-600'"
                    >
                        {{ tab.label }}
                    </button>
                </nav>
            </div>

            <!-- Tab Contents -->
            <div class="pt-1">
                <!-- 1. CHECKLIST TAB -->
                <div v-show="activeTab === 'checklist'" class="space-y-4">
                    <div v-if="!focusKeyword.trim()" class="text-center py-6 text-gray-400 text-sm italic">
                        Vui lòng nhập Từ khóa chính phía trên để xem kết quả phân tích.
                    </div>
                    <div v-else class="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                        <!-- Group list -->
                        <div v-for="group in checklistGroups" :key="group.title" class="space-y-2">
                            <div class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b pb-1">
                                {{ group.title }}
                            </div>
                            <div 
                                v-for="item in group.items" 
                                :key="item.label" 
                                class="flex items-start text-xs py-1"
                            >
                                <span class="mr-2 flex-shrink-0 mt-0.5">
                                    <!-- Checked SVG -->
                                    <svg v-if="item.status === 'passed'" class="w-4 h-4 text-green-600 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                                    </svg>
                                    <!-- Warn SVG -->
                                    <svg v-else-if="item.status === 'warning'" class="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                        <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                                    </svg>
                                    <!-- Fail SVG -->
                                    <svg v-else class="w-4 h-4 text-red-500 fill-current" viewBox="0 0 20 20">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                                    </svg>
                                </span>
                                <div class="flex-1">
                                    <div class="font-semibold" :class="item.status === 'passed' ? 'text-gray-800' : 'text-gray-500'">
                                        {{ item.label }}
                                    </div>
                                    <div class="text-[10px] text-gray-400 mt-0.5">
                                        {{ item.hint }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. SNIPPET PREVIEW TAB -->
                <div v-show="activeTab === 'preview'" class="space-y-4">
                    <div class="flex justify-end space-x-2 mb-2">
                        <button 
                            type="button"
                            @click="previewDevice = 'desktop'"
                            class="px-2 py-1 text-[10px] font-semibold rounded border cursor-pointer"
                            :class="previewDevice === 'desktop' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'"
                        >
                            Desktop
                        </button>
                        <button 
                            type="button"
                            @click="previewDevice = 'mobile'"
                            class="px-2 py-1 text-[10px] font-semibold rounded border cursor-pointer"
                            :class="previewDevice === 'mobile' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'"
                        >
                            Mobile
                        </button>
                    </div>

                    <!-- Desktop Preview -->
                    <div 
                        v-if="previewDevice === 'desktop'" 
                        class="border border-gray-200 rounded p-4 bg-white max-w-2xl font-sans"
                    >
                        <div class="text-xs text-gray-500 mb-1 flex items-center">
                            <span>https://dongnaiford.com.vn</span>
                            <span class="mx-1">›</span>
                            <span class="truncate max-w-[200px]">{{ currentSlug || 'sample-slug' }}</span>
                        </div>
                        <h4 class="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer m-0 leading-tight">
                            {{ currentSeoTitle || currentTitle || 'Vui lòng nhập tiêu đề bài viết...' }}
                        </h4>
                        <p class="text-sm text-[#4d5156] leading-relaxed mt-1 m-0">
                            <span class="text-gray-400 mr-1">{{ currentDate }} —</span>
                            {{ currentSeoDescription || currentDescription || 'Vui lòng nhập mô tả bài viết (Meta Description) để xem trước thông tin hiển thị tìm kiếm Google...' }}
                        </p>
                    </div>

                    <!-- Mobile Preview -->
                    <div 
                        v-else 
                        class="border border-gray-200 rounded-2xl p-4 bg-white max-w-sm font-sans mx-auto shadow-xs"
                    >
                        <div class="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                            <div class="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[8px] text-gray-600">F</div>
                            <div class="flex flex-col">
                                <span class="text-[10px] text-gray-800 leading-none">Đồng Nai Ford</span>
                                <span class="text-[9px] text-gray-400 leading-none mt-0.5">https://dongnaiford.com.vn/{{ currentSlug || 'slug' }}</span>
                            </div>
                        </div>
                        <h4 class="text-base text-[#15c] font-medium hover:underline cursor-pointer m-0 leading-tight">
                            {{ currentSeoTitle || currentTitle || 'Vui lòng nhập tiêu đề...' }}
                        </h4>
                        <p class="text-xs text-[#4d5156] leading-relaxed mt-1 m-0 line-clamp-3">
                            <span class="text-gray-400 mr-1">{{ currentDate }} —</span>
                            {{ currentSeoDescription || currentDescription || 'Vui lòng nhập mô tả bài viết...' }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: {
            type: Object,
            default: () => ({})
        },
        locale: {
            type: String,
            default: 'vi'
        }
    },
    emits: ['update:modelValue'],
    data() {
        return {
            activeTab: 'checklist',
            previewDevice: 'desktop',
            focusKeyword: '',
            tabs: [
                { id: 'checklist', label: 'Bảng kiểm SEO' },
                { id: 'preview', label: 'Xem trước Google' }
            ]
        };
    },
    computed: {
        activeObject() {
            // If the modelValue is translation tab specific (e.g. form[currentTab])
            if (this.modelValue && this.modelValue.title !== undefined) {
                return this.modelValue;
            }
            // If it's root form, find the locale data object
            if (this.locale && this.modelValue && this.modelValue[this.locale]) {
                return this.modelValue[this.locale];
            }
            return this.modelValue;
        },
        currentTitle() {
            return this.activeObject?.title || '';
        },
        currentDescription() {
            return this.activeObject?.description || '';
        },
        currentContent() {
            return this.activeObject?.content || '';
        },
        currentSlug() {
            return this.activeObject?.slug || this.modelValue?.seo_slug || '';
        },
        currentSeoTitle() {
            return this.modelValue?.seo_meta_title || this.activeObject?.seo_meta_title || '';
        },
        currentSeoDescription() {
            return this.modelValue?.seo_meta_description || this.activeObject?.seo_meta_description || '';
        },
        currentDate() {
            const d = new Date();
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        },
        cleanedContentText() {
            if (!this.currentContent) return '';
            // Strip HTML tags
            return this.currentContent.replace(/<\/?[^>]+(>|$)/g, " ");
        },
        wordCount() {
            const text = this.cleanedContentText.trim();
            if (!text) return 0;
            return text.split(/\s+/).length;
        },
        keywordDensity() {
            if (!this.focusKeyword.trim() || !this.cleanedContentText) return 0;
            const text = this.cleanedContentText.toLowerCase();
            const kw = this.focusKeyword.toLowerCase();
            
            // Escape special chars for regex
            const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            const regex = new RegExp(escapedKw, 'g');
            const matches = text.match(regex);
            
            const count = matches ? matches.length : 0;
            if (this.wordCount === 0) return 0;
            return parseFloat(((count / this.wordCount) * 100).toFixed(2));
        },
        checks() {
            const kw = this.focusKeyword.trim().toLowerCase();
            if (!kw) return [];

            const title = (this.currentSeoTitle || this.currentTitle).toLowerCase();
            const desc = (this.currentSeoDescription || this.currentDescription).toLowerCase();
            const slug = this.currentSlug.toLowerCase();
            const content = this.currentContent.toLowerCase();
            const text = this.cleanedContentText.toLowerCase();

            // 1. Keyword in SEO Title
            const keywordInTitle = title.includes(kw);
            
            // 2. Keyword in Meta Description
            const keywordInDesc = desc.includes(kw);

            // 3. Keyword in URL
            // Slugify keyword for comparison
            const slugifiedKw = this.slugify(kw);
            const keywordInSlug = slug.includes(slugifiedKw) || slug.includes(kw.replace(/\s+/g, '-'));

            // 4. Keyword in Content
            const keywordInContent = text.includes(kw);

            // 5. Keyword at first 10%
            const first10Percent = text.substring(0, Math.ceil(text.length * 0.15));
            const keywordAtStart = first10Percent.includes(kw) || text.substring(0, 1000).includes(kw);

            // 6. Keyword in Headings
            let keywordInHeadings = false;
            let keywordInAlts = false;
            let hasImages = false;
            let hasLongParagraphs = false;

            if (typeof window !== 'undefined') {
                const parser = new DOMParser();
                const doc = parser.parseFromString(this.currentContent, 'text/html');
                const headings = doc.querySelectorAll('h2, h3, h4');
                headings.forEach(h => {
                    if (h.textContent.toLowerCase().includes(kw)) {
                        keywordInHeadings = true;
                    }
                });

                // 7. Keyword in Image Alt attributes
                const imgs = doc.querySelectorAll('img');
                hasImages = imgs.length > 0;
                imgs.forEach(img => {
                    const alt = img.getAttribute('alt');
                    if (alt && alt.toLowerCase().includes(kw)) {
                        keywordInAlts = true;
                    }
                });

                // 11. Short paragraphs
                const paragraphs = doc.querySelectorAll('p');
                paragraphs.forEach(p => {
                    const pWords = p.textContent.trim().split(/\s+/).length;
                    if (pWords > 120) {
                        hasLongParagraphs = true;
                    }
                });
            }
            // 8. Density
            const densityOk = this.keywordDensity >= 1.0 && this.keywordDensity <= 2.5;

            // 9. Length checks
            const lengthStatus = this.wordCount >= 1200 ? 'passed' : (this.wordCount >= 600 ? 'warning' : 'failed');
            const titleLength = (this.currentSeoTitle || this.currentTitle).length;
            const titleLengthOk = titleLength >= 50 && titleLength <= 60;
            const descLength = (this.currentSeoDescription || this.currentDescription).length;
            const descLengthOk = descLength >= 120 && descLength <= 160;

            // 10. Title has number
            const titleHasNumber = /\d+/.test(this.currentSeoTitle || this.currentTitle);

            return {
                keywordInTitle,
                keywordInDesc,
                keywordInSlug,
                keywordInContent,
                keywordAtStart,
                keywordInHeadings,
                keywordInAlts,
                hasImages,
                densityOk,
                lengthStatus,
                titleLengthOk,
                titleLength,
                descLengthOk,
                descLength,
                titleHasNumber,
                hasLongParagraphs
            };
        },
        score() {
            if (!this.focusKeyword.trim()) return 0;
            
            let pts = 0;
            const c = this.checks;

            if (c.keywordInTitle) pts += 15;
            if (c.keywordInDesc) pts += 15;
            if (c.keywordInSlug) pts += 10;
            if (c.keywordInContent) pts += 15;
            if (c.keywordAtStart) pts += 10;
            if (c.keywordInHeadings) pts += 10;
            
            // Keyword density scoring
            if (this.keywordDensity >= 1.0 && this.keywordDensity <= 2.5) {
                pts += 10;
            } else if (this.keywordDensity > 0 && this.keywordDensity < 1.0) {
                pts += 5;
            }

            // Word count scoring
            if (this.wordCount >= 1200) {
                pts += 15;
            } else if (this.wordCount >= 600) {
                pts += 10;
            } else if (this.wordCount > 0) {
                pts += 5;
            }

            return pts;
        },
        scoreColorClass() {
            if (this.score >= 80) return 'bg-green-600';
            if (this.score >= 50) return 'bg-yellow-500';
            return 'bg-red-500';
        },
        checklistGroups() {
            const c = this.checks;
            if (!this.focusKeyword.trim()) return [];

            return [
                {
                    title: 'SEO Cơ bản',
                    items: [
                        {
                            label: 'Từ khóa chính trong tiêu đề SEO',
                            hint: 'Từ khóa chính phải xuất hiện trong tiêu đề SEO của bài viết.',
                            status: c.keywordInTitle ? 'passed' : 'failed'
                        },
                        {
                            label: 'Từ khóa chính trong mô tả Meta',
                            hint: 'Meta Description nên chứa từ khóa chính để hấp dẫn người dùng click.',
                            status: c.keywordInDesc ? 'passed' : 'failed'
                        },
                        {
                            label: 'Từ khóa chính xuất hiện trong URL',
                            hint: 'Đường dẫn slug của trang nên có chứa từ khóa chính (dưới dạng không dấu).',
                            status: c.keywordInSlug ? 'passed' : 'failed'
                        },
                        {
                            label: 'Từ khóa chính trong nội dung bài viết',
                            hint: 'Từ khóa chính phải xuất hiện trong phần nội dung văn bản.',
                            status: c.keywordInContent ? 'passed' : 'failed'
                        },
                        {
                            label: 'Từ khóa chính xuất hiện ở đầu bài viết',
                            hint: 'Nên chèn từ khóa chính trong 10% lượng từ đầu tiên (hoặc 1000 ký tự đầu).',
                            status: c.keywordAtStart ? 'passed' : 'failed'
                        },
                        {
                            label: 'Độ dài bài viết',
                            hint: `Độ dài hiện tại: ${this.wordCount} từ. (Khuyên dùng: từ 600-1200 từ trở lên).`,
                            status: c.lengthStatus
                        }
                    ]
                },
                {
                    title: 'SEO Bổ sung',
                    items: [
                        {
                            label: 'Từ khóa chính trong tiêu đề phụ (H2, H3...)',
                            hint: 'Chèn từ khóa chính vào các thẻ headings bổ trợ.',
                            status: c.keywordInHeadings ? 'passed' : 'warning'
                        },
                        {
                            label: 'Hình ảnh có thuộc tính Alt chứa từ khóa',
                            hint: c.hasImages 
                                ? (c.keywordInAlts ? 'Alt của hình ảnh đã có chứa từ khóa chính.' : 'Có hình ảnh nhưng thuộc tính Alt chưa chứa từ khóa.') 
                                : 'Bài viết chưa có hình ảnh nào. Hãy chèn ít nhất 1 hình ảnh.',
                            status: c.hasImages ? (c.keywordInAlts ? 'passed' : 'warning') : 'failed'
                        },
                        {
                            label: 'Mật độ từ khóa chính',
                            hint: `Mật độ hiện tại: ${this.keywordDensity}%. (Khuyên dùng từ 1.0% - 2.5%).`,
                            status: c.densityOk ? 'passed' : 'warning'
                        }
                    ]
                },
                {
                    title: 'Khả năng hiển thị tiêu đề',
                    items: [
                        {
                            label: 'Từ khóa chính nằm ở đầu Tiêu đề SEO',
                            hint: 'Nên đặt từ khóa chính ở những từ đầu tiên của tiêu đề để tăng điểm ưu tiên.',
                            status: (this.currentSeoTitle || this.currentTitle).toLowerCase().startsWith(this.focusKeyword.toLowerCase()) ? 'passed' : 'warning'
                        },
                        {
                            label: 'Tiêu đề có độ dài tối ưu',
                            hint: `Độ dài tiêu đề: ${ (this.currentSeoTitle || this.currentTitle).length } ký tự. (Khuyên dùng từ 50-60 ký tự).`,
                            status: c.titleLengthOk ? 'passed' : 'warning'
                        },
                        {
                            label: 'Tiêu đề chứa chữ số',
                            hint: 'Tiêu đề chứa chữ số giúp nâng cao tỷ lệ nhấp chuột (CTR) đáng kể.',
                            status: c.titleHasNumber ? 'passed' : 'warning'
                        }
                    ]
                },
                {
                    title: 'Tính dễ đọc của bài viết',
                    items: [
                        {
                            label: 'Sử dụng các đoạn văn ngắn gọn',
                            hint: c.hasLongParagraphs ? 'Có đoạn văn quá dài (trên 120 từ). Hãy ngắt nhỏ đoạn văn.' : 'Đoạn văn ngắn gọn, dễ đọc.',
                            status: c.hasLongParagraphs ? 'warning' : 'passed'
                        },
                        {
                            label: 'Chèn đa phương tiện (Ảnh/Video)',
                            hint: c.hasImages ? 'Đã có chứa ảnh hoặc video.' : 'Nên chèn ảnh để người dùng không cảm thấy nhàm chán.',
                            status: c.hasImages ? 'passed' : 'warning'
                        }
                    ]
                }
            ];
        }
    },
    watch: {
        modelValue: {
            handler() {
                // Keep parent updated if needed
            },
            deep: true
        }
    },
    created() {
        // Load initial focus keyword if exists in modelValue
        if (this.modelValue) {
            this.focusKeyword = this.modelValue.seo_focus_keyword || this.activeObject?.seo_focus_keyword || '';
        }
    },
    methods: {
        updateKeyword() {
            if (this.modelValue && this.modelValue.title !== undefined) {
                // If it's translation tab specific (e.g. form[currentTab])
                this.modelValue.seo_focus_keyword = this.focusKeyword;
                this.$emit('update:modelValue', this.modelValue);
            } else if (this.locale && this.modelValue) {
                // If it's root form, update root or locale specific
                // If the model has seo_focus_keyword translatable, it must be inside form[locale]
                if (!this.modelValue[this.locale]) {
                    this.modelValue[this.locale] = {};
                }
                this.modelValue[this.locale].seo_focus_keyword = this.focusKeyword;
                // Also set root if needed for fallback
                this.modelValue.seo_focus_keyword = this.focusKeyword;
                this.$emit('update:modelValue', this.modelValue);
            }
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
        }
    }
};
</script>
