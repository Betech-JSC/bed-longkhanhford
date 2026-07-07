# Requirements Document

## Introduction

Hệ thống Data Filling Plan cho dự án Ford Đồng Nai cung cấp một kế hoạch có cấu trúc để điền dữ liệu demo vào tất cả các trang web của frontend (Next.js) thông qua Laravel backend APIs. Kế hoạch này đảm bảo dữ liệu được điền theo đúng thứ tự phụ thuộc (dependencies), phù hợp với ngữ cảnh website bán xe Ford, và đáp ứng nhu cầu hiển thị đầy đủ cho tất cả các pages.

## Glossary

- **Data_Filling_System**: Hệ thống công cụ và quy trình để điền dữ liệu demo vào database
- **Data_Generator**: Module sinh dữ liệu demo với ngữ cảnh phù hợp cho Ford Đồng Nai
- **Dependency_Resolver**: Module xác định thứ tự fill data dựa trên foreign key dependencies
- **Page_Data_Mapper**: Module ánh xạ giữa pages frontend và các API/database entities cần thiết
- **Seeder_Manager**: Laravel seeder quản lý việc thực thi fill data theo thứ tự
- **Validation_Reporter**: Module báo cáo và validate dữ liệu đã được fill đầy đủ
- **Frontend_Page**: Các trang web Next.js cần hiển thị dữ liệu
- **Backend_Entity**: Các bảng database và API endpoints của Laravel
- **Demo_Content**: Dữ liệu mẫu phù hợp với ngữ cảnh Ford Đồng Nai (xe, tin tức, dịch vụ)

## Requirements

### Requirement 1: Page Data Dependency Analysis

**User Story:** Là một developer, tôi muốn phân tích dependencies giữa các pages và data entities, để biết được thứ tự fill data hợp lý.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL phân tích tất cả Frontend_Pages và liệt kê Backend_Entities cần thiết cho mỗi page
2. THE Dependency_Resolver SHALL xác định foreign key relationships giữa các bảng database
3. THE Dependency_Resolver SHALL tạo dependency graph hiển thị thứ tự fill data từ parent entities đến child entities
4. THE Page_Data_Mapper SHALL tạo mapping document liệt kê từng page với danh sách API endpoints và database tables tương ứng
5. WHEN có circular dependency được phát hiện, THE Dependency_Resolver SHALL báo cáo warning và đề xuất giải pháp

### Requirement 2: Home Page Data Requirements

**User Story:** Là một content manager, tôi muốn điền đầy đủ dữ liệu cho trang chủ, để khách hàng thấy được các sản phẩm nổi bật và thông tin chính.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền ít nhất 3 featured vehicles với thông tin đầy đủ (hình ảnh, giá, mô tả)
2. THE Data_Filling_System SHALL điền 5-8 banners cho slider chính với hình ảnh chất lượng cao
3. THE Data_Filling_System SHALL điền 4-6 customer reviews với tên, avatar, và nội dung đánh giá
4. THE Data_Filling_System SHALL điền 8-12 partner logos
5. THE Data_Filling_System SHALL điền 4-6 sales consultants với thông tin liên hệ và ảnh đại diện
6. THE Data_Filling_System SHALL điền 3-5 awards/achievements của đại lý
7. THE Data_Filling_System SHALL điền 3-4 bài posts nổi bật cho phần tin tức trên trang chủ

### Requirement 3: About Page Data Requirements

**User Story:** Là một content manager, tôi muốn điền dữ liệu lịch sử và thành tựu, để khách hàng hiểu về lịch sử phát triển của Ford Đồng Nai.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền 5-8 history milestones theo timeline với năm, tiêu đề, mô tả và hình ảnh
2. THE Data_Filling_System SHALL điền danh sách agencies với địa chỉ đầy đủ, bản đồ, giờ làm việc
3. THE Data_Filling_System SHALL điền thông tin về đội ngũ sales consultants chi tiết hơn cho about page
4. WHEN điền history data, THE Data_Filling_System SHALL sắp xếp theo thứ tự thời gian tăng dần

### Requirement 4: Products/Vehicles Page Data Requirements

**User Story:** Là một content manager, tôi muốn điền đầy đủ thông tin xe, để khách hàng có thể xem và so sánh các dòng xe.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền ít nhất 3 vehicle categories (SUV, Pickup, Commercial)
2. THE Data_Filling_System SHALL điền ít nhất 8-12 vehicles với đầy đủ thông tin cho mỗi category
3. WHEN điền vehicle data, THE Data_Filling_System SHALL bao gồm base_price, images, colors, description, tagline
4. THE Data_Filling_System SHALL điền vehicle versions cho mỗi vehicle với các phiên bản khác nhau
5. THE Data_Filling_System SHALL điền registration fees data liên quan đến từng vehicle
6. THE Data_Filling_System SHALL điền 360 degree images (external và internal panorama URLs) cho các xe nổi bật
7. THE Data_Filling_System SHALL đánh dấu is_best_seller cho 3-4 xe bán chạy nhất

### Requirement 5: Accessories/Products Page Data Requirements

**User Story:** Là một content manager, tôi muốn điền dữ liệu phụ tùng và phụ kiện, để khách hàng có thể mua sắm phụ kiện cho xe.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền ít nhất 4-6 product categories cho accessories
2. THE Data_Filling_System SHALL điền 20-30 products với thông tin đầy đủ (tên, giá, hình ảnh, mô tả, SKU)
3. THE Data_Filling_System SHALL điền brand information cho các products
4. THE Data_Filling_System SHALL liên kết products với categories thông qua product_ref_categories
5. THE Data_Filling_System SHALL điền related products cho mỗi product để gợi ý sản phẩm tương tự
6. THE Data_Filling_System SHALL điền inventory data với quantity và stock status cho mỗi product
7. WHEN điền product data, THE Data_Filling_System SHALL bao gồm SEO metadata (meta_title, meta_description)

### Requirement 6: News/Posts Page Data Requirements

**User Story:** Là một content manager, tôi muốn điền bài viết tin tức và blog, để khách hàng cập nhật thông tin mới nhất về Ford.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền ít nhất 4-5 post categories (Tin tức, Sự kiện, Khuyến mãi, Hướng dẫn)
2. THE Data_Filling_System SHALL điền 15-25 posts với nội dung đầy đủ, hình ảnh featured và published_at dates
3. THE Data_Filling_System SHALL điền tags cho các posts để phân loại nội dung
4. THE Data_Filling_System SHALL liên kết posts với categories thông qua post_ref_categories
5. THE Data_Filling_System SHALL điền related posts cho mỗi post để gợi ý bài viết liên quan
6. THE Data_Filling_System SHALL điền post_ref_tags để gắn tags cho các bài viết
7. WHEN điền post data, THE Data_Filling_System SHALL sắp xếp published_at với khoảng thời gian realistic (trong vòng 6 tháng gần đây)

### Requirement 7: Media Page Data Requirements

**User Story:** Là một content manager, tôi muốn điền dữ liệu media (hình ảnh, video), để khách hàng xem thư viện hình ảnh về xe và sự kiện.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền vehicle gallery images cho mỗi vehicle (6-12 ảnh mỗi xe)
2. THE Data_Filling_System SHALL điền dealer activity images và posts với media content
3. THE Data_Filling_System SHALL tổ chức images theo categories hoặc albums
4. THE Data_Filling_System SHALL điền metadata cho images (title, caption, alt text)

### Requirement 8: Services Page Data Requirements

**User Story:** Là một content manager, tôi muốn điền thông tin dịch vụ, để khách hàng biết các dịch vụ Ford Đồng Nai cung cấp.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền 4-6 services (Customer Care, Express Maintenance, Periodic Maintenance, Pickup Delivery)
2. WHEN điền service data, THE Data_Filling_System SHALL bao gồm image, benefit_image, sliders, và description
3. THE Data_Filling_System SHALL điền service_translations cho đa ngôn ngữ (vi, en)
4. THE Data_Filling_System SHALL điền email liên hệ cho mỗi service

### Requirement 9: Contact Page Data Requirements

**User Story:** Là một content manager, tôi muốn điền thông tin liên hệ và chi nhánh, để khách hàng có thể liên hệ hoặc đến showroom.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền danh sách agencies với địa chỉ, số điện thoại, email, bản đồ coordinates
2. THE Data_Filling_System SHALL điền agency_translations cho đa ngôn ngữ
3. THE Data_Filling_System SHALL điền settings với thông tin contact chung (hotline, email, địa chỉ trụ sở chính)
4. THE Data_Filling_System SHALL điền sliders cho contact page nếu có

### Requirement 10: Jobs/Careers Page Data Requirements

**User Story:** Là một content manager, tôi muốn điền thông tin tuyển dụng, để ứng viên có thể xem và ứng tuyển vào các vị trí.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền 5-10 job postings với thông tin đầy đủ (title, description, requirements, benefits)
2. THE Data_Filling_System SHALL điền job_translations cho đa ngôn ngữ
3. THE Data_Filling_System SHALL điền related_jobs để gợi ý các vị trí tương tự
4. WHEN điền job data, THE Data_Filling_System SHALL bao gồm location, salary range (nếu có), và application deadline

### Requirement 11: Dependency-Ordered Seeder Execution

**User Story:** Là một developer, tôi muốn chạy seeders theo đúng thứ tự dependencies, để tránh lỗi foreign key constraint.

#### Acceptance Criteria

1. THE Seeder_Manager SHALL xác định execution order dựa trên foreign key dependencies
2. THE Seeder_Manager SHALL chạy parent entity seeders trước child entity seeders
3. WHEN một seeder thất bại, THE Seeder_Manager SHALL báo cáo lỗi chi tiết và dừng execution
4. THE Seeder_Manager SHALL hỗ trợ rollback toàn bộ data nếu có lỗi
5. THE Seeder_Manager SHALL log progress và số lượng records được tạo cho mỗi entity

**Dependency Order:**
1. Settings, Translations, Regions
2. Admins, Users, Roles/Permissions
3. Vehicle_Categories → Vehicles → Vehicle_Versions, Registration_Fees
4. Product_Categories, Brands → Products → Product_Ref_Categories, Related_Products, Inventories
5. Post_Categories, Tags → Posts → Post_Ref_Categories, Post_Ref_Tags, Related_Posts
6. Services → Service_Translations
7. Histories → History_Translations
8. Agencies → Agency_Translations
9. Jobs → Job_Translations, Related_Jobs
10. Sliders → Slider_Translations
11. Banners, Customer_Reviews, Sales_Consultants, Partners, Awards
12. Contacts, Orders, Order_Lines
13. Policies → Policy_Translations
14. Meta_Pages

### Requirement 12: Contextual Data Generation

**User Story:** Là một content manager, tôi muốn dữ liệu demo phù hợp với ngữ cảnh Ford Đồng Nai, để website trông chân thực và professional.

#### Acceptance Criteria

1. THE Data_Generator SHALL sử dụng tên xe Ford thực tế (Ranger, Everest, Explorer, Territory, Transit, Tourneo)
2. THE Data_Generator SHALL sử dụng địa chỉ và thông tin realistic cho Đồng Nai region
3. THE Data_Generator SHALL sinh giá xe trong range realistic cho thị trường Việt Nam
4. THE Data_Generator SHALL sử dụng tên người Việt Nam cho customers, reviews, consultants
5. THE Data_Generator SHALL sinh nội dung bài viết liên quan đến xe Ford, automotive industry, và local events
6. THE Data_Generator SHALL sử dụng số điện thoại format Việt Nam (84+, 10 digits)
7. WHEN sinh product descriptions, THE Data_Generator SHALL sử dụng automotive terminology phù hợp

### Requirement 13: Multi-language Support

**User Story:** Là một content manager, tôi muốn dữ liệu hỗ trợ đa ngôn ngữ, để website có thể phục vụ cả khách hàng Việt và quốc tế.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền translations cho cả 'vi' và 'en' locales
2. WHEN điền translation data, THE Data_Filling_System SHALL đảm bảo cả hai ngôn ngữ có nội dung đầy đủ
3. THE Data_Filling_System SHALL điền unique slugs cho mỗi locale trong translation tables
4. THE Data_Filling_System SHALL validate không có missing translations cho required fields

### Requirement 14: Image and Media Asset Management

**User Story:** Là một developer, tôi muốn quản lý assets một cách có tổ chức, để dễ dàng reference và maintain.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL tổ chức images theo structure: /storage/vehicles/, /storage/products/, /storage/posts/
2. THE Data_Filling_System SHALL lưu trữ JSON image arrays với paths relative đến storage root
3. THE Data_Filling_System SHALL tạo symbolic link storage:link nếu chưa tồn tại
4. WHEN điền image data, THE Data_Filling_System SHALL validate image files tồn tại trong storage
5. THE Data_Filling_System SHALL hỗ trợ placeholder images nếu actual images không available

### Requirement 15: Seeder Command Interface

**User Story:** Là một developer, tôi muốn có command dễ sử dụng để chạy data filling, để có thể nhanh chóng reset và refill data.

#### Acceptance Criteria

1. THE Seeder_Manager SHALL cung cấp command 'php artisan db:seed --class=DataFillingSeeder'
2. THE Seeder_Manager SHALL hỗ trợ flags: --fresh (migrate:fresh trước khi seed), --specific={entity} (seed chỉ một entity)
3. THE Seeder_Manager SHALL hiển thị progress bar khi đang seed
4. WHEN seeding hoàn thành, THE Seeder_Manager SHALL in ra summary report với số lượng records created cho mỗi table
5. THE Seeder_Manager SHALL hỗ trợ flag --validation để chỉ check data integrity mà không thực sự seed

### Requirement 16: Data Validation and Integrity Check

**User Story:** Là một developer, tôi muốn validate dữ liệu sau khi fill, để đảm bảo data integrity và completeness.

#### Acceptance Criteria

1. THE Validation_Reporter SHALL kiểm tra tất cả required foreign keys có valid references
2. THE Validation_Reporter SHALL kiểm tra không có orphaned records (records có foreign key null khi nó là required)
3. THE Validation_Reporter SHALL kiểm tra mỗi Frontend_Page có đủ minimum data để hiển thị
4. THE Validation_Reporter SHALL kiểm tra translations có đầy đủ cho cả vi và en locales
5. WHEN validation thất bại, THE Validation_Reporter SHALL in ra chi tiết errors với table name và record IDs
6. THE Validation_Reporter SHALL tạo validation report dạng JSON và markdown

### Requirement 17: Sample Order and Shopping Data

**User Story:** Là một developer, tôi muốn có sample orders và shopping cart data, để test các tính năng e-commerce.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền 10-15 sample orders với các trạng thái khác nhau (pending, completed, cancelled)
2. THE Data_Filling_System SHALL điền order_lines liên kết với products
3. THE Data_Filling_System SHALL điền customer information cho orders
4. THE Data_Filling_System SHALL điền realistic order dates trong 3 tháng gần đây
5. THE Data_Filling_System SHALL điền payment và shipping information cho orders

### Requirement 18: SEO and Meta Data

**User Story:** Là một content manager, tôi muốn điền SEO metadata, để các pages được index tốt trên search engines.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền meta_pages cho tất cả Frontend_Pages với meta_title, meta_description, og_image
2. THE Data_Filling_System SHALL điền SEO fields trong vehicles, products, posts (meta_title, meta_description, keywords)
3. WHEN điền SEO data, THE Data_Generator SHALL tạo descriptions realistic và relevant với nội dung
4. THE Data_Filling_System SHALL điền canonical URLs và structured data nếu có

### Requirement 19: Configuration and Settings Data

**User Story:** Là một developer, tôi muốn điền system settings, để website hoạt động với configurations mặc định hợp lý.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL điền settings table với site_name, site_logo, contact info, social media links
2. THE Data_Filling_System SHALL điền policies với terms of service, privacy policy content
3. THE Data_Filling_System SHALL điền regions data nếu hỗ trợ multiple regions
4. THE Data_Filling_System SHALL điền email templates cho notifications nếu có

### Requirement 20: Data Filling Documentation

**User Story:** Là một team member mới, tôi muốn có documentation về data filling process, để hiểu cách sử dụng và customize.

#### Acceptance Criteria

1. THE Data_Filling_System SHALL cung cấp README.md giải thích toàn bộ data filling process
2. THE Documentation SHALL bao gồm dependency diagram cho tất cả entities
3. THE Documentation SHALL liệt kê page-to-entity mapping chi tiết
4. THE Documentation SHALL cung cấp examples về cách customize seeder data
5. THE Documentation SHALL giải thích cách add thêm entities mới vào filling plan
6. THE Documentation SHALL bao gồm troubleshooting guide cho common errors
