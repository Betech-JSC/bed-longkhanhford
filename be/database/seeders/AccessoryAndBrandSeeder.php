<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Brand\Brand;
use App\Models\Vehicle\Accessory;
use App\Models\Vehicle\AccessoryCategory;
use Illuminate\Support\Str;

class AccessoryAndBrandSeeder extends Seeder
{
    public function run(): void
    {
        // Clean up existing data to prevent duplicate slugs (e.g. tham-san-cao-cap1)
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        \Illuminate\Support\Facades\DB::table('accessory_ref_categories')->truncate();
        \Illuminate\Support\Facades\DB::table('accessory_translations')->truncate();
        Accessory::truncate();
        \Illuminate\Support\Facades\DB::table('brand_translations')->truncate();
        Brand::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $this->command->info('✅ Cleaned accessories and brands tables');

        // 1. Seed Brands
        $brandsData = [
            ['name' => 'Ford', 'slug' => 'ford'],
            ['name' => '3M', 'slug' => '3m'],
            ['name' => 'Vietmap', 'slug' => 'vietmap'],
            ['name' => 'Michelin', 'slug' => 'michelin'],
            ['name' => 'Steelmate', 'slug' => 'steelmate'],
            ['name' => 'Nappa', 'slug' => 'nappa'],
            ['name' => 'K&N', 'slug' => 'kn'],
            ['name' => 'Akrapovic', 'slug' => 'akrapovic'],
        ];

        $brands = [];
        foreach ($brandsData as $index => $bData) {
            $brand = new Brand([
                'status' => Brand::STATUS_ACTIVE,
                'position' => $index + 1,
            ]);
            $brand->fill([
                'vi' => [
                    'title' => $bData['name'],
                    'slug' => $bData['slug'],
                ],
                'en' => [
                    'title' => $bData['name'],
                    'slug' => $bData['slug'],
                ]
            ]);
            $brand->save();
            $brands[$bData['name']] = $brand;
        }
        $this->command->info('✅ seeded ' . count($brands) . ' brands.');

        // Category mapping to IDs
        $categoryMapping = [
            'interior' => 1,
            'exterior' => 2,
            'tech' => 3,
            'wheels' => 4,
            'performance' => 5,
        ];

        // 2. Seed Accessories
        $accessoriesList = [
            [
                'id' => 'thanh-gia-noc-ford-focus',
                'name' => 'Thanh Giá/Giá Ngang Mái Xe Ford Focus Estate Màu Bạc',
                'code' => '2171008',
                'category' => 'exterior',
                'price' => 580000,
                'brand' => 'Ford',
                'description' => 'Thiết kế khí động học giúp giảm tiếng ồn và tiết kiệm nhiên liệu tối đa, tăng không gian chứa hành lý cho các chuyến đi xa.',
                'images' => [
                    ['path' => '/uploads/accessories/focus_rack_1.png', 'alt' => 'Thanh Giá/Giá Ngang Mái Xe Ford Focus']
                ],
                'fit_vehicles' => ['Ford Focus Estate', 'Ford Ranger', 'Ford Territory', 'Ford Escape'],
                'features' => [
                    'Khách hàng thân thiết nhận thêm 10% giảm giá cho lần mua tiếp theo.',
                    'Đổi trả sản phẩm trong vòng 30 ngày nếu không hài lòng.',
                    'Tặng kèm quà nhỏ cho mỗi đơn hàng trên 1.000.000 VNĐ.'
                ],
                'compatibility_text' => 'Tương thích hoàn toàn với dòng xe Ford Focus Estate phiên bản từ năm 2018 đến 2026. Lắp đặt trực tiếp vào hệ thống đường ray dọc có sẵn trên nóc xe mà không cần khoan đục.',
                'safety_text' => 'Sản phẩm được kiểm định nghiêm ngặt về độ chịu tải và sức cản gió lên đến tốc độ 120km/h. Tải trọng khuyến nghị tối đa 75kg. Lưu ý: không mở cửa sổ trời toàn cảnh khi đang tải hành lý trên thanh ngang.',
                'product_desc_text' => 'Thanh ngang là nền tảng hoàn hảo cho các phụ kiện vận chuyển trên nóc xe. Mỗi bộ được thiết kế riêng cho xe Ford. Bộ 2 thanh nhôm có khóa, lắp vào ray bên hông, tải trọng tối đa 75 kg. Lưu ý: không thể mở cửa sổ trời toàn cảnh khi lắp thanh ngang.'
            ],
            [
                'id' => 'tham-san-cao-cap',
                'name' => 'Thảm Sàn Cao Cấp',
                'code' => 'INTS-101',
                'category' => 'interior',
                'price' => 2500000,
                'brand' => '3M',
                'description' => 'Thảm sàn cao cấp thiết kế ôm khít sàn xe, chất liệu TPE không mùi, chống nước, chống trượt hoàn hảo.',
                'images' => [
                    ['path' => '/uploads/accessories/floor_mat_1.png', 'alt' => 'Thảm Sàn Cao Cấp']
                ],
                'fit_vehicles' => ['Ford Everest', 'Ford Ranger', 'Ford Territory', 'Ford Escape'],
                'features' => [
                    'Chất liệu nhựa TPE cao cấp không mùi độc hại.',
                    'Thiết kế 3D ôm khít từng góc cạnh sàn xe.',
                    'Dễ dàng tháo rời và xịt rửa vệ sinh nhanh chóng.'
                ],
                'compatibility_text' => 'Thiết kế riêng theo số đo sàn xe của từng dòng Ford Everest, Ranger, Territory. Vui lòng ghi chú dòng xe khi đặt hàng.',
                'safety_text' => 'Thảm có chốt khóa cố định chắc chắn vào sàn xe, đảm bảo không bị xê dịch gây kẹt chân ga hay chân phanh trong quá trình vận hành.',
                'product_desc_text' => 'Bộ thảm lót sàn cao cấp được làm từ nhựa TPE nguyên sinh thân thiện với môi trường, khả năng chịu nhiệt cao và không phát sinh mùi hôi ngay cả khi đỗ xe dưới trời nắng gắt.'
            ],
            [
                'id' => 'boc-ghe-da',
                'name' => 'Bọc Ghế Da',
                'code' => 'INTS-102',
                'category' => 'interior',
                'price' => 8900000,
                'brand' => 'Nappa',
                'description' => 'Nâng cấp không gian nội thất sang trọng với chất liệu da Nappa cao cấp, êm ái và thoáng khí tối đa.',
                'images' => [
                    ['path' => '/uploads/accessories/leather_seat_1.png', 'alt' => 'Bọc Ghế Da Nappa']
                ],
                'fit_vehicles' => ['Ford Ranger XLS/XLT', 'Ford Territory Trend', 'Ford Transit'],
                'features' => [
                    'Chất liệu da Nappa nhập khẩu mềm mịn như da thật.',
                    'Mẫu mã thêu may theo yêu cầu cá nhân hóa cá tính.',
                    'Chống thấm nước tốt, hạn chế bám bụi bẩn và ẩm mốc.'
                ],
                'compatibility_text' => 'Phù hợp cho các phiên bản xe ghế nỉ của Ford Ranger, Territory hoặc bọc lại toàn bộ nội thất xe Transit VIP.',
                'safety_text' => 'Quy trình may chuyên nghiệp chừa đường chỉ túi khí hông, bảo đảm túi khí bung bình thường khi xảy ra sự cố va chạm.',
                'product_desc_text' => 'Bọc da ghế ô tô sử dụng chất liệu cao cấp mang lại sự sang trọng bậc nhất cho chiếc xe của bạn. Da có khả năng co giãn tốt, lỗ thông hơi thông minh giúp chống nóng bí lưng.'
            ],
            [
                'id' => 'camera-hanh-trinh-pro',
                'name' => 'Camera Hành Trình Pro',
                'code' => 'TECS-201',
                'category' => 'tech',
                'price' => 4200000,
                'brand' => 'Vietmap',
                'description' => 'Camera hành trình ghi hình độ nét cao Ultra HD 4K, hỗ trợ cảnh báo giao thông bằng giọng nói và giám sát đỗ xe.',
                'images' => [
                    ['path' => '/uploads/accessories/dashcam_1.png', 'alt' => 'Camera Hành Trình Pro']
                ],
                'fit_vehicles' => ['Ford Everest', 'Ford Ranger', 'Ford Territory', 'Ford Escape'],
                'features' => [
                    'Độ phân giải Ultra HD 4K sắc nét cả ngày lẫn đêm.',
                    'Tích hợp GPS hiển thị tốc độ và bản đồ hành trình.',
                    'Cảnh báo chệch làn đường, khoảng cách xe phía trước.'
                ],
                'compatibility_text' => 'Lắp ráp được trên tất cả dòng xe Ford. Kết nối nguồn tẩu hoặc đi dây cầu chì giám sát đỗ xe 24/24.',
                'safety_text' => 'Sử dụng tụ điện chịu nhiệt thay cho pin Li-on truyền thống, đảm bảo thiết bị hoạt động bền bỉ, không cháy nổ dưới nhiệt độ cao.',
                'product_desc_text' => 'Camera hành trình cao cấp Pro ghi lại mọi khoảnh khắc di chuyển trên đường với góc quay siêu rộng 170 độ, bảo vệ quyền lợi hợp pháp của bạn khi tham gia giao thông.'
            ],
            [
                'id' => 'bo-mam-hop-kim',
                'name' => 'Bộ Mâm Hợp Kim',
                'code' => 'WHE-301',
                'category' => 'wheels',
                'price' => 15500000,
                'brand' => 'Michelin',
                'description' => 'Bộ mâm hợp kim thể thao đa chấu thể hiện cá tính mạnh mẽ, tối ưu hóa trọng lượng và tăng cường độ cứng cáp.',
                'images' => [
                    ['path' => '/uploads/accessories/alloy_wheel_1.png', 'alt' => 'Bộ Mâm Hợp Kim']
                ],
                'fit_vehicles' => ['Ford Ranger', 'Ford Everest', 'Ranger Raptor'],
                'features' => [
                    'Chất liệu hợp kim đúc cường lực siêu bền nhẹ.',
                    'Thiết kế góc cạnh thể thao hầm hố chuẩn off-road.',
                    'Tương thích tốt với các thông số lốp xe nguyên bản.'
                ],
                'compatibility_text' => 'Sản phẩm thiết kế chuyên dụng cho hệ trục bánh xe Ford Ranger và Everest. Vui lòng liên hệ kỹ thuật viên để chọn đúng thông số lốp phù hợp.',
                'safety_text' => 'Đạt tiêu chuẩn thử nghiệm va đập và chịu lực quốc tế, bảo đảm an toàn khi xe vận hành vượt địa hình gồ ghề.',
                'product_desc_text' => 'Nâng cấp mâm hợp kim thể thao giúp xe có ngoại hình bắt mắt, cứng cáp hơn đồng thời nâng cao tính năng lái, phản hồi mặt đường tốt hơn.'
            ],
            [
                'id' => 'loc-gio-hieu-suat',
                'name' => 'Lọc Gió Hiệu Suất',
                'code' => 'PER-401',
                'category' => 'performance',
                'price' => 1800000,
                'brand' => 'K&N',
                'description' => 'Lọc gió hiệu suất cao cho phép lưu lượng gió nạp nhiều hơn, tăng công suất động cơ và tiết kiệm nhiên liệu.',
                'images' => [
                    ['path' => '/uploads/accessories/air_filter_1.png', 'alt' => 'Lọc Gió Hiệu Suất K&N']
                ],
                'fit_vehicles' => ['Ford Ranger Wildtrak', 'Ford Everest Bi-Turbo', 'Ranger Raptor'],
                'features' => [
                    'Tăng lượng không khí nạp vào động cơ đến 30%.',
                    'Lưới lọc chất liệu vải bông tẩm dầu lọc bụi mịn siêu tốt.',
                    'Có thể vệ sinh tái sử dụng trọn đời xe lên đến 100.000km.'
                ],
                'compatibility_text' => 'Tương thích hoàn toàn với hộp lọc gió zin của động cơ Single-Turbo và Bi-Turbo 2.0L trên Ranger và Everest.',
                'safety_text' => 'Không gây lỗi cảm biến lưu lượng khí nạp (MAF) khi được tẩm dầu bảo dưỡng đúng định lượng quy chuẩn nhà sản xuất.',
                'product_desc_text' => 'Lọc gió hiệu suất cao là món phụ kiện nâng cấp động cơ hiệu quả nhất với chi phí tối ưu, giúp xe bốc hơn ở ga đầu và tăng tốc mượt mà hơn.'
            ],
            [
                'id' => 'bo-sap-xep-hanh-ly',
                'name' => 'Bộ Sắp Xếp Hành Lý',
                'code' => 'INTS-103',
                'category' => 'interior',
                'price' => 1200000,
                'brand' => 'Ford',
                'description' => 'Hộp sắp xếp hành lý cốp xe đa năng, nhiều ngăn chứa tiện dụng và có thể gập gọn khi không sử dụng.',
                'images' => [
                    ['path' => '/uploads/accessories/trunk_organizer_1.png', 'alt' => 'Bộ Sắp Xếp Hành Lý Cốp Sau']
                ],
                'fit_vehicles' => ['Ford Everest', 'Ford Territory', 'Ford Escape'],
                'features' => [
                    'Chất liệu vải Oxford chống thấm nước và bụi bẩn bám dính.',
                    'Có vách ngăn di động giúp phân loại đồ dùng thông minh.',
                    'Có quai xách hai bên tiện lợi mang xách di chuyển.'
                ],
                'compatibility_text' => 'Sử dụng đặt gọn gàng trong cốp xe phía sau của tất cả các dòng xe ô tô từ 5 chỗ đến 7 chỗ.',
                'safety_text' => 'Đế hộp tích hợp gai bám chống trượt, giữ cố định vị trí hộp không bị xô lệch khi xe tăng tốc hoặc phanh gấp.',
                'product_desc_text' => 'Khay hộp sắp xếp hành lý giúp khoang cốp xe của bạn luôn ngăn nắp, sạch sẽ, giải quyết tình trạng đồ đạc lăn lóc phát ra tiếng ồn khi xe chạy.'
            ],
            [
                'id' => 'tam-chan-nang',
                'name' => 'Tấm Chắn Nắng',
                'code' => 'INTS-104',
                'category' => 'interior',
                'price' => 500000,
                'brand' => '3M',
                'description' => 'Bộ tấm chắn nắng nam châm thiết kế riêng theo form kính xe, cản nắng cản nhiệt hiệu quả bảo vệ nội thất.',
                'images' => [
                    ['path' => '/uploads/accessories/sunshade_1.png', 'alt' => 'Tấm Chắn Nắng']
                ],
                'fit_vehicles' => ['Ford Everest', 'Ford Ranger', 'Ford Territory'],
                'features' => [
                    'Khung viền tích hợp nam châm hít chặt viền cửa kính.',
                    'Lưới cản nắng cao cấp giảm nhiệt bên trong cabin đến 70%.',
                    'Vẫn có thể hạ kính lấy gió ngoài khi tấm chắn nắng đang gắn.'
                ],
                'compatibility_text' => 'Gồm bộ 4 tấm thiết kế riêng theo kích thước khung kính cửa của Everest, Ranger, Territory đời mới nhất.',
                'safety_text' => 'Thiết kế chừa góc quan sát gương chiếu hậu bên tài và bên phụ, bảo đảm tầm nhìn an toàn khi lái xe.',
                'product_desc_text' => 'Tấm che nắng nam châm thế hệ mới loại bỏ sự lỉnh kỉnh của núm hút cao su cũ, mang lại tính thẩm mỹ cao và sự tiện lợi vượt trội cho người sử dụng.'
            ],
            [
                'id' => 'sac-khong-day',
                'name' => 'Sạc Không Dây',
                'code' => 'TECS-202',
                'category' => 'tech',
                'price' => 950000,
                'brand' => 'Steelmate',
                'description' => 'Khay sạc điện thoại không dây chuẩn Qi tích hợp gọn gàng tại khu vực bệ trung tâm điều khiển tiện lợi.',
                'images' => [
                    ['path' => '/uploads/accessories/wireless_charger_1.png', 'alt' => 'Sạc Không Dây 15W']
                ],
                'fit_vehicles' => ['Ford Ranger XLS/XLT', 'Ford Territory Trend'],
                'features' => [
                    'Hỗ trợ sạc nhanh không dây chuẩn Qi công suất 15W.',
                    'Chip xử lý thông minh tự ngắt nguồn khi sạc đầy bảo vệ pin.',
                    'Bề mặt cao su chống trượt điện thoại khi xe di chuyển.'
                ],
                'compatibility_text' => 'Lắp đặt gọn gàng vào hộc để đồ trung tâm cho các bản xe thiếu sạc không dây nguyên bản của Ranger và Territory.',
                'safety_text' => 'Đạt chứng nhận an toàn chống quá nhiệt, quá dòng, phát hiện vật thể lạ bằng kim loại tránh gây chập cháy.',
                'product_desc_text' => 'Nâng cấp khay sạc không dây giúp khoang lái gọn gàng hơn, loại bỏ sự rườm rà của dây cáp sạc truyền thống mà vẫn đảm bảo điện thoại luôn đầy pin.'
            ],
            [
                'id' => 'tam-chan-bun',
                'name' => 'Tấm Chắn Bùn',
                'code' => 'EXTS-301',
                'category' => 'exterior',
                'price' => 600000,
                'brand' => 'Ford',
                'description' => 'Bộ 4 tấm chắn bùn bánh xe chất liệu nhựa dẻo PP đàn hồi cao, chống va đập sỏi đá làm xước sơn xe.',
                'images' => [
                    ['path' => '/uploads/accessories/mud_guard_1.png', 'alt' => 'Tấm Chắn Bùn Bánh Xe']
                ],
                'fit_vehicles' => ['Ford Ranger', 'Ford Everest', 'Ford Territory'],
                'features' => [
                    'Nhựa dẻo chịu lực, chịu nhiệt tốt, không bị giòn nứt.',
                    'Bảo vệ hông xe khỏi bùn đất và sỏi đá văng khi đi mưa.',
                    'Thiết kế chuẩn lỗ bắt ốc vít nguyên bản của vè bánh xe.'
                ],
                'compatibility_text' => 'Tương thích cho Ford Ranger (XLS, Wildtrak) và Ford Everest từ đời 2022 trở đi.',
                'safety_text' => 'Ôm khít viền lốp xe, không gây cọ xát lốp hay cản trở góc lái an toàn của bánh trước.',
                'product_desc_text' => 'Tấm chắn bùn bánh xe là trang bị vô cùng thiết thực cho xe gầm cao khi di chuyển trong mùa mưa lũ ở Việt Nam, hạn chế tối đa chất bẩn bắn lên thân xe và xe phía sau.'
            ],
            [
                'id' => 'gia-noc',
                'name' => 'Giá Nóc Baga Cao Cấp',
                'code' => 'EXTS-302',
                'category' => 'exterior',
                'price' => 6800000,
                'brand' => 'Ford',
                'description' => 'Khay giá nóc baga thép nguyên khối chịu tải trọng nặng, mở rộng tối đa khả năng chở đồ dã ngoại cắm trại.',
                'images' => [
                    ['path' => '/uploads/accessories/roof_basket_1.png', 'alt' => 'Giá Nóc Baga Cao Cấp']
                ],
                'fit_vehicles' => ['Ford Everest'],
                'features' => [
                    'Cấu trúc thép sơn tĩnh điện chống rỉ sét dưới mọi thời tiết.',
                    'Tích hợp chốt khóa chống trộm an toàn tuyệt đối.',
                    'Tải trọng động cho phép tối đa lên đến 100kg.'
                ],
                'compatibility_text' => 'Lắp ráp cố định vào 2 thanh dọc nóc xe sẵn có của xe Ford Everest.',
                'safety_text' => 'Thiết kế khí động học tản gió giúp xe giữ thăng bằng tốt ở tốc độ cao, giảm thiểu tiếng ồn ù tai vọng vào khoang lái.',
                'product_desc_text' => 'Baga nóc là món phụ kiện không thể thiếu đối với các tín đồ du lịch tự lái (road trip), cắm trại dã ngoại ngoài trời, giúp giải phóng hoàn toàn không gian cốp xe chật hẹp.'
            ],
            [
                'id' => 'bac-len-xuong',
                'name' => 'Bậc Lên Xuống Thể Thao',
                'code' => 'EXTS-303',
                'category' => 'exterior',
                'price' => 7200000,
                'brand' => 'Ford',
                'description' => 'Bậc bước chân lên xuống hợp kim đúc thể thao cứng cáp, bảo vệ sườn xe và giúp lên xuống xe dễ dàng.',
                'images' => [
                    ['path' => '/uploads/accessories/side_step_1.png', 'alt' => 'Bậc Lên Xuống']
                ],
                'fit_vehicles' => ['Ford Ranger Wildtrak/XLS/XLT', 'Ford Everest'],
                'features' => [
                    'Mặt bậc ốp cao su nổi chống trơn trượt khi bước chân ướt.',
                    'Khung chịu lực hợp kim nhôm chịu va đập bảo vệ lườn xe.',
                    'Dễ dàng vệ sinh và tháo lắp zin theo các lỗ định vị sườn xe.'
                ],
                'compatibility_text' => 'Thay thế bệ bước chân cũ hoặc nâng cấp mới cho Ford Ranger và Ford Everest đời thế hệ mới.',
                'safety_text' => 'Khả năng chịu tải trọng dậm chân kiểm nghiệm thực tế lên đến 200kg trên mỗi bậc, vô cùng chắc chắn và an toàn.',
                'product_desc_text' => 'Bệ bước chân lên xuống vừa là điểm nhấn ngoại thất thể thao khỏe khoắn cho xe gầm cao vừa là trợ thủ đắc lực hỗ trợ trẻ nhỏ, phụ nữ mang thai lên xuống xe an toàn.'
            ],
            [
                'id' => 'he-thong-ong-xa',
                'name' => 'Hệ Thống Ống Xả Thể Thao',
                'code' => 'PER-402',
                'category' => 'performance',
                'price' => 12000000,
                'brand' => 'Akrapovic',
                'description' => 'Hệ thống pô ống xả thể thao bằng thép không gỉ, tinh chỉnh âm thanh pô uy lực và gia tăng công suất động cơ.',
                'images' => [
                    ['path' => '/uploads/accessories/exhaust_1.png', 'alt' => 'Hệ Thống Ống Xả Akrapovic']
                ],
                'fit_vehicles' => ['Ford Ranger Wildtrak 2.0 Bi-Turbo', 'Ranger Raptor'],
                'features' => [
                    'Chất liệu thép không gỉ SUS304 siêu bền bỉ.',
                    'Âm thanh trầm ấm uy lực ở vòng tua cao, không ồn khó chịu ở tua thấp.',
                    'Tăng công suất động cơ thêm 5 - 8 mã lực nhờ thoát khí thải tốt hơn.'
                ],
                'compatibility_text' => 'Lắp đặt plug and play trực tiếp vào hệ thống đường ống xả nguyên bản của Ranger Wildtrak và Raptor.',
                'safety_text' => 'Được thiết kế cách nhiệt tốt bảo vệ các chi tiết gầm xe xung quanh, đạt chứng nhận đăng kiểm tiêu chuẩn khí thải.',
                'product_desc_text' => 'Nâng cấp hệ thống pô thể thao mang lại cảm xúc phấn khích mỗi khi đạp ga với tiếng nổ đầy uy lực, đồng thời tối ưu hóa khả năng vận hành hiệu suất cao của động cơ tăng áp.'
            ]
        ];

        foreach ($accessoriesList as $index => $accData) {
            $brand = $brands[$accData['brand']] ?? null;
            
            $accessory = new Accessory([
                'brand_id' => $brand ? $brand->id : null,
                'code' => $accData['code'],
                'price' => $accData['price'],
                'image' => $accData['images'][0] ?? null,
                'images' => $accData['images'] ?? null,
                'fit_vehicles' => $accData['fit_vehicles'],
                'features' => $accData['features'],
                'status' => 'ACTIVE',
                'sort_order' => $index + 1,
            ]);

            $accessory->fill([
                'vi' => [
                    'title' => $accData['name'],
                    'slug' => $accData['id'],
                    'description' => $accData['description'],
                    'compatibility_text' => $accData['compatibility_text'],
                    'safety_text' => $accData['safety_text'],
                    'product_desc_text' => $accData['product_desc_text'],
                ],
                'en' => [
                    'title' => $accData['name'] . ' (EN)',
                    'slug' => $accData['id'] . '-en',
                    'description' => $accData['description'],
                    'compatibility_text' => $accData['compatibility_text'],
                    'safety_text' => $accData['safety_text'],
                    'product_desc_text' => $accData['product_desc_text'],
                ]
            ]);

            $accessory->save();

            // Link categories
            $catId = $categoryMapping[$accData['category']] ?? null;
            if ($catId) {
                $accessory->categories()->attach($catId);
            }
        }

        $this->command->info('✅ seeded ' . count($accessoriesList) . ' accessories linked to categories and brands.');
        $this->command->info('🎉 Seeding completed!');
    }
}
