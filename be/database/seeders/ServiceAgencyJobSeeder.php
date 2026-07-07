<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use JamstackVietnam\Agency\Models\Agency;
use JamstackVietnam\Job\Models\Job;

class ServiceAgencyJobSeeder extends Seeder
{
    public function run(): void
    {
        // 1. SERVICES
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        \DB::table('service_translations')->truncate();
        \DB::table('services')->truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $services = [
            [
                'email' => 'sales@dongnaiford.com.vn',
                'image' => ['path' => 'uploads/services/service_support_customer.png'],
                'benefit_image' => ['path' => 'uploads/services/service_support_customer.png'],
                'sliders' => [['path' => 'uploads/services/service_support_customer.png']],
                'position' => 1,
                'custom_link' => '/san-pham',
                'vi' => [
                    'title' => 'Dịch vụ xe mới',
                    'slug' => 'dich-vu-xe-moi',
                    'description' => 'Trải nghiệm mua sắm xe Ford mới với các ưu đãi đặc quyền tại showroom Đồng Nai Ford.',
                    'content' => '<p>Chúng tôi cung cấp đầy đủ các dòng xe Ford mới nhất, hỗ trợ lái thử và báo giá nhanh chóng.</p>'
                ]
            ],
            [
                'email' => 'periodic@dongnaiford.com.vn',
                'image' => ['path' => 'uploads/services/service_fixed_car.png'],
                'benefit_image' => ['path' => 'uploads/services/service_fixed_car.png'],
                'sliders' => [['path' => 'uploads/services/service_fixed_car.png']],
                'position' => 2,
                'custom_link' => '/dich-vu/bao-duong-dinh-ky',
                'vi' => [
                    'title' => 'Dịch vụ bảo dưỡng',
                    'slug' => 'dich-vu-bao-duong',
                    'description' => 'Bảo dưỡng xe định kỳ theo chuẩn quy trình toàn cầu của Ford giúp tối ưu hóa hiệu suất xe.',
                    'content' => '<p>Chương trình bảo dưỡng xe định kỳ chuyên nghiệp tại xưởng dịch vụ Đồng Nai Ford.</p>'
                ]
            ],
            [
                'email' => 'repair@dongnaiford.com.vn',
                'image' => ['path' => 'uploads/services/service_fixed_car.png'],
                'benefit_image' => ['path' => 'uploads/services/service_fixed_car.png'],
                'sliders' => [['path' => 'uploads/services/service_fixed_car.png']],
                'position' => 3,
                'custom_link' => '/lien-he?reason=Yêu cầu sửa chữa xe',
                'vi' => [
                    'title' => 'Dịch vụ sửa chữa',
                    'slug' => 'dich-vu-sua-chua',
                    'description' => 'Đội ngũ kỹ thuật viên tay nghề cao giúp chẩn đoán và khắc phục sự cố xe của bạn nhanh chóng.',
                    'content' => '<p>Đồng Nai Ford cam kết mang đến dịch vụ sửa chữa chất lượng, sử dụng phụ tùng chính hãng.</p>'
                ]
            ],
            [
                'email' => 'rescue@dongnaiford.com.vn',
                'image' => ['path' => 'uploads/services/service_delivery.png'],
                'benefit_image' => ['path' => 'uploads/services/service_delivery.png'],
                'sliders' => [['path' => 'uploads/services/service_delivery.png']],
                'position' => 4,
                'custom_link' => '/lien-he?reason=Yêu cầu cứu hộ 24/7',
                'vi' => [
                    'title' => 'Dịch vụ cứu hộ 24/7',
                    'slug' => 'dich-vu-cuu-ho-247',
                    'description' => 'Hỗ trợ cứu hộ khẩn cấp mọi lúc, mọi nơi, sẵn sàng đồng hành cùng bạn trên mọi hành trình.',
                    'content' => '<p>Dịch vụ cứu hộ 24/7 chuyên nghiệp của đại lý Đồng Nai Ford.</p>'
                ]
            ],
            [
                'email' => 'usedcars@dongnaiford.com.vn',
                'image' => ['path' => 'uploads/showroom/showroom_bg.png'],
                'benefit_image' => ['path' => 'uploads/showroom/showroom_bg.png'],
                'sliders' => [['path' => 'uploads/showroom/showroom_bg.png']],
                'position' => 5,
                'custom_link' => '/lien-he?reason=Tìm mua xe cũ',
                'vi' => [
                    'title' => 'Dịch vụ xe đã qua sử dụng',
                    'slug' => 'dich-vu-xe-da-qua-su-dung',
                    'description' => 'Mua bán, ký gửi và trao đổi các dòng xe Ford đã qua sử dụng chính hãng, bảo hành uy tín.',
                    'content' => '<p>Đại lý hỗ trợ kiểm định 167 điểm kỹ thuật nghiêm ngặt đối với xe đã qua sử dụng.</p>'
                ]
            ],
            [
                'email' => 'upgrade@dongnaiford.com.vn',
                'image' => ['path' => 'uploads/services/service_fixed_car.png'],
                'benefit_image' => ['path' => 'uploads/services/service_fixed_car.png'],
                'sliders' => [['path' => 'uploads/services/service_fixed_car.png']],
                'position' => 6,
                'custom_link' => '/lien-he?reason=Yêu cầu nâng cấp xe',
                'vi' => [
                    'title' => 'Dịch vụ nâng cấp xe',
                    'slug' => 'dich-vu-nang-cap-xe',
                    'description' => 'Nâng cấp phụ kiện chính hãng, lắp đặt đồ chơi xe hơi cao cấp, nâng tầm đẳng cấp xế cưng.',
                    'content' => '<p>Chúng tôi cung cấp giải pháp độ xe, nâng cấp nội thất ngoại thất xe Ford chất lượng.</p>'
                ]
            ],
            [
                'email' => 'service@dongnaiford.com.vn',
                'image' => ['path' => 'uploads/services/service_support_customer.png'],
                'benefit_image' => ['path' => 'uploads/services/service_support_customer.png'],
                'sliders' => [['path' => 'uploads/services/service_support_customer.png']],
                'position' => 7,
                'custom_link' => '/dich-vu/cham-soc-khach-hang',
                'vi' => [
                    'title' => 'Dịch vụ chăm sóc xe',
                    'slug' => 'dich-vu-cham-soc-xe',
                    'description' => 'Chăm sóc xe toàn diện từ rửa xe, đánh bóng, vệ sinh khoang máy đến phủ ceramic bảo vệ.',
                    'content' => '<p>Dịch vụ chăm sóc xe Ford chuyên nghiệp giúp giữ gìn giá trị xe bền bỉ theo thời gian.</p>'
                ]
            ],
            [
                'email' => 'express@dongnaiford.com.vn',
                'image' => ['path' => 'uploads/services/service_fixed_car.png'],
                'benefit_image' => ['path' => 'uploads/services/service_fixed_car.png'],
                'sliders' => [['path' => 'uploads/services/service_fixed_car.png']],
                'position' => 8,
                'custom_link' => '/dich-vu/bao-duong-nhanh',
                'vi' => [
                    'title' => 'Dịch vụ bảo dưỡng nhanh',
                    'slug' => 'dich-vu-bao-duong-nhanh',
                    'description' => 'Quy trình bảo dưỡng nhanh 60 phút giúp tiết kiệm tối đa thời gian chờ đợi của bạn.',
                    'content' => '<p>Dịch vụ bảo dưỡng nhanh chuẩn quy trình kỹ thuật cam kết chất lượng.</p>'
                ]
            ],
        ];

        foreach ($services as $serviceData) {
            $service = new Service([
                'email' => $serviceData['email'],
                'image' => $serviceData['image'],
                'benefit_image' => $serviceData['benefit_image'],
                'sliders' => $serviceData['sliders'],
                'position' => $serviceData['position'],
                'custom_link' => $serviceData['custom_link'],
                'status' => 'ACTIVE',
            ]);
            $service->fill($serviceData);
            $service->save();
        }

        $this->command->info('✅ Services created: ' . count($services));

        // 2. AGENCIES
        $agencies = [
            [
                'region' => 'Đồng Nai',
                'province_id' => '48',
                'is_headquarter' => true,
                'is_featured' => true,
                'position' => 1,
                'longitude' => 106.8419,
                'latitude' => 10.9638,
                'link_google_map' => 'https://maps.google.com/?q=10.9638,106.8419',
                'image' => ['path' => 'uploads/showroom/showroom_bg.png'],
                'images' => [
                    ['path' => 'uploads/showroom/showroom_bg.png'],
                    ['path' => 'uploads/showroom/showroom_map.png']
                ],
                'vi' => [
                    'title' => 'Showroom Đồng Nai Ford - Biên Hòa',
                    'slug' => 'showroom-dong-nai-ford-bien-hoa',
                    'full_address' => 'Khu thương mại Amata, Đường Biên Hòa - Vũng Tàu, Long Bình, TP. Biên Hòa, Đồng Nai',
                    'phones' => [['number' => '(0251) 3857 130', 'type' => 'main']],
                    'info' => [
                        'email' => 'contact@dongnaiford.com.vn',
                        'working_time' => 'Thứ 2 - Chủ nhật: 8:00 - 18:00'
                    ],
                    'content' => '<p>Showroom chính thức của Ford tại Đồng Nai với cơ sở vật chất hiện đại, đội ngũ chuyên nghiệp.</p>'
                ]
            ],
            [
                'region' => 'Đồng Nai',
                'province_id' => '48',
                'is_headquarter' => false,
                'is_featured' => false,
                'position' => 2,
                'longitude' => 106.9524,
                'latitude' => 10.9804,
                'link_google_map' => 'https://maps.google.com/?q=10.9804,106.9524',
                'image' => ['path' => 'uploads/showroom/showroom_bg.png'],
                'vi' => [
                    'title' => 'Xưởng Dịch Vụ Đồng Nai Ford - Long Thành',
                    'slug' => 'xuong-dich-vu-long-thanh',
                    'full_address' => 'KCN Long Thành, Huyện Long Thành, Đồng Nai',
                    'phones' => [['number' => '(0251) 3857 140', 'type' => 'main']],
                    'info' => [
                        'email' => 'service@dongnaiford.com.vn',
                        'working_time' => 'Thứ 2 - Thứ 7: 8:00 - 17:30'
                    ],
                    'content' => '<p>Xưởng dịch vụ chuyên nghiệp với trang thiết bị hiện đại.</p>'
                ]
            ],
        ];

        foreach ($agencies as $agencyData) {
            $agency = new Agency([
                'region' => $agencyData['region'],
                'province_id' => $agencyData['province_id'],
                'is_headquarter' => $agencyData['is_headquarter'],
                'is_featured' => $agencyData['is_featured'],
                'position' => $agencyData['position'],
                'longitude' => $agencyData['longitude'],
                'latitude' => $agencyData['latitude'],
                'link_google_map' => $agencyData['link_google_map'],
                'image' => $agencyData['image'],
                'images' => $agencyData['images'] ?? null,
                'status' => 'ACTIVE',
            ]);
            $agency->fill($agencyData);
            $agency->save();
        }

        $this->command->info('✅ Agencies created: ' . count($agencies));

        // 3. JOBS
        $jobs = [
            [
                'position' => 1,
                'quantity' => 3,
                'expected_time' => now()->addDays(30),
                'published_at' => now(),
                'vi' => [
                    'title' => 'Tư vấn bán hàng (Sales Consultant)',
                    'slug' => 'tuvan-ban-hang-sales-consultant',
                    'working_position' => 'Tư vấn bán hàng',
                    'work_address' => 'TP. Biên Hòa, Đồng Nai',
                    'working_time' => 'Thứ 2 - Thứ 7: 8:00 - 17:30, Chủ Nhật: 8:00 - 12:00',
                    'description' => 'Tư vấn và bán các sản phẩm xe Ford cho khách hàng cá nhân và doanh nghiệp.',
                    'content' => '<h2>Mô tả công việc</h2><p>Gia nhập đội ngũ bán hàng chuyên nghiệp của Đồng Nai Ford.</p><h3>Yêu cầu</h3><ul><li>Tốt nghiệp Cao đẳng trở lên</li><li>Ưu tiên có kinh nghiệm bán hàng ô tô</li><li>Kỹ năng giao tiếp tốt, nhiệt tình</li><li>Có bằng lái xe B2</li></ul><h3>Quyền lợi</h3><ul><li>Lương cơ bản + Hoa hồng hấp dẫn (15,000,000 - 25,000,000 VNĐ)</li><li>Bảo hiểm đầy đủ theo luật</li><li>Được đào tạo chuyên sâu về sản phẩm Ford</li><li>Môi trường làm việc chuyên nghiệp</li></ul>'
                ]
            ],
            [
                'position' => 2,
                'quantity' => 2,
                'expected_time' => now()->addDays(45),
                'published_at' => now(),
                'vi' => [
                    'title' => 'Kỹ thuật viên bảo dưỡng sửa chữa',
                    'slug' => 'ky-thuat-vien-bao-duong-sua-chua',
                    'working_position' => 'Kỹ thuật viên',
                    'work_address' => 'Xưởng dịch vụ Ford - Long Thành, Đồng Nai',
                    'working_time' => 'Thứ 2 - Thứ 7: 8:00 - 17:30',
                    'description' => 'Thực hiện công việc bảo dưỡng, sửa chữa xe Ford theo quy trình chuẩn.',
                    'content' => '<h2>Mô tả công việc</h2><p>Trở thành kỹ thuật viên chuyên nghiệp được đào tạo bởi Ford.</p><h3>Yêu cầu</h3><ul><li>Tốt nghiệp Trung cấp nghề trở lên chuyên ngành Cơ khí, Ô tô</li><li>Am hiểu về cơ khí ô tô</li><li>Có khả năng làm việc nhóm</li></ul><h3>Quyền lợi</h3><ul><li>Lương thỏa thuận theo năng lực (12,000,000 - 18,000,000 VNĐ)</li><li>Bảo hiểm xã hội đầy đủ</li><li>Được đào tạo kỹ thuật Ford chính hãng</li></ul>'
                ]
            ],
            [
                'position' => 3,
                'quantity' => 1,
                'expected_time' => now()->addDays(60),
                'published_at' => now(),
                'vi' => [
                    'title' => 'Nhân viên Marketing',
                    'slug' => 'nhan-vien-marketing',
                    'working_position' => 'Nhân viên Marketing',
                    'work_address' => 'TP. Biên Hòa, Đồng Nai',
                    'working_time' => 'Thứ 2 - Thứ 6: 8:00 - 17:00',
                    'description' => 'Triển khai các chiến dịch marketing online và offline cho showroom.',
                    'content' => '<h2>Mô tả công việc</h2><p>Cơ hội phát triển sự nghiệp trong ngành ô tô.</p><h3>Yêu cầu</h3><ul><li>Tốt nghiệp Đại học chuyên ngành Marketing, Truyền thông</li><li>Có kinh nghiệm làm marketing 1-2 năm</li><li>Thành thạo Facebook Ads, Google Ads</li></ul><h3>Quyền lợi</h3><ul><li>Lương: 10-15 triệu + KPI (10,000,000 - 15,000,000 VNĐ)</li><li>Môi trường sáng tạo</li><li>Được tiếp cận ngân sách marketing lớn</li></ul>'
                ]
            ],
            [
                'position' => 4,
                'quantity' => 2,
                'expected_time' => now()->addDays(30),
                'published_at' => now(),
                'vi' => [
                    'title' => 'Cố vấn dịch vụ (Service Advisor)',
                    'slug' => 'co-van-dich-vu-service-advisor',
                    'working_position' => 'Cố vấn dịch vụ',
                    'work_address' => 'TP. Biên Hòa, Đồng Nai',
                    'working_time' => 'Thứ 2 - Thứ 7: 8:00 - 17:30',
                    'description' => 'Tiếp nhận xe, tư vấn dịch vụ bảo dưỡng, sửa chữa và chăm sóc khách hàng tại xưởng.',
                    'content' => '<h2>Mô tả công việc</h2><p>Làm cầu nối giữa khách hàng và xưởng kỹ thuật dịch vụ.</p><h3>Yêu cầu</h3><ul><li>Tốt nghiệp chuyên ngành Công nghệ Ô tô hoặc liên quan</li><li>Có kỹ năng giao tiếp và xử lý tình huống xuất sắc</li><li>Có kinh nghiệm ở vị trí tương đương là một lợi thế</li></ul><h3>Quyền lợi</h3><ul><li>Lương cứng + Thưởng hiệu suất doanh thu (12,000,000 - 20,000,000 VNĐ)</li><li>Đào tạo chứng chỉ cố vấn dịch vụ Ford chuẩn</li></ul>'
                ]
            ],
            [
                'position' => 5,
                'quantity' => 1,
                'expected_time' => now()->addDays(40),
                'published_at' => now(),
                'vi' => [
                    'title' => 'Chuyên viên tư vấn tài chính bảo hiểm',
                    'slug' => 'chuyen-vien-tu-van-tai-chinh-bao-hiem',
                    'working_position' => 'Tư vấn tài chính',
                    'work_address' => 'TP. Biên Hòa, Đồng Nai',
                    'working_time' => 'Thứ 2 - Thứ 7: 8:00 - 17:30',
                    'description' => 'Hỗ trợ khách hàng mua xe thủ tục trả góp ngân hàng và tư vấn các gói bảo hiểm xe liên kết.',
                    'content' => '<h2>Mô tả công việc</h2><p>Hỗ trợ tối đa thủ tục mua xe nhanh chóng cho khách hàng.</p><h3>Yêu cầu</h3><ul><li>Tốt nghiệp Cao đẳng/Đại học chuyên ngành Tài chính, Ngân hàng, Bảo hiểm</li><li>Nhanh nhẹn, cẩn thận, trung thực</li><li>Kỹ năng đàm phán tốt</li></ul><h3>Quyền lợi</h3><ul><li>Lương cơ bản + Thưởng doanh số dịch vụ liên kết (10,000,000 - 18,000,000 VNĐ)</li><li>Được làm việc trực tiếp với đối tác ngân hàng lớn</li></ul>'
                ]
            ],
            [
                'position' => 6,
                'quantity' => 2,
                'expected_time' => now()->addDays(30),
                'published_at' => now(),
                'vi' => [
                    'title' => 'Kỹ thuật viên đồng sơn nhanh',
                    'slug' => 'ky-thuat-vien-dong-son-nhanh',
                    'working_position' => 'Kỹ thuật viên',
                    'work_address' => 'Xưởng dịch vụ Ford - Long Thành, Đồng Nai',
                    'working_time' => 'Thứ 2 - Thứ 7: 8:00 - 17:30',
                    'description' => 'Thực hiện các công việc gò hàn, phục hồi thân vỏ và sơn sấy nhanh theo tiêu chuẩn kỹ thuật.',
                    'content' => '<h2>Mô tả công việc</h2><p>Đảm bảo chất lượng thân vỏ xe sau sửa chữa đạt độ thẩm mỹ cao nhất.</p><h3>Yêu cầu</h3><ul><li>Có kinh nghiệm gò sơn ô tô từ 1 năm trở lên</li><li>Chịu khó, tỉ mỉ, có trách nhiệm với công việc</li></ul><h3>Quyền lợi</h3><ul><li>Thu nhập theo tay nghề và năng suất sản phẩm (15,000,000 - 22,000,000 VNĐ)</li><li>Trang bị đầy đủ đồ bảo hộ lao động cao cấp</li></ul>'
                ]
            ],
            [
                'position' => 7,
                'quantity' => 2,
                'expected_time' => now()->addDays(20),
                'published_at' => now(),
                'vi' => [
                    'title' => 'Nhân viên chăm sóc khách hàng (Call Center)',
                    'slug' => 'nhan-vien-cham-soc-khach-hang-call-center',
                    'working_position' => 'Chăm sóc khách hàng',
                    'work_address' => 'TP. Biên Hòa, Đồng Nai',
                    'working_time' => 'Thứ 2 - Thứ 6: 8:00 - 17:00, Thứ 7: 8:00 - 12:00',
                    'description' => 'Gọi điện khảo sát sự hài lòng sau mua xe/dịch vụ, nhắc lịch bảo dưỡng định kỳ cho khách hàng.',
                    'content' => '<h2>Mô tả công việc</h2><p>Duy trì mối quan hệ tốt đẹp giữa khách hàng và đại lý.</p><h3>Yêu cầu</h3><ul><li>Giọng nói truyền cảm, dễ nghe (không nói ngọng, nói lắp)</li><li>Kỹ năng lắng nghe và xử lý tình huống qua điện thoại tốt</li><li>Sử dụng máy tính văn phòng cơ bản</li></ul><h3>Quyền lợi</h3><ul><li>Lương cứng + Thưởng khảo sát hài lòng (8,000,000 - 12,000,000 VNĐ)</li><li>Nghỉ chiều Thứ 7 và ngày Chủ Nhật</li></ul>'
                ]
            ],
        ];

        foreach ($jobs as $jobData) {
            $job = new Job([
                'position' => $jobData['position'],
                'quantity' => $jobData['quantity'],
                'expected_time' => $jobData['expected_time'],
                'published_at' => $jobData['published_at'],
                'status' => 'ACTIVE',
            ]);
            $job->fill($jobData);
            $job->save();
        }

        $this->command->info('✅ Jobs created: ' . count($jobs));
        $this->command->info('🎉 Services, Agencies, Jobs seeding completed!');
    }
}
