# Plan: LDP Hero CTA "Khám Phá Ngay" (Tối ưu điều hướng giữ chân trong LDP)

> **Mục tiêu:** Xử lý nút CTA *"Khám phá ngay"* tại Hero Banner của trang LDP (`/ldp/[salesSlug]`, ví dụ: `/ldp/bao-ngan`), ngăn chặn việc bị chuyển hướng ra các trang chính của hệ thống (`/san-pham`, `/ford-territory`...), đảm bảo toàn bộ hành vi click đều nằm trọn trong LDP của Cố vấn bán hàng.

---

## 🔍 Phân tích nguyên nhân hiện trạng

1. **Vị trí code:**
   - Component: `fe/src/components/vehicle/LdpHomeClient.tsx` (dòng 777–807).
2. **Cơ chế hiện tại:**
   - Nút *"Khám phá ngay"* đang lấy đường dẫn từ banner hệ thống: `const link = activeSlide?.buttonLink`.
   - Trong CMS, các banner đại lý thường được cấu hình link mặc định trỏ về trang web chính: `/san-pham`, `/ford-territory`, `/ranger-2026`...
   - Tại dòng 786: `router.push(link);` kích hoạt chuyển hướng URL, đẩy người dùng ra khỏi `/ldp/[salesSlug]` sang trang web tổng của đại lý.

---

## 🎯 Các phương án đề xuất (PA)

```mermaid
flowchart TD
    A["User click 'Khám phá ngay' ở Hero LDP"] --> B{"Kiểm tra link của Banner"}
    B -->|Link chung: /san-pham, /bang-gia, rỗng, #showroom| C["Smooth scroll xuống Showroom LDP (#showroom)"]
    B -->|Link đến dòng xe: /ford-territory, /ranger...| D["Chuyển sang LDP xe: /ldp/[salesSlug]/[vehicleSlug]"]
    B -->|Link tin tức: /tin-tuc/[slug]| E["Chuyển sang LDP tin tức: /ldp/[salesSlug]/tin-tuc/[slug]"]
```

### 📌 PA 1 (Khuyên dùng - Smart LDP Navigation):
* **Hành vi thông minh theo ngữ cảnh banner:**
  1. **Nếu banner có link trỏ đến 1 dòng xe cụ thể** (ví dụ `/ford-territory`, `/ranger-2026`, `/san-pham/ford-everest`...):
     - Tự động map sang trang chi tiết xe đó **nằm trong LDP của Cố vấn**:
       `/ldp/[salesSlug]/[vehicleSlug]` (ví dụ: `/ldp/bao-ngan/ford-territory`).
     - Người dùng vẫn xem đúng xe của banner mà không bị mất hotline, Zalo và form báo giá của Cố vấn.
  2. **Nếu banner là link chung** (ví dụ `/san-pham`, `/bang-gia`, `#showroom` hoặc để trống):
     - **Cuộn mượt (smooth scroll) xuống khối Showroom xe của Cố vấn** (`#showroom` / `#ldp-vehicles-grid`).
     - Đây là hành vi trực quan nhất: khách bấm "Khám phá ngay" thì trang tự động cuộn xuống danh mục xe bên dưới để khách xem.
  3. **Nếu banner là link tin tức / khuyến mãi** (ví dụ `/tin-tuc/[slug]`):
     - Chuyển hướng sang `/ldp/[salesSlug]/tin-tuc/[slug]` (đồng bộ với tính năng chi tiết bài viết LDP).

---

### 📌 PA 2 (Pure Smooth Scroll - Đơn giản nhất):
* Bất kể banner trong CMS gán link gì, nút *"Khám phá ngay"* trên Hero của LDP sẽ luôn đóng vai trò là **Nút cuộn xuống Showroom**:
  - Click vào -> Luôn cuộn mượt xuống khối `#showroom` của trang LDP.
  - Ưu điểm: Đơn giản, khách hàng không bị đổi trang, giữ trọn vẹn luồng lướt xem từ trên xuống dưới của Landing Page.

---

### 📌 PA 3 (Lead Generation CTA - Mở Drawer Báo giá / Tư vấn):
* Nút 1 là *"Đăng ký lái thử"* (mở Drive Drawer).
* Nút 2 *"Khám phá ngay"* chuyển thành CTA nhận báo giá:
  - Click vào -> Mở `openQuoteDrawer()` với xe mặc định của banner.
  - Ưu điểm: Tối đa hóa tỷ lệ lấy số điện thoại / thông tin khách hàng ngay tại First View (Hero).

---

## 📋 Danh sách công việc triển khai chi tiết (Task Breakdown)

### Task 1: Xây dựng hàm Helper `resolveLdpCtaLink` trong `LdpHomeClient.tsx`
- **Mô tả:** Nhận vào `rawLink`, `consultantSlug`, `allVehicles` để phân giải thành hành động nội bộ LDP:
  - Nếu link khớp slug hoặc id của xe trong `allVehicles` -> Trả về URL `/ldp/${consultantSlug}/${vehicleSlug}`.
  - Nếu link là `/san-pham`, `/bang-gia`, rỗng hoặc anchor -> Trả về `#showroom`.
  - Nếu link là `/tin-tuc/${slug}` -> Trả về `/ldp/${consultantSlug}/tin-tuc/${slug}`.
- **Tiêu chí nghiệm thu:** Mọi link đầu vào đều được chuẩn hóa thành link LDP hoặc anchor nội bộ.

### Task 2: Cập nhật sự kiện click của nút "Khám phá ngay" tại Hero Banner
- **Mô tả:** Sửa handler tại dòng 777–807 của `fe/src/components/vehicle/LdpHomeClient.tsx`:
  - Gọi helper `resolveLdpCtaLink`.
  - Nếu kết quả là `#showroom` hoặc anchor: thực hiện cuộn mượt bằng `scrollIntoView({ behavior: "smooth" })`.
  - Nếu kết quả là đường dẫn LDP (`/ldp/...`): điều hướng bằng `router.push(...)`.
- **Tiêu chí nghiệm thu:** Khi bấm nút, khách hàng không bao giờ bị chuyển về các trang ngoài LDP.

### Task 3: Kiểm thử toàn diện các trường hợp (Phase X Verification)
- **Mô tả:**
  1. Kiểm tra Slide 1 (Banner chung): Click "Khám phá ngay" -> Cuộn mượt xuống danh mục xe `#showroom`.
  2. Kiểm tra Slide 2/3 (Banner xe cụ thể): Click "Khám phá ngay" -> Chuyển vào `/ldp/bao-ngan/[dòng-xe]`.
  3. Kiểm tra trên Mobile và Desktop đảm bảo cuộn mượt chuẩn xác, không bị giật layout.
- **Tiêu chí nghiệm thu:** Hoàn toàn nằm trong phạm vi LDP của Cố vấn bán hàng.

