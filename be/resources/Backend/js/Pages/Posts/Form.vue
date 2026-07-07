<template layout>
    <Form v-model="formData">
        <template #default="{ form }">
            <!-- ===== AI WRITER ASSISTANT ===== -->
            <div class="card mb-6 border-purple-200">
                <div class="card-header bg-purple-50 text-purple-900 flex items-center justify-between py-2.5 px-4 cursor-pointer select-none" @click="aiShowPanel = !aiShowPanel">
                    <span class="font-bold flex items-center text-sm">
                        <span class="mr-1.5 text-base">✨</span>
                        Trợ lý viết bài AI (Gemini AI Writer)
                    </span>
                    <span class="text-xs text-purple-600 font-semibold flex items-center">
                        {{ aiShowPanel ? 'Thu gọn ◀' : 'Mở rộng trợ lý viết bài ▶' }}
                    </span>
                </div>
                <div v-show="aiShowPanel" class="card-body bg-purple-50/10 border-t border-purple-100 p-4 space-y-4">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="col-span-2">
                            <div class="text-xs text-gray-500 font-semibold mb-1">Chủ đề / Ý tưởng bài viết <span class="text-red-500">*</span></div>
                            <input 
                                type="text" 
                                v-model="aiTopic"
                                placeholder="Ví dụ: Giới thiệu xe Ford Ranger Wildtrak 2026 phiên bản mới nhất"
                                class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <div class="text-xs text-gray-500 font-semibold mb-1">Giọng điệu bài viết</div>
                            <select 
                                v-model="aiTone"
                                class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="chuyên nghiệp">Chuyên nghiệp</option>
                                <option value="thân thiện">Thân thiện, gần gũi</option>
                                <option value="bán hàng (sales-focused)">Bán hàng & Kêu gọi hành động</option>
                                <option value="tin tức">Tin tức thời sự</option>
                                <option value="hào hứng">Hào hứng, cuốn hút</option>
                            </select>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <div class="text-xs text-gray-500 font-semibold mb-1">Từ khóa SEO (Phân cách bằng dấu phẩy)</div>
                            <input 
                                type="text" 
                                v-model="aiKeywords"
                                placeholder="Ví dụ: ford ranger 2026, giá xe ranger wildtrak, ford dong nai"
                                class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <div class="text-xs text-gray-500 font-semibold mb-1">Ngôn ngữ áp dụng</div>
                            <div class="flex items-center space-x-4 h-9">
                                <label class="flex items-center text-sm cursor-pointer select-none">
                                    <input type="radio" value="vi" v-model="aiLanguage" class="mr-1.5 focus:ring-purple-500" />
                                    🇻🇳 Tiếng Việt
                                </label>
                                <label class="flex items-center text-sm cursor-pointer select-none">
                                    <input type="radio" value="en" v-model="aiLanguage" class="mr-1.5 focus:ring-purple-500" />
                                    🇬🇧 English
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="text-xs text-gray-500 font-semibold mb-1">Dàn ý bài viết / Yêu cầu cụ thể (Không bắt buộc)</div>
                        <textarea 
                            v-model="aiOutline"
                            rows="3"
                            placeholder="Ví dụ: phần 1 giới thiệu ngoại thất xe, phần 2 động cơ dầu 2.0L Bi-Turbo, phần 3 giá lăn bánh tại Đồng Nai và khuyến mãi kèm theo."
                            class="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        ></textarea>
                    </div>

                    <div class="flex justify-end pt-2">
                        <button 
                            type="button"
                            :disabled="aiLoading || !aiTopic.trim()"
                            @click="generateAI"
                            class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-bold flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-0 cursor-pointer shadow-sm"
                        >
                            <span v-if="aiLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            <span>{{ aiLoading ? 'Đang viết bài...' : '🪄 Viết bài bằng AI' }}</span>
                        </button>
                    </div>

                    <!-- AI GENERATED RESULTS PREVIEW -->
                    <div v-if="aiResult" class="border border-purple-200 rounded-lg overflow-hidden bg-white mt-4 shadow-sm">
                        <div class="bg-purple-100/50 px-4 py-2 flex items-center justify-between border-b border-purple-200">
                            <span class="text-xs font-bold text-purple-900 flex items-center">
                                <span class="mr-1 text-sm">💡</span> Xem thử bài viết tạo bởi AI
                            </span>
                            <button 
                                type="button"
                                @click="applyAIResult"
                                class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded flex items-center transition-colors border-0 cursor-pointer shadow-sm"
                            >
                                ✅ Áp dụng vào bài viết ({{ aiLanguage === 'vi' ? 'Tiếng Việt' : 'English' }})
                            </button>
                        </div>
                        <div class="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                            <div>
                                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Tiêu đề bài viết</div>
                                <div class="text-sm font-bold text-gray-900 border-b pb-2">{{ aiResult.title }}</div>
                            </div>
                            <div>
                                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Mô tả bài viết (Meta Description)</div>
                                <div class="text-xs text-gray-600 italic border-b pb-2">{{ aiResult.description }}</div>
                            </div>
                            <div>
                                <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Nội dung bài viết (HTML Preview)</div>
                                <div class="prose prose-sm max-w-none text-sm text-gray-800 leading-relaxed" v-html="aiResult.content"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ===== LOCALE TABS ===== -->
            <div class="card">
                <div class="card-header border-b-0 pb-0">
                    <ul class="flex border-b">
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'vi' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'vi'">🇻🇳 Tiếng Việt</a>
                        </li>
                        <li class="-mb-px mr-1">
                            <a class="bg-white inline-block py-2 px-4 font-semibold cursor-pointer"
                               :class="currentTab === 'en' ? 'border-l border-t border-r rounded-t text-primary-700' : 'text-gray-500 hover:text-primary-800'"
                               @click="currentTab = 'en'">🇬🇧 English</a>
                        </li>
                    </ul>
                </div>
                <div class="card-body mt-4">
                    <Field
                        v-model="form[currentTab].title"
                        :field="{
                            type: 'text',
                            name: `title_${currentTab}`,
                            label: 'Tiêu đề',
                        }"
                    />
                    <small v-if="form.id">
                        <span v-for="(url, locale) in form.url" :key="locale">
                            {{ locale }}: <a :href="url" target="_blank" class="link">{{ decodeURI(url) }}</a><br />
                        </span>
                    </small>
                    <Field
                        v-model="form[currentTab].author"
                        :field="{
                            type: 'text',
                            name: `author_${currentTab}`,
                            label: 'Tác giả',
                        }"
                    />
                    <Field
                        v-model="form[currentTab].description"
                        :field="{
                            type: 'textarea',
                            name: `description_${currentTab}`,
                            label: 'Mô tả',
                        }"
                    />
                    <Field
                        v-model="form[currentTab].content"
                        :field="{
                            type: 'richtext',
                            name: `content_${currentTab}`,
                            label: 'Nội dung',
                        }"
                    />
                </div>
            </div>
            <SeoFields :modelValue="form" :locale="currentTab" @update:modelValue="form = $event" />
        </template>

        <template #aside="{ form }">
            <div class="card">
                <div class="card-body">
                    <Field v-model="form.status" :field="{
                        type: 'radio_list',
                        name: 'status',
                        label: 'Trạng thái',
                        options: schema.columns.status.list,
                    }" />
                    <Field v-model="form.published_at" :field="{
                        type: 'date',
                        name: 'published_at',
                        label: 'Ngày xuất bản',
                    }" />
                    <Field v-model="form.is_featured" :field="{
                        type: 'checkbox',
                        name: 'is_featured',
                        label: 'Nổi bật',
                    }" />
                    <Field v-model="form.image" :field="{
                        type: 'file_upload',
                        name: 'image',
                        multiple: false,
                    }" />
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <Field v-model="form.categories" :field="{
                        type: 'select_multiple',
                        name: 'categories',
                        labelBy: 'title',
                        source: {
                            model: 'App\\Models\\Post\\PostCategory',
                            method: 'get',
                            only: ['id', 'title'],
                        },
                    }" />
                    <Field v-model="form.related_posts" :field="{
                        type: 'select_multiple',
                        name: 'related_posts',
                        labelBy: 'title',
                        source: {
                            model: 'App\\Models\\Post\\Post',
                            method: 'get',
                            only: ['id', 'title'],
                        },
                    }" />
                </div>
            </div>
        </template>
    </Form>
</template>

<script>
import axios from 'axios';

export default {
    props: ['item', 'schema'],

    data() {
        return {
            currentTab: this.getCurrentLocale?.() ?? 'vi',
            formData: this.initFormData(this.item),
            aiShowPanel: false,
            aiTopic: '',
            aiTone: 'chuyên nghiệp',
            aiKeywords: '',
            aiLanguage: 'vi',
            aiOutline: '',
            aiLoading: false,
            aiResult: null,
        }
    },

    watch: {
        item() {
            this.formData = this.initFormData(this.item)
        },
    },

    methods: {
        initFormData(item) {
            const data = {
                status: 'ACTIVE',
                ...item,
            }
            const locales = ['vi', 'en']
            locales.forEach(loc => {
                let trans = null
                if (item.translations && Array.isArray(item.translations)) {
                    trans = item.translations.find(t => t.locale === loc)
                }
                data[loc] = {
                    title:       trans ? (trans.title       ?? '') : (loc === 'vi' ? (item.title       ?? '') : ''),
                    slug:        trans ? (trans.slug        ?? '') : (loc === 'vi' ? (item.slug        ?? '') : ''),
                    author:      trans ? (trans.author      ?? '') : (loc === 'vi' ? (item.author      ?? '') : ''),
                    description: trans ? (trans.description ?? '') : (loc === 'vi' ? (item.description ?? '') : ''),
                    content:     trans ? (trans.content     ?? '') : (loc === 'vi' ? (item.content     ?? '') : ''),
                }
            })
            return data
        },
        generateAI() {
            if (!this.aiTopic.trim()) return;
            this.aiLoading = true;
            this.aiResult = null;
            
            axios.post(route('admin.posts.generate-ai'), {
                topic: this.aiTopic,
                tone: this.aiTone,
                keywords: this.aiKeywords,
                outline: this.aiOutline,
                language: this.aiLanguage
            })
            .then(res => {
                if (res.data && res.data.success) {
                    this.aiResult = res.data.data;
                } else {
                    alert('Lỗi tạo bài viết: ' + (res.data?.message || 'Không có phản hồi'));
                }
            })
            .catch(err => {
                alert('Có lỗi xảy ra: ' + (err.response?.data?.message || err.message));
            })
            .finally(() => {
                this.aiLoading = false;
            });
        },
        applyAIResult() {
            if (!this.aiResult) return;
            
            this.currentTab = this.aiLanguage;

            if (!this.formData[this.currentTab]) {
                this.formData[this.currentTab] = {};
            }

            this.formData[this.currentTab].title = this.aiResult.title;
            this.formData[this.currentTab].description = this.aiResult.description;
            this.formData[this.currentTab].content = this.aiResult.content;
            
            alert('Đã áp dụng kết quả từ AI vào tab bài viết ' + (this.aiLanguage === 'vi' ? 'Tiếng Việt' : 'English') + '!');
        }
    },
}
</script>
