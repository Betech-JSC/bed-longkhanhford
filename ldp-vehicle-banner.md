# Kế Hoạch Tối Ưu Banner Trang Chi Tiết Xe LDP (ldp-vehicle-banner)

## 1. Mục Tiêu (Goal)
Khắc phục hiện tượng banner trên trang chi tiết xe của Landing Page Cố vấn bán hàng (`/ldp/[salesSlug]/[vehicleSlug]`) tự động trượt qua lại các banner quảng cáo của những dòng xe khác (Ranger, Territory, Mustang Mach-E,...). Đảm bảo hero banner trên trang chi tiết xe **chỉ hiển thị đúng hình ảnh và thông tin của dòng xe đó**, cố định, chuyên nghiệp và đúng ngữ cảnh khách hàng đang xem.

---

## 2. Nguyên Nhân Kỹ Thuật (Root Cause)
1. **LdpDetailClient map HeroBanner thành LdpHeroBanner:**
   - Trong `fe/src/components/vehicle/LdpDetailClient.tsx` (dòng 70), block `HeroBanner` được chuyển thành `LdpHeroBanner`.
2. **Không truyền dữ liệu `vehicle` vào component Banner:**
   - Trong `fe/src/components/blocks/Blocks.tsx` (dòng 175-186), case `LdpHeroBanner` gọi `<LdpHeroBannerBlock />` nhưng **không truyền prop `vehicle={vehicle}`**.
3. **LdpHeroBannerBlock tự fetch toàn bộ banner đại lý:**
   - Trong `fe/src/components/blocks/LdpHeroBannerBlock.tsx`, component tự gọi `bannersAPI.getAll()` tải tất cả banner marketing của đại lý (chứa hình các dòng xe khác nhau) và bật `setInterval` 6s tự động chuyển slide.
   - Khiến khách hàng đang xem chi tiết xe Ford Everest lại thấy banner trượt sang Ford Ranger hay Mach-E, gây nhầm lẫn và giảm tỷ lệ chuyển đổi.

---

## 3. Giải Pháp Đề Xuất (Proposed Solution)

### Phương Án Khuyên Dùng: Chế độ Xe Chuyên Biệt (Vehicle-Specific Mode) cho Banner LDP
- **Bước 1: Truyền dữ liệu xe vào Banner:**
  - Cập nhật `fe/src/components/blocks/Blocks.tsx`: Truyền `vehicle={vehicle}` vào `LdpHeroBannerBlock`.
- **Bước 2: Cập nhật LdpHeroBannerBlock nhận biết ngữ cảnh chi tiết xe:**
  - Bổ sung prop `vehicle?: any` vào `LdpHeroBannerBlockProps`.
  - **Khi có `vehicle` (trang chi tiết xe LDP):**
    - **Không gọi `bannersAPI.getAll()`** lấy banner toàn hệ thống.
    - Khởi tạo duy nhất 1 slide chuẩn dành riêng cho xe đang xem:
      * **Ảnh nền (Desktop & Mobile):** Lấy `vehicle.image_url || vehicle.images?.[0] || vehicle.image`.
      * **Tiêu đề lớn:** `vehicle.name || vehicle.title` (Ví dụ: `FORD EVEREST THẾ HỆ MỚI`).
      * **Mô tả/Tagline:** `vehicle.tagline` hoặc giới thiệu phân khúc `${vehicle.typeName} chuẩn Ford Việt Nam`.
      * **Badge Cố vấn:** Giữ nguyên huy hiệu uy tín `"Trang giới thiệu chính thức: Chuyên viên kinh doanh ${salesConsultant.name}"`.
      * **Hành động CTA kép:**
        - Nút chính: **"Đăng ký lái thử"** → Kích hoạt `openDriveModal()` cho đúng dòng xe hiện tại.
        - Nút phụ: **"Nhận báo giá lăn bánh"** → Kích hoạt `openQuoteDrawer(vehicle?.id)`.
    - **Tắt hoàn toàn auto-slide và ẩn thanh điều hướng chấm tròn (dots) / mũi tên khi chỉ có 1 slide của xe.**
  - **Khi không có `vehicle`:** Giữ nguyên hoạt động slide mặc định cho các trang landing page chung.

---

## 4. Danh Sách Nhiệm Vụ (Tasks)

- [x] **Task 1: Cập nhật Blocks.tsx**
  - File: `fe/src/components/blocks/Blocks.tsx`
  - Hành động: Bổ sung prop `vehicle={vehicle}` vào thẻ `<LdpHeroBannerBlock />`.
  - Verify: TypeScript không báo lỗi thiếu prop hoặc type mismatch.

- [x] **Task 2: Nâng cấp LdpHeroBannerBlock.tsx hỗ trợ Vehicle-Specific Mode**
  - File: `fe/src/components/blocks/LdpHeroBannerBlock.tsx`
  - Hành động:
    - Bổ sung `vehicle?: any` vào `LdpHeroBannerBlockProps`.
    - Bỏ qua API `bannersAPI.getAll()` khi `vehicle` tồn tại.
    - Thiết lập slide tĩnh hiển thị hình ảnh và thông tin của xe (`image_url`, `name`, `tagline`).
    - Bổ sung nút CTA "Nhận báo giá lăn bánh" bên cạnh "Đăng ký lái thử".
  - Verify: Mở `http://localhost:3000/ldp/bao-ngan/everest`, banner hiển thị đúng ảnh Everest, không tự trượt sang xe khác.

- [x] **Task 3: Kiểm thử hiển thị trên nhiều dòng xe LDP**
  - File: Trình duyệt / Next.js
  - Hành động:
    - Kiểm tra `/ldp/bao-ngan/everest` → hiển thị banner Everest.
    - Kiểm tra `/ldp/bao-ngan/ranger` → hiển thị banner Ranger.
    - Kiểm tra trang chủ LDP `/ldp/bao-ngan` → banner slider chung của Cố vấn và đại lý vẫn hoạt động trơn tru.
  - Verify: Không bị bể layout, ảnh load rõ nét, CTA bấm mở form chuẩn xác.

- [ ] **Task 4: Build test & Git Commit (Chưa push theo yêu cầu user)**
  - Hành động:
    - Chạy `yarn tsc --noEmit` trên `fe/` để xác nhận không lỗi compile (Đã PASS).
    - Commit local vào branch `feature/ldp-vehicle-banner`, giữ nguyên chưa push lên origin.

---

## 5. Tiêu Chí Hoàn Thành (Done When)
- [ ] Trang chi tiết xe của mọi LDP chỉ hiển thị hình ảnh xe tương ứng trên banner đầu trang.
- [ ] Hoàn toàn không còn hiện tượng slide trượt qua hình ảnh các dòng xe khác.
- [ ] Đầy đủ thông tin định danh Cố vấn bán hàng và 2 nút CTA (Đăng ký lái thử + Nhận báo giá lăn bánh) tương tác mượt mà.
- [ ] Trang chủ LDP (`/ldp/[salesSlug]`) vẫn giữ nguyên slider giới thiệu tổng thể không bị ảnh hưởng.

