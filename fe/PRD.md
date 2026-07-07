# Product Requirement Document (PRD) - Website Ford Đồng Nai (DNF)

## 1. Document Control
*   **Dự án**: Website Ford Đồng Nai (DNF)
*   **Khách hàng**: Công ty TNHH Dịch vụ - Thương mại Tấn Phát Đạt
*   **Đối tác triển khai**: Công ty TNHH Dịch vụ Giải pháp số Betech
*   **Trạng thái**: Bản thảo (Draft)
*   **Phiên bản**: v1.0
*   **Ngày tạo**: 22/05/2026

---

## 2. Project Overview & Goals (Tổng quan & Mục tiêu Dự án)

### 2.1. Bối cảnh
Website hiện tại của Ford Đồng Nai đang sử dụng nền tảng WordPress cũ với nhiều plugin dư thừa, gây ảnh hưởng tiêu cực tới hiệu suất:
*   Tốc độ tải trang chậm, làm tăng tỷ lệ thoát trang (Bounce rate).
*   Chưa hỗ trợ công nghệ xem xe 360 độ (360° View) trực quan, hạn chế trải nghiệm khách hàng.
*   Cấu trúc SEO chưa tối ưu theo các cập nhật thuật toán mới nhất của Google.
*   Thiếu các điểm chạm kêu gọi hành động (CTA) tối ưu chuyển đổi (CRO) và chưa tích hợp hệ thống quản lý leads hiệu quả.

### 2.2. Mục tiêu dự án
1.  **Tái cấu trúc và nâng cấp UI/UX**: Chuyển đổi sang kiến trúc Next.js/React kết hợp Laravel hiện đại, giúp tối ưu hóa tốc độ tải trang cực nhanh (< 1s).
2.  **Tăng cường trải nghiệm tương tác**: Tích hợp module **360° Viewer** cho cả ngoại thất (External) và nội thất (Internal).
3.  **Tối ưu hóa tỷ lệ chuyển đổi (CRO) & SEO**: Tái cấu trúc mã nguồn thân thiện với SEO ngay từ đầu, thiết kế lại hành trình khách hàng để tăng lượng Lead chất lượng.
4.  **Tích hợp Trợ lý AI**: Tư vấn tự động 24/7 và phân loại Lead nóng/lạnh tự động để tối ưu nhân sự trực page.

---

## 3. Scope of Work (Phạm vi Dự án)

### 3.1. Các Trang Frontend Yêu Cầu
Website bao gồm các trang chính và trang con sau:
1.  **Trang chủ (Homepage)**: Hiển thị Banner Hero, Fleet xe nổi bật, Dịch vụ nổi bật, Testimonials, Tin tức, CTA đăng ký lái thử.
2.  **Giới thiệu (Về chúng tôi)**: Lịch sử, tầm nhìn, sứ mệnh của Ford Đồng Nai (Tấn Phát Đạt).
3.  **Danh mục Sản phẩm (Product Catalog)**: Hiển thị các dòng xe Ford (SUV, Pickup, EV...).
4.  **Chi tiết Sản phẩm (Product Details)**:
    *   Thông tin thông số kỹ thuật, hình ảnh, thư viện video.
    *   **Module 360 Viewer**: Cho phép tương tác xoay ngoài xe (External) và xem không gian bên trong (Internal), lựa chọn các biến thể màu sắc/phiên bản.
5.  **Bảng Giá Xe**: Cập nhật giá niêm yết và các chương trình khuyến mãi hiện hành.
6.  **Ước Tính Lăn Bánh**: Công cụ tính giá lăn bánh theo từng tỉnh/thành phố, các loại phí (trước bạ, biển số, đăng kiểm, bảo trì đường bộ...).
7.  **Ước Tính Vay Ngân Hàng**: Công cụ tính lãi suất hàng tháng dựa trên thời gian vay và tỷ lệ vay.
8.  **Đăng Ký Lái Thử**: Form điền thông tin đăng ký mẫu xe, ngày giờ và địa điểm.
9.  **So Sánh Xe**: Giao diện gióng hàng so sánh thông số kỹ thuật giữa 2-3 phiên bản hoặc mẫu xe.
10. **Dịch Vụ**: Giới thiệu các dịch vụ bảo dưỡng, sửa chữa, cứu hộ, và nhận/giao xe tận nơi.
11. **Phụ Kiện**: Danh mục phụ kiện chính hãng kèm báo giá.
12. **Media**: Thư viện hình ảnh và video sự kiện, hoạt động của đại lý.
13. **Tin Tức / Blog**: Tin khuyến mãi, hướng dẫn sử dụng xe, tin tức Ford Việt Nam.
14. **Tuyển dụng**: Thông tin tuyển dụng các vị trí.
15. **Tìm kiếm Sản phẩm**: Trang kết quả tìm kiếm thông minh.
16. **Liên hệ**: Bản đồ, hotline, form gửi lời nhắn.
17. **Chính Sách**: Các chính sách bảo mật thông tin, điều khoản sử dụng.

### 3.2. Hệ thống Quản trị (Admin Dashboard)
Trang Admin xây dựng trên nền Laravel để quản lý toàn bộ nội dung tĩnh và động:
*   **Dashboard hệ thống**: Báo cáo nhanh lượt truy cập, leads mới, trạng thái hoạt động của bot AI.
*   **Quản lý Danh Mục & Sản Phẩm**: Cấu hình mẫu xe, thông số kỹ thuật, biến thể màu sắc, và upload tài nguyên 360 độ.
*   **Quản lý Bảng Giá**: Cập nhật biểu giá lăn bánh, các loại phí theo khu vực địa lý.
*   **Quản lý Bài viết & Tin tức**: Soạn thảo WYSIWYG, quản lý thẻ SEO meta tag.
*   **Quản lý Dịch Vụ & Phụ Kiện**: Danh mục dịch vụ, thông tin phụ kiện đính kèm.
*   **Quản lý Tuyển Dụng & Media**: Upload tin tuyển dụng, album ảnh sự kiện.
*   **Quản lý Liên Hệ**: Danh sách thông tin khách hàng đăng ký lái thử, tính toán lăn bánh, vay ngân hàng.
*   **Quản lý Cài Đặt**: Cấu hình hệ thống (hotline, social links, SEO tags chung, robots.txt).
*   **Quản lý Phân Quyền & Tài Khoản**: Phân vai trò quản trị (Super Admin, Editor, Sales Executive...).
*   **Quản lý File**: Trình quản lý media tập trung (hình ảnh, tài liệu).

---

## 4. Technical Specifications & Architecture (Kiến trúc Kỹ thuật)

### 4.1. Công nghệ (Technology Stack)
*   **Frontend**: Next.js hoặc Inertia.js (React) - Tối ưu hóa Server-Side Rendering (SSR) / Static Site Generation (SSG) để tăng tốc độ tải trang ban đầu và hỗ trợ SEO.
*   **Backend**: Laravel (PHP Framework) - Xây dựng RESTful API cho Admin Dashboard và xử lý các logic nghiệp vụ phức tạp.
*   **Database**: MySQL.
*   **AI Integration**: Tích hợp bot AI tự động hỗ trợ tư vấn 24/7, tự động phân loại Lead nóng/lạnh dựa trên ngữ cảnh hội thoại.

### 4.2. Yêu cầu Hạ tầng (VPS/Hosting)
*   **Hệ điều hành/Môi trường**: Server đặt tại Việt Nam hoặc Singapore để tối ưu latency.
*   **Cấu hình tối thiểu**: SSD NVMe, RAM >= 2GB.

---

## 5. Non-Functional Requirements (Yêu cầu phi chức năng)

### 5.1. Hiệu năng (Performance)
*   Tốc độ phản hồi trang: **Tải trang ban đầu < 1 giây**.
*   **Cam kết chỉ số Google PageSpeed Insights** (tại thời điểm bàn giao):
    *   **Desktop**: Performance $\ge$ 85 | Accessibility $\ge$ 90 | Best Practices $\ge$ 90 | SEO $\ge$ 90.
    *   **Mobile**: Performance: 50–65 | Accessibility $\ge$ 90 | Best Practices $\ge$ 90 | SEO $\ge$ 95.

### 5.2. SEO & GEO Marketing
*   Tái cấu trúc mã nguồn chuẩn SEO onpage từ dòng code đầu tiên.
*   **Redirect 301**: Chuyển hướng toàn bộ link cũ sang link mới trước khi go-live để bảo toàn thứ hạng tìm kiếm.
*   **Giữ nguyên SEO metadata**: Giữ nguyên Title, Meta Description, H1 của các bài viết/trang đang có thứ hạng tốt trên Google.
*   **Thẻ SEO Hình ảnh**: Đảm bảo tất cả hình ảnh có đầy đủ thuộc tính Title, Alt, Caption.
*   **GEO Tag**: Tối ưu hóa SEO địa lý để thu hút tệp khách hàng tại khu vực Đồng Nai và lân cận.
*   **Cài đặt công cụ đo lường**: GA4, Google Search Console, Sitemap XML, robots.txt.

### 5.3. Bảo mật (Security)
*   Phòng chống các lỗ hổng bảo mật phổ biến: XSS, SQL Injection, CSRF.
*   Phân quyền quản trị chặt chẽ trong trang Admin.

### 5.4. Đa Thiết Bị & Trình Duyệt (Cross-Platform)
*   Giao diện responsive tương thích hoàn toàn trên:
    *   **iOS**: iPad Pro, iPad Air, các dòng iPhone.
    *   **Android**: Các dòng Samsung Galaxy Note, S, Galaxy Tab...
    *   **Trình duyệt**: Chrome, Safari, Firefox, Edge.

---

## 6. Milestones & Resource (Tiến độ & Nhân sự)

### 6.1. Đội ngũ triển khai (4 Nhân sự)
1.  **Design UX/UI** (1 người): Thiết kế giao diện PC & Mobile.
2.  **Front-end Developer** (1 người): Lập trình giao diện, module 360 Viewer và tích hợp API.
3.  **Back-end Developer** (1 người): Thiết kế CSDL, viết API, xây dựng Admin Dashboard và tích hợp bot AI.
4.  **Tester** (1 người): Kiểm thử đa thiết bị, bảo mật, và hiệu năng.

### 6.2. Tiến độ triển khai & Thanh toán
*   **Tổng thời gian thực hiện**: 30 ngày làm việc (không tính Thứ Bảy, Chủ Nhật và thời gian chờ phản hồi phê duyệt từ khách hàng).
*   **Tiến độ thanh toán**:
    *   **Đợt 1**: Thanh toán **40%** tổng giá trị hợp đồng (8.000.000 VNĐ) trong vòng 03 ngày kể từ ngày ký hợp đồng.
    *   **Đợt 2**: Thanh toán **60%** còn lại (12.000.000 VNĐ) ngay sau khi nghiệm thu bàn giao dự án.
*   **Bảo hành**: 12 tháng hỗ trợ xử lý lỗi phát sinh từ mã nguồn gốc của đơn vị phát triển. Miễn phí xử lý lỗi SEO kỹ thuật trong 30 ngày đầu tiên sau go-live.
