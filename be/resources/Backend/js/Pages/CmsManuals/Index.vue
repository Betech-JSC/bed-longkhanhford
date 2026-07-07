<template layout>
    <div class="manual-container">
        <!-- Header area -->
        <div class="manual-header">
            <h1 class="manual-title">
                <span>📚 Hướng dẫn vận hành hệ thống CMS</span>
            </h1>
        </div>

        <!-- Reading Mode (GitBook style docs) -->
        <div class="reader-view">
            <!-- Sidebar for topics -->
            <div class="reader-sidebar">
                <div class="search-box">
                    <input 
                        type="text" 
                        v-model="searchQuery" 
                        placeholder="Tìm kiếm tài liệu..." 
                        class="search-input"
                    />
                </div>
                <div class="topics-list">
                    <div 
                        v-for="manual in filteredManuals" 
                        :key="manual.id"
                        @click="selectManual(manual)"
                        class="topic-item"
                        :class="{ 'topic-item--active': activeManual && activeManual.id === manual.id }"
                    >
                        <span class="topic-dot"></span>
                        <span class="topic-title">{{ manual.title }}</span>
                    </div>
                    
                    <div v-if="filteredManuals.length === 0" class="no-topics">
                        Không tìm thấy hướng dẫn nào.
                    </div>
                </div>
            </div>

            <!-- Content Reading Area -->
            <div class="reader-content">
                <transition name="fade-slide" mode="out-in">
                    <div :key="activeManual ? activeManual.id : 'empty'" class="content-wrapper">
                        <div v-if="activeManual" class="doc-pane">
                            <h2 class="doc-title">{{ activeManual.title }}</h2>
                            <div class="doc-meta">
                                <span>🔄 Cập nhật: {{ activeManual.updated_at }}</span>
                            </div>
                            
                            <div class="doc-divider"></div>
                            
                            <div 
                                class="doc-body html-content" 
                                v-html="activeManual.content"
                            ></div>
                        </div>
                        <div v-else class="empty-state">
                            <div class="empty-icon">📖</div>
                            <h3>Chào mừng bạn đến với Hướng dẫn sử dụng</h3>
                            <p>Chọn một chủ đề ở danh mục bên trái để bắt đầu đọc hướng dẫn quản trị các tính năng trên website.</p>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['schema', 'manuals'],
    data() {
        return {
            searchQuery: '',
            activeManual: null,
            localManuals: [
                {
                    id: "products-builder",
                    title: "🚘 Quản lý Xe & Trình dựng trang (Page Builder)",
                    updated_at: "11/06/2026",
                    content: `
                        <h2>1. Quản lý Sản phẩm xe</h2>
                        <p>Module <strong>Sản phẩm xe</strong> cho phép bạn thêm mới, sửa đổi thông tin các dòng xe Ford (Everest, Ranger, Territory, Mustang...).</p>
                        
                        <h2>2. Trình dựng trang (Page Builder)</h2>
                        <p>Trình dựng trang cho phép bạn tự do thiết kế bố cục trang chi tiết của từng dòng xe bằng cách thêm/bớt và sắp xếp các khối (blocks) nội dung:</p>
                        <ul>
                            <li><strong>HeroBanner</strong>: Khối banner lớn ở đầu trang kèm tiêu đề, nút lái thử/báo giá và hình nền xe.</li>
                            <li><strong>SpecsGrid (Thông số nổi bật)</strong>: Hiển thị danh sách các thông số động cơ, hộp số dạng lưới.</li>
                            <li><strong>FeaturesList (Tính năng)</strong>: Hiển thị các tính năng chi tiết của xe.</li>
                            <li><strong>VersionsGrid (Danh sách phiên bản & Giá)</strong>: Hiển thị bảng giá các phiên bản của xe.</li>
                            <li><strong>BookingBanner (Đăng ký nhanh)</strong>: Banner kêu gọi hành động kèm Hotline và nút đặt lịch.</li>
                        </ul>

                        <h2>3. Thay đổi vị trí & Căn lề blocks</h2>
                        <ul>
                            <li><strong>Di chuyển khối</strong>: Bạn có thể thay đổi thứ tự hiển thị của bất kỳ block nào bằng cách nhấn nút mũi tên lên <code>▲</code> hoặc xuống <code>▼</code>, hoặc chọn trực tiếp vị trí mong muốn từ dropdown <em>"Khối số X"</em>.</li>
                            <li><strong>Căn lề (Alignment)</strong>: Trong panel <em>Kiểu dáng & Bố cục</em> của mỗi block, bạn có thể chọn căn lề <strong>Trái (Left)</strong>, <strong>Giữa (Center)</strong>, hoặc <strong>Phải (Right)</strong>. Văn bản, hình ảnh và các nút hành động trên trang khách hàng sẽ tự động được căn lề tương ứng.</li>
                        </ul>
                    `
                },
                {
                    id: "media-360",
                    title: "🔄 Tải ảnh 360 độ ngoại thất & nội thất",
                    updated_at: "11/06/2026",
                    content: `
                        <h2>1. Ảnh 360 độ Ngoại thất (External 360)</h2>
                        <p>Hệ thống hỗ trợ xoay xe 360 độ mượt mà dựa trên một chuỗi ảnh liên tục chụp xe từ các góc quay khác nhau (thường là 28 ảnh).</p>
                        <p><strong>Quy tắc đặt tên file cực kỳ quan trọng:</strong></p>
                        <ul>
                            <li>Các tệp ảnh phải được đặt tên theo số thứ tự tăng dần để xoay xe đúng chiều (ví dụ: <code>01.jpg</code>, <code>02.jpg</code>, ..., <code>10.jpg</code>, ..., <code>28.jpg</code>).</li>
                            <li><strong>Sắp xếp tự nhiên (Natural Sorting):</strong> Hệ thống tự động sắp xếp tên file một cách thông minh (nhận diện <code>2.jpg</code> nhỏ hơn <code>10.jpg</code>) khi bạn lưu xe, tránh hiện tượng xe bị giật/đổi hướng đột ngột khi xoay.</li>
                        </ul>

                        <h2>2. Ảnh 360 độ Nội thất (Internal 360 - Panorama)</h2>
                        <p>Để hiển thị khoang lái 360 độ, bạn cần tải lên một ảnh toàn cảnh <strong>Panorama 3D</strong> (ảnh dạng phẳng bao quát toàn bộ nội thất).</p>
                        <ul>
                            <li>Tải ảnh lên phần cấu hình nội thất 360° của xe.</li>
                            <li>Hệ thống sử dụng thư viện Three.js để dựng mô hình không gian 3D, cho phép người dùng kéo thả chuột để khám phá xung quanh bên trong xe.</li>
                        </ul>
                    `
                },
                {
                    id: "file-manager",
                    title: "📁 Quản lý Tệp (File Manager) & Tải thư mục",
                    updated_at: "11/06/2026",
                    content: `
                        <h2>1. Kéo thả cả Thư mục (Drag & Drop Folder Upload)</h2>
                        <p>Bạn không cần phải tải lên từng file đơn lẻ rồi tự tay tạo từng thư mục. CMS hỗ trợ tải lên toàn bộ cây thư mục từ máy tính của bạn:</p>
                        <ul>
                            <li>Kéo thư mục từ máy tính của bạn và thả trực tiếp vào giao diện File Manager.</li>
                            <li>Hệ thống sẽ tự động duyệt đệ quy qua các thư mục con và tải các tệp tin lên đúng vị trí trên server mà không làm thay đổi cấu trúc của bạn.</li>
                        </ul>

                        <h2>2. Nút Chọn Thư mục (Select Folder)</h2>
                        <p>Bên cạnh nút "Chọn file", bạn có thể click nút <strong>"Chọn thư mục"</strong> trên thanh công cụ để chọn tải lên cả folder qua hộp thoại hệ điều hành.</p>

                        <h2>3. Cây thư mục thông minh</h2>
                        <p>Cây thư mục bên trái của File Manager tự động nhóm các thư mục lồng nhau một cách tối ưu. Tên các thư mục dạng số (ví dụ: thư mục ảnh <code>360</code>) sẽ được bảo toàn chính xác, không bị nhân bản hoặc đổi tên lỗi.</p>
                    `
                },
                {
                    id: "accessories-schedules",
                    title: "🔧 Phụ kiện & Lịch bảo dưỡng",
                    updated_at: "11/06/2026",
                    content: `
                        <h2>1. Quản lý Phụ kiện</h2>
                        <p>Cho phép thêm các mặt hàng phụ tùng, phụ kiện chính hãng kèm giá bán và hình ảnh thực tế. Bạn có thể gán phụ kiện vào các danh mục tương ứng.</p>

                        <h2>2. Dự toán chi phí lăn bánh</h2>
                        <p>Công cụ ước tính chi phí lăn bánh tự động tính toán các loại phí bắt buộc:</p>
                        <ul>
                            <li>Thuế trước bạ (10% cho xe du lịch, 6% cho xe bán tải).</li>
                            <li>Phí biển số (Hà Nội & TP. HCM là 20.000.000đ, các tỉnh khác là 1.000.000đ).</li>
                            <li>Phí đăng kiểm (340.000đ), phí bảo trì đường bộ (1.560.000đ), bảo hiểm dân sự bắt buộc.</li>
                        </ul>

                        <h2>3. Lịch bảo dưỡng định kỳ</h2>
                        <p>Quản lý các mốc Km bảo dưỡng định kỳ (1.000 km, 5.000 km, 10.000 km...) và liệt kê chi tiết các hạng mục cần thay thế/kiểm tra để khách hàng tiện tra cứu trên website.</p>
                    `
                },
                {
                    id: "ai-chat-crm",
                    title: "🤖 Quản lý Trợ lý AI Chatbot & Lead CRM",
                    updated_at: "11/06/2026",
                    content: `
                        <h2>1. Trợ lý AI học tự động từ Database</h2>
                        <p>Trợ lý AI trên website được kết nối trực tiếp với cơ sở dữ liệu của CMS:</p>
                        <ul>
                            <li>Khi bạn thay đổi giá xe, thêm phiên bản mới, hoặc sửa mô tả dịch vụ, AI sẽ tự động cập nhật thông tin này vào cuộc hội thoại với khách hàng ngay lập tức.</li>
                            <li>Hệ thống được bọc an toàn: Nếu database trống, AI sẽ tự động chuyển sang dữ liệu mặc định để tránh gián đoạn tư vấn.</li>
                        </ul>

                        <h2>2. Nhận diện và Phân loại Khách hàng tiềm năng (Lead Scoring)</h2>
                        <p>AI tự động phân loại mức độ quan tâm của khách hàng dựa trên nội dung trò chuyện:</p>
                        <ul>
                            <li><span class="badge badge-hot">HOT</span>: Khách hàng cung cấp Họ tên, Số điện thoại và bày tỏ nhu cầu mua xe, lái thử hoặc trả góp rõ ràng.</li>
                            <li><span class="badge badge-warm">WARM</span>: Khách hàng hỏi chi tiết về giá lăn bánh, so sánh các phiên bản nhiều lần nhưng chưa để lại thông tin liên lạc.</li>
                            <li><span class="badge badge-cold">COLD</span>: Khách hàng chỉ hỏi han chung chung.</li>
                        </ul>

                        <h2>3. Cảnh báo qua Telegram</h2>
                        <p>Khi phát hiện khách hàng <span class="badge badge-hot">HOT</span> để lại Họ tên & Số điện thoại, hệ thống sẽ lập tức gửi tin nhắn cảnh báo tới nhóm Telegram của đội ngũ Sales để liên hệ hỗ trợ kịp thời.</p>
                    `
                }
            ]
        }
    },
    computed: {
        filteredManuals() {
            if (!this.localManuals) return [];
            if (!this.searchQuery) return this.localManuals;
            const query = this.searchQuery.toLowerCase();
            return this.localManuals.filter(m => 
                m.title.toLowerCase().includes(query) || 
                (m.content && m.content.toLowerCase().includes(query))
            );
        }
    },
    created() {
        if (this.localManuals && this.localManuals.length > 0) {
            this.activeManual = this.localManuals[0];
        }
    },
    methods: {
        selectManual(manual) {
            this.activeManual = manual;
        }
    }
}
</script>

<style scoped>
.manual-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1f2937;
}

.manual-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
}

.manual-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
}

.reader-view {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 1.5rem;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 20px rgba(0,0,0,0.03);
    border: 1px solid #f3f4f6;
    overflow: hidden;
}

@media (max-width: 768px) {
    .reader-view {
        grid-template-columns: 1fr;
    }
}

.reader-sidebar {
    background-color: #fafafa;
    border-right: 1px solid #f3f4f6;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    height: 70vh;
    min-height: 550px;
}

.search-box {
    margin-bottom: 1.25rem;
}

.search-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border-radius: 6px;
    border: 1px solid #d1d5db;
    font-size: 0.875rem;
    background-color: white;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.search-input:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.topics-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.topic-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.75rem 0.875rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
}

.topic-item:hover {
    background-color: #f3f4f6;
}

.topic-item--active {
    background-color: #eef2ff !important;
    color: #4f46e5;
    font-weight: 600;
}

.topic-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #9ca3af;
    transition: background-color 0.2s ease;
}

.topic-item--active .topic-dot {
    background-color: #4f46e5;
}

.topic-title {
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.no-topics {
    padding: 1rem;
    text-align: center;
    color: #9ca3af;
    font-size: 0.875rem;
}

.reader-content {
    padding: 2rem;
    height: 70vh;
    min-height: 550px;
    overflow-y: auto;
    background-color: white;
}

.content-wrapper {
    max-width: 850px;
    margin: 0 auto;
}

.doc-pane {
    animation: fadeIn 0.3s ease;
}

.doc-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #111827;
    margin-bottom: 0.5rem;
}

.doc-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 1.25rem;
}

.doc-divider {
    height: 1px;
    background-color: #e5e7eb;
    margin-bottom: 1.5rem;
}

.html-content {
    line-height: 1.7;
    font-size: 0.9375rem;
    color: #374151;
}

.html-content :deep(p) {
    margin-bottom: 1.25rem;
}

.html-content :deep(h2) {
    font-size: 1.375rem;
    font-weight: 700;
    color: #111827;
    margin-top: 2rem;
    margin-bottom: 0.875rem;
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 0.375rem;
}

.html-content :deep(h3) {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-top: 1.5rem;
    margin-bottom: 0.625rem;
}

.html-content :deep(ul), .html-content :deep(ol) {
    margin-bottom: 1.25rem;
    padding-left: 1.5rem;
}

.html-content :deep(ul) {
    list-style-type: disc;
}

.html-content :deep(ol) {
    list-style-type: decimal;
}

.html-content :deep(li) {
    margin-bottom: 0.5rem;
}

.html-content :deep(strong) {
    font-weight: 600;
    color: #111827;
}

.html-content :deep(code) {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 4px;
    font-size: 0.875rem;
    font-family: monospace;
}

.badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: 0.25rem;
}

.badge-hot {
    background-color: #fee2e2;
    color: #ef4444;
}

.badge-warm {
    background-color: #fef3c7;
    color: #d97706;
}

.badge-cold {
    background-color: #f3f4f6;
    color: #6b7280;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 2rem;
    height: 100%;
    color: #4b5563;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.empty-state h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
}

.empty-state p {
    font-size: 0.875rem;
    color: #6b7280;
    max-width: 400px;
    margin-bottom: 1.5rem;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.2s ease;
}

.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
