<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle\VehicleCategory;
use App\Models\Vehicle\Vehicle;
use App\Models\Vehicle\VehicleVersion;
use App\Models\Vehicle\RegistrationFee;
use App\Models\Vehicle\Banner;
use App\Models\Vehicle\CustomerReview;
use App\Models\Vehicle\SalesConsultant;
use App\Models\Vehicle\DealerActivity;
use App\Models\Vehicle\Partner;
use App\Models\Region;

class VehicleTestSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks and truncate tables to ensure clean seeding
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        
        \Illuminate\Support\Facades\DB::table('vehicle_version_translations')->truncate();
        \Illuminate\Support\Facades\DB::table('vehicle_translations')->truncate();
        \Illuminate\Support\Facades\DB::table('vehicle_category_translations')->truncate();
        \Illuminate\Support\Facades\DB::table('sales_consultant_translations')->truncate();
        \Illuminate\Support\Facades\DB::table('customer_review_translations')->truncate();

        VehicleVersion::truncate();
        Vehicle::truncate();
        VehicleCategory::truncate();
        RegistrationFee::truncate();
        Banner::truncate();
        CustomerReview::truncate();
        SalesConsultant::truncate();
        DealerActivity::truncate();
        Partner::truncate();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $this->command->info('✅ Cleaned vehicle and related tables');

        // 1. NHÓM XE (Categories)
        $catSUV = new VehicleCategory(['status' => 'ACTIVE', 'sort_order' => 1]);
        $catSUV->fill([
            'vi' => ['title' => 'SUV', 'slug' => 'suv'],
            'en' => ['title' => 'SUV', 'slug' => 'suv-en'],
        ]);
        $catSUV->save();

        $catPickup = new VehicleCategory(['status' => 'ACTIVE', 'sort_order' => 2]);
        $catPickup->fill([
            'vi' => ['title' => 'Bán tải', 'slug' => 'ban-tai'],
            'en' => ['title' => 'Pickup', 'slug' => 'pickup'],
        ]);
        $catPickup->save();

        $catCommercial = new VehicleCategory(['status' => 'ACTIVE', 'sort_order' => 3]);
        $catCommercial->fill([
            'vi' => ['title' => 'Thương mại', 'slug' => 'thuong-mai'],
            'en' => ['title' => 'Commercial', 'slug' => 'commercial'],
        ]);
        $catCommercial->save();

        $this->command->info('✅ Vehicle categories created');

        // 2. VEHICLES LIST WITH SPECIFIC DYNAMIC BLOCKS
        $vehiclesData = [
            // FORD TERRITORY
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 739000000,
                'image' => 'territory_hero.png',
                'image_thumbnail' => 'territory_thumbnail.png',
                'image_featured' => 'territory_featured.png',
                'images' => ['territory_hero.png', 'territory_interior.png'],
                'colors' => [
                    ['name' => 'Trắng Kim Cương', 'hex' => '#e0e0e0', 'image_path' => 'territory_hero.png'],
                    ['name' => 'Đỏ Hỏa Tinh', 'hex' => '#c61918', 'image_path' => 'territory_hero.png'],
                    ['name' => 'Xám Ánh Trăng', 'hex' => '#9e9ea3', 'image_path' => 'territory_hero.png'],
                    ['name' => 'Xanh Biển Sâu', 'hex' => '#67859f', 'image_path' => 'territory_hero.png'],
                    ['name' => 'Đen Tuyệt Đối', 'hex' => '#000000', 'image_path' => 'territory_hero.png'],
                ],
                'vi' => [
                    'title' => 'FORD TERRITORY',
                    'slug' => 'ford-territory',
                    'tagline' => 'Cơ hội vàng. Sẵn sàng rước xế.',
                    'description' => 'Diện mạo mới đầy cuốn hút, công nghệ ngập tràn và không gian cabin rộng rãi bậc nhất phân khúc. Ford Territory là lựa chọn hoàn hảo cho gia đình trẻ năng động.'
                ],
                'versions' => [
                    [
                        'price' => 954000000,
                        'specs' => [
                            'engine' => '1.5L Ecoboost Xăng tăng áp',
                            'power' => '160 Hp @ 5400-5700 rpm',
                            'torque' => '248 Nm @ 1500-3000 rpm',
                            'transmission' => 'Tự động 7 cấp ly hợp kép ướt',
                            'drivetrain' => 'Cầu trước (FWD)',
                            'dimensions' => '4.630 x 1.935 x 1.706 mm',
                            'clearance' => '190 mm',
                            'fuelEconomy' => '7.0 L/100km'
                        ],
                        'vi' => ['name' => 'Territory Titanium X 1.5L AT']
                    ],
                    [
                        'price' => 899000000,
                        'specs' => [
                            'engine' => '1.5L Ecoboost Xăng tăng áp',
                            'power' => '160 Hp @ 5400-5700 rpm',
                            'torque' => '248 Nm @ 1500-3000 rpm',
                            'transmission' => 'Tự động 7 cấp ly hợp kép ướt',
                            'drivetrain' => 'Cầu trước (FWD)',
                            'dimensions' => '4.630 x 1.935 x 1.706 mm',
                            'clearance' => '190 mm',
                            'fuelEconomy' => '7.0 L/100km'
                        ],
                        'vi' => ['name' => 'Territory Titanium 1.5L AT']
                    ],
                    [
                        'price' => 739000000,
                        'specs' => [
                            'engine' => '1.5L Ecoboost Xăng tăng áp',
                            'power' => '160 Hp @ 5400-5700 rpm',
                            'torque' => '248 Nm @ 1500-3000 rpm',
                            'transmission' => 'Tự động 7 cấp ly hợp kép ướt',
                            'drivetrain' => 'Cầu trước (FWD)',
                            'dimensions' => '4.630 x 1.935 x 1.706 mm',
                            'clearance' => '190 mm',
                            'fuelEconomy' => '7.0 L/100km'
                        ],
                        'vi' => ['name' => 'Territory Trend 1.5L AT']
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'FORD TERRITORY',
                            'tagline' => 'Hiện đại. Sang trọng. Công nghệ tối tân.',
                            'button_text' => 'Nhận chương trình ưu đãi',
                            'button_link' => '/lien-he?vehicle=ford-territory',
                            'background_image' => 'territory_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Ưu Đãi Vàng Cho Xe Territory',
                            'description' => 'Hỗ trợ mua xe trả góp lãi suất 5.9%, tặng kèm gói phụ kiện đặc quyền và miễn phí bảo dưỡng xe lần đầu.',
                            'image' => 'territory_hero.png',
                            'button_text' => 'Tư vấn ưu đãi'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => 'Khám phá Territory 360°',
                            'description' => 'Trải nghiệm góc nhìn 360 độ ngoại thất mượt mà, mang tính khí động học cao của dòng SUV đô thị.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => 'Diện mạo trẻ trung, phong cách thể thao đô thị',
                            'image_1' => 'territory_hero.png',
                            'image_2' => 'territory_interior.png',
                            'image_3' => 'territory_hero.png',
                            'title_2' => 'Nội thất hai tông màu sang trọng & Bảng taplo kỹ thuật số kép',
                            'image_large' => 'territory_interior.png',
                            'image_large_2' => 'territory_interior.png',
                            'image_large_3' => 'territory_interior.png',
                            'title_3' => 'Hệ thống phanh khẩn cấp & Tự động lùi xe thông minh',
                            'split_image' => 'territory_hero.png',
                            'split_title' => 'Tiện nghi kết nối',
                            'split_features' => [
                                ['value' => '1.5L Ecoboost', 'label' => 'Động cơ xăng tăng áp tiết kiệm'],
                                ['value' => '7-Cấp ướt', 'label' => 'Hộp số ly hợp kép vận hành êm'],
                                ['value' => '12" + 12"', 'label' => 'Cặp màn hình hiển thị đỉnh cao'],
                                ['value' => 'Co-Pilot 360', 'label' => 'Gói an toàn chủ động cao cấp']
                            ]
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Các phiên bản Ford Territory 5 chỗ',
                            'descriptions' => [
                                'Territory Titanium X: Mẫu xe gia đình đô thị 5 chỗ sang trọng nhất với mâm 19 inch và ghế da cao cấp.',
                                'Territory Titanium: Sự cân bằng hoàn hảo giữa mức giá, công nghệ hiện đại và tiện nghi.',
                                'Territory Trend: Phiên bản tối ưu chi phí nhưng vẫn sở hữu động cơ mạnh mẽ và thiết kế cuốn hút.'
                            ]
                        ]
                    ],
                    [
                        'type' => 'AccordionFAQs',
                        'data' => [
                            'faqs' => [
                                ['q' => 'Khoảng sáng gầm xe Territory là bao nhiêu?', 'a' => 'Khoảng sáng gầm xe đạt 190 mm, giúp xe dễ dàng leo lề và đi qua các đoạn đường ngập nước nhẹ.', 'is_open' => true],
                                ['q' => 'Xe Territory dùng nhiên liệu gì?', 'a' => 'Xe sử dụng động cơ xăng tăng áp EcoBoost 1.5L, khuyến nghị sử dụng xăng RON 95.', 'is_open' => false]
                            ]
                        ]
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => 'Bắt đầu cuộc sống hiện đại cùng Ford Territory',
                            'phone' => '0918 90 90 60',
                            'btn_text' => 'Nhận báo giá chi tiết',
                            'btn_link' => '/lien-he?vehicle=ford-territory',
                            'car_image' => 'territory_hero.png'
                        ]
                    ]
                ]
            ],

            // FORD EVEREST
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => true,
                'base_price' => 1099000000,
                'image' => 'everest_hero.png',
                'image_thumbnail' => 'everest_thumbnail.png',
                'image_featured' => 'everest_featured.png',
                'images' => ['everest_hero.png', 'everest_hero.png', 'everest_platinum.png', 'everest_platinum.png', 'everest_platinum.png'],
                'images_360_external' => array_map(fn($i) => "uploads/vehicles/everest/360/trang/Everest-trang-$i.JPG", range(1, 19)),
                'images_360_internal' => array_map(fn($i) => "uploads/vehicles/everest/360/noi-that/Everest-xanh-noi-that-$i.JPG", range(1, 19)),
                'colors' => [
                    [
                        'name' => 'Trắng Tuyết',
                        'hex' => '#fafafa',
                        'image_path' => 'everest_hero.png',
                        'image_360_internal' => 'uploads/vehicles/everest/360/interior.jpg',
                        'images_360' => array_map(fn($i) => "uploads/vehicles/everest/360/trang/Everest-trang-$i.JPG", range(1, 19))
                    ],
                    [
                        'name' => 'Xanh Dương',
                        'hex' => '#1e3a8a',
                        'image_path' => 'everest_hero.png',
                        'images_360' => array_map(fn($i) => "uploads/vehicles/everest/360/xanh/Everest-xanh-$i.JPG", range(1, 13)),
                        'images_360_internal' => array_map(fn($i) => "uploads/vehicles/everest/360/noi-that/Everest-xanh-noi-that-$i.JPG", range(1, 19))
                    ],
                    ['name' => 'Đỏ Cam', 'hex' => '#c2410c', 'image_path' => 'everest_hero.png'],
                    ['name' => 'Xám Falcon', 'hex' => '#4b5563', 'image_path' => 'everest_hero.png'],
                    ['name' => 'Đen Bóng', 'hex' => '#000000', 'image_path' => 'everest_hero.png'],
                ],
                'vi' => [
                    'title' => 'FORD EVEREST',
                    'slug' => 'ford-everest',
                    'tagline' => 'Dấn bước. Dẫn đầu​.',
                    'description' => 'Được thiết kế để chinh phục mọi thử thách, Ford Everest thế hệ mới kết hợp khả năng vận hành mạnh mẽ ưu việt, nội thất sang trọng đỉnh cao và hệ thống an toàn thông minh bậc nhất.'
                ],
                'versions' => [
                    [
                        'price' => 1099000000,
                        'image' => 'everest_hero.png',
                        'specs' => [
                            'engine' => 'Single-Turbo Diesel 2.0L i4',
                            'power' => '170 Hp @ 3500 rpm',
                            'torque' => '405 Nm @ 1750-2500 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Một cầu sau (RWD)',
                            'dimensions' => '4.914 x 1.923 x 1.842 mm',
                            'clearance' => '200 mm',
                            'fuelEconomy' => '7.5 L/100km'
                        ],
                        'vi' => ['name' => 'Everest Active 2.0L Single-Turbo 6AT']
                    ],
                    [
                        'price' => 1178000000,
                        'image' => 'everest_hero.png',
                        'specs' => [
                            'engine' => 'Single-Turbo Diesel 2.0L i4',
                            'power' => '170 Hp @ 3500 rpm',
                            'torque' => '405 Nm @ 1750-2500 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Một cầu sau (RWD)',
                            'dimensions' => '4.914 x 1.923 x 1.842 mm',
                            'clearance' => '200 mm',
                            'fuelEconomy' => '7.6 L/100km'
                        ],
                        'vi' => ['name' => 'Everest Sport 2.0L Single-Turbo 6AT']
                    ],
                    [
                        'price' => 1399000000,
                        'image' => 'everest_platinum.png',
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp điện tử',
                            'drivetrain' => 'Một cầu sau (RWD)',
                            'dimensions' => '4.914 x 1.923 x 1.842 mm',
                            'clearance' => '200 mm',
                            'fuelEconomy' => '7.8 L/100km'
                        ],
                        'vi' => ['name' => 'Everest Platinum 2.0L Bi-Turbo 10AT 4x2']
                    ],
                    [
                        'price' => 1468000000,
                        'image' => 'everest_platinum.png',
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp điện tử',
                            'drivetrain' => 'Hai cầu chủ động (4WD)',
                            'dimensions' => '4.914 x 1.923 x 1.842 mm',
                            'clearance' => '200 mm',
                            'fuelEconomy' => '8.0 L/100km'
                        ],
                        'vi' => ['name' => 'Everest Platinum 2.0L Bi-Turbo 10AT 4x4']
                    ],
                    [
                        'price' => 1540000000,
                        'image' => 'everest_platinum.png',
                        'specs' => [
                            'engine' => '2.3L EcoBoost Xăng tăng áp',
                            'power' => '270 Hp @ 5500 rpm',
                            'torque' => '420 Nm @ 3000 rpm',
                            'transmission' => 'Tự động 10 cấp điện tử',
                            'drivetrain' => 'Hai cầu chủ động (4WD)',
                            'dimensions' => '4.914 x 1.923 x 1.842 mm',
                            'clearance' => '200 mm',
                            'fuelEconomy' => '9.2 L/100km'
                        ],
                        'vi' => ['name' => 'Everest Platinum 2.3L EcoBoost 10AT 4x4']
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'FORD EVEREST',
                            'tagline' => 'Dấn bước phiêu lưu. Khẳng định đẳng cấp.',
                            'button_text' => 'Khám phá ưu đãi',
                            'button_link' => '/lien-he?vehicle=ford-everest',
                            'background_image' => 'everest_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Đặc Quyền Sở Hữu Ford Everest',
                            'description' => 'Nhận ngay gói bảo hiểm thân vỏ 1 năm, thảm lót sàn da 5D cao cấp và hỗ trợ mua trả góp lên tới 80% giá trị xe.',
                            'image' => 'everest_hero.png',
                            'button_text' => 'Tư vấn chi tiết'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => 'Góc nhìn 360° Ford Everest',
                            'description' => 'Trải nghiệm vẻ ngoài bệ vệ, khỏe khoắn đặc trưng từ mọi góc nhìn và tùy biến màu sơn xe.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => 'Vẻ ngoài uy nghi, sang trọng phong cách Mỹ',
                            'image_1' => 'everest_hero.png',
                            'image_2' => 'everest_interior.png',
                            'image_3' => 'everest_hero.png',
                            'title_2' => 'Nội thất 3 hàng ghế bọc da cao cấp & Cửa sổ trời Panorama',
                            'image_large' => 'everest_interior.png',
                            'image_large_2' => 'everest_interior.png',
                            'image_large_3' => 'everest_interior.png',
                            'title_3' => 'Hệ thống dẫn động 4WD thông minh cùng 6 chế độ lái',
                            'split_image' => 'everest_hero.png',
                            'split_title' => 'Đẳng cấp offroad',
                            'split_features' => [
                                ['value' => 'Bi-Turbo 2.0L', 'label' => 'Động cơ Diesel hiệu năng cao'],
                                ['value' => 'Watts-Linkage', 'label' => 'Hệ thống treo sau êm ái vượt trội'],
                                ['value' => 'Panorama', 'label' => 'Cửa sổ trời toàn cảnh mở điện'],
                                ['value' => '6 Mode', 'label' => 'Địa hình linh hoạt tối ưu']
                            ]
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Lựa chọn phiên bản Ford Everest',
                            'descriptions' => [
                                'Everest Platinum: Phiên bản cao cấp nhất trang bị động cơ Bi-Turbo cực đại kết hợp nội thất sang trọng vượt bậc.',
                                'Everest Sport: Ngoại hình thể thao đen bóng cá tính cùng trang bị tối ưu hóa trải nghiệm lái năng động.',
                                'Everest Active: Đơn giản, đa dụng, giải pháp SUV gia đình 7 chỗ đích thực mang tính kinh tế cao.'
                            ]
                        ]
                    ],
                    [
                        'type' => 'AccordionFAQs',
                        'data' => [
                            'faqs' => [
                                ['q' => 'Everest Platinum sử dụng hệ dẫn động gì?', 'a' => 'Xe trang bị hệ dẫn động 2 cầu chủ động thông minh 4WD bán thời gian kết hợp khóa vi sai cầu sau.', 'is_open' => true],
                                ['q' => 'Xe 7 chỗ này có hàng ghế thứ 3 gập điện không?', 'a' => 'Hàng ghế thứ 3 trên Everest Platinum có hỗ trợ gập điện phẳng hoàn toàn bằng các nút bấm ở khoang cốp sau.', 'is_open' => false]
                            ]
                        ]
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => 'Kiến tạo hành trình tuyệt vời cùng Ford Everest',
                            'phone' => '0918 90 90 60',
                            'btn_text' => 'Đăng ký nhận báo giá lăn bánh',
                            'btn_link' => '/lien-he?vehicle=ford-everest',
                            'car_image' => 'everest_hero.png'
                        ]
                    ]
                ]
            ],

            // FORD RANGER
            [
                'category_id' => $catPickup->id,
                'type' => 'pickup',
                'is_best_seller' => true,
                'base_price' => 669000000,
                'image' => 'ranger_hero.png',
                'image_thumbnail' => 'ranger_thumbnail.png',
                'image_featured' => 'ranger_featured.png',
                'images' => ['ranger_hero.png', 'ranger_hero.png', 'ranger_wildtrak.png', 'ranger_wildtrak.png', 'ranger_raptor.png'],
                'colors' => [
                    ['name' => 'Cam Code Orange', 'hex' => '#ea580c', 'image_path' => 'ranger_hero.png'],
                    ['name' => 'Xám Meteor', 'hex' => '#4b5563', 'image_path' => 'ranger_hero.png'],
                    ['name' => 'Đen Tuyệt Đối', 'hex' => '#000000', 'image_path' => 'ranger_hero.png'],
                    ['name' => 'Trắng Bạch Kim', 'hex' => '#f8fafc', 'image_path' => 'ranger_hero.png'],
                ],
                'vi' => [
                    'title' => 'FORD RANGER',
                    'slug' => 'ford-ranger',
                    'tagline' => 'Vua bán tải chinh phục mọi nẻo đường.',
                    'description' => 'Thiết kế cơ bắp, dẫn đầu phân khúc bán tải với nhiều trang bị công nghệ cao và các tính năng hỗ trợ lái tối tân.'
                ],
                'versions' => [
                    [
                        'price' => 669000000,
                        'specs' => [
                            'engine' => 'Single-Turbo Diesel 2.0L i4',
                            'power' => '170 Hp @ 3500 rpm',
                            'torque' => '405 Nm @ 1750-2500 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Một cầu sau (4x2)',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '7.8 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger XLS 2.0L Single-Turbo 6AT 4x2']
                    ],
                    [
                        'price' => 779000000,
                        'specs' => [
                            'engine' => 'Single-Turbo Diesel 2.0L i4',
                            'power' => '170 Hp @ 3500 rpm',
                            'torque' => '405 Nm @ 1750-2500 rpm',
                            'transmission' => 'Tự động 6 cấp',
                            'drivetrain' => 'Hai cầu chủ động (4x4)',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '7.9 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger XLT 2.0L Single-Turbo 6AT 4x4']
                    ],
                    [
                        'price' => 979000000,
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp điện tử',
                            'drivetrain' => 'Hai cầu chủ động bán thời gian',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '8.0 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger Wildtrak 2.0L Bi-Turbo 10AT 4x4']
                    ],
                    [
                        'price' => 1039000000,
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp điện tử',
                            'drivetrain' => 'Hai cầu chủ động bán thời gian',
                            'dimensions' => '5.362 x 1.918 x 1.875 mm',
                            'clearance' => '235 mm',
                            'fuelEconomy' => '8.1 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger Stormtrak 2.0L Bi-Turbo 10AT 4x4']
                    ],
                    [
                        'price' => 1299000000,
                        'specs' => [
                            'engine' => 'Bi-Turbo Diesel 2.0L i4 Ford Performance',
                            'power' => '210 Hp @ 3750 rpm',
                            'torque' => '500 Nm @ 1750-2000 rpm',
                            'transmission' => 'Tự động 10 cấp điện tử',
                            'drivetrain' => 'Hai cầu chủ động bán thời gian thông minh',
                            'dimensions' => '5.381 x 2.028 x 1.922 mm',
                            'clearance' => '272 mm',
                            'fuelEconomy' => '8.9 L/100km'
                        ],
                        'vi' => ['name' => 'Ranger Raptor 2.0L Bi-Turbo 10AT 4x4']
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'FORD RANGER',
                            'tagline' => 'Vua bán tải - Bản lĩnh dẫn đầu.',
                            'button_text' => 'Đăng ký lái thử',
                            'button_link' => '/lien-he?vehicle=ford-ranger',
                            'background_image' => 'ranger_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Ưu Đãi Đặc Biệt Ford Ranger',
                            'description' => 'Tặng gói phụ kiện chính hãng, hỗ trợ lệ phí trước bạ lên đến 50% cùng chương trình vay trả góp lãi suất 6.9%.',
                            'image' => 'ranger_hero.png',
                            'button_text' => 'Nhận báo giá ngay'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => 'Trải nghiệm Ford Ranger 360°',
                            'description' => 'Khám phá ngoại thất hầm hố từ mọi góc nhìn và chọn màu sắc ngoại thất bạn yêu thích nhất.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => 'Thiết kế cơ bắp, dẫn đầu mọi địa hình',
                            'image_1' => 'ranger_hero.png',
                            'image_2' => 'ranger_interior.png',
                            'image_3' => 'ranger_hero.png',
                            'title_2' => 'Khoang lái sang trọng & Ghế bọc da chỉ khâu thể thao',
                            'image_large' => 'ranger_interior.png',
                            'image_large_2' => 'ranger_interior.png',
                            'image_large_3' => 'ranger_interior.png',
                            'title_3' => 'Động cơ cực đại Bi-Turbo & 10 cấp số tự động',
                            'split_image' => 'ranger_hero.png',
                            'split_title' => 'Hiệu năng vượt trội',
                            'split_features' => [
                                ['value' => 'Bi-Turbo 2.0L', 'label' => 'Động cơ Diesel thế hệ mới'],
                                ['value' => '210 mã lực', 'label' => 'Sức mạnh cực đại tối ưu'],
                                ['value' => '10-Cấp số', 'label' => 'Tự động mượt mà tiết kiệm'],
                                ['value' => '6 Chế độ lái', 'label' => 'Quản lý địa hình thông minh']
                            ]
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Phiên bản bán tải tối tân của Ford',
                            'descriptions' => [
                                'Ranger Raptor: Chiến binh hiệu năng cao với hệ thống treo Fox đỉnh cao và chế độ chạy sa mạc Baja.',
                                'Ranger Wildtrak/Stormtrak: Sự kết hợp hoàn mỹ giữa độ đa dụng của bán tải và trang bị sang trọng bậc nhất.',
                                'Ranger XLS/XLT: Người bạn đồng hành bền bỉ đáp ứng trọn vẹn nhu cầu công việc hàng ngày.'
                            ]
                        ]
                    ],
                    [
                        'type' => 'AccordionFAQs',
                        'data' => [
                            'faqs' => [
                                ['q' => 'Mức tiêu hao nhiên liệu của Ranger Wildtrak là bao nhiêu?', 'a' => 'Mức tiêu hao nhiên liệu thực tế dao động từ 7.6 - 8.2 lít/100km tùy cung đường và tải trọng.', 'is_open' => true],
                                ['q' => 'Xe bán tải Ranger có niên hạn sử dụng không?', 'a' => 'Theo quy định hiện hành tại Việt Nam, xe bán tải Ranger có niên hạn sử dụng là 25 năm.', 'is_open' => false]
                            ]
                        ]
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => 'Khởi đầu hành trình mới cùng Ford Ranger',
                            'phone' => '0918 90 90 60',
                            'btn_text' => 'Liên hệ đặt lái thử',
                            'btn_link' => '/lien-he?vehicle=ford-ranger',
                            'car_image' => 'ranger_hero.png'
                        ]
                    ]
                ]
            ],

            // FORD TRANSIT
            [
                'category_id' => $catCommercial->id,
                'type' => 'commercial',
                'is_best_seller' => false,
                'base_price' => 905000000,
                'image' => 'transit_hero.png',
                'image_thumbnail' => 'transit_hero.png',
                'image_featured' => 'transit_hero.png',
                'images' => ['transit_hero.png', 'transit_premium.png', 'transit_premium.png'],
                'colors' => [
                    ['name' => 'Bạc Tinh Thể', 'hex' => '#cbd5e1', 'image_path' => 'transit_hero.png'],
                    ['name' => 'Trắng Kim Cương', 'hex' => '#ffffff', 'image_path' => 'transit_hero.png'],
                ],
                'vi' => [
                    'title' => 'FORD TRANSIT',
                    'slug' => 'ford-transit-2024',
                    'tagline' => 'Giải pháp vận chuyển hành khách chuyên nghiệp.',
                    'description' => 'Ford Transit Thế hệ Mới được thiết kế tối ưu với không gian rộng rãi hơn, tiện nghi vượt trội cùng độ bền bỉ cao, giúp tối đa hóa hiệu quả kinh doanh của doanh nghiệp.'
                ],
                'versions' => [
                    [
                        'price' => 905000000,
                        'specs' => [
                            'engine' => 'Turbo Diesel 2.2L TDCi',
                            'power' => '135 Hp @ 3750 rpm',
                            'torque' => '375 Nm @ 1500-2500 rpm',
                            'transmission' => 'Số sàn 6 cấp',
                            'drivetrain' => 'Cầu sau (RWD)',
                            'dimensions' => '5.981 x 2.059 x 2.481 mm',
                            'clearance' => '165 mm',
                            'fuelEconomy' => '8.5 L/100km'
                        ],
                        'vi' => ['name' => 'Transit Trend 2.2L TDCi 6MT']
                    ],
                    [
                        'price' => 949000000,
                        'specs' => [
                            'engine' => 'Turbo Diesel 2.2L TDCi',
                            'power' => '135 Hp @ 3750 rpm',
                            'torque' => '375 Nm @ 1500-2500 rpm',
                            'transmission' => 'Số sàn 6 cấp',
                            'drivetrain' => 'Cầu sau (RWD)',
                            'dimensions' => '5.981 x 2.059 x 2.481 mm',
                            'clearance' => '165 mm',
                            'fuelEconomy' => '8.6 L/100km'
                        ],
                        'vi' => ['name' => 'Transit Premium 16S 2.2L TDCi 6MT']
                    ],
                    [
                        'price' => 1087000000,
                        'specs' => [
                            'engine' => 'Turbo Diesel 2.2L TDCi',
                            'power' => '135 Hp @ 3750 rpm',
                            'torque' => '375 Nm @ 1500-2500 rpm',
                            'transmission' => 'Số sàn 6 cấp',
                            'drivetrain' => 'Cầu sau (RWD)',
                            'dimensions' => '6.081 x 2.059 x 2.581 mm',
                            'clearance' => '165 mm',
                            'fuelEconomy' => '9.0 L/100km'
                        ],
                        'vi' => ['name' => 'Transit Premium 18S 2.2L TDCi 6MT']
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'FORD TRANSIT',
                            'tagline' => 'Giải pháp vận chuyển hành khách cao cấp cho doanh nghiệp.',
                            'button_text' => 'Báo giá theo dự án',
                            'button_link' => '/lien-he?vehicle=ford-transit-2024',
                            'background_image' => 'transit_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Ưu Đãi Lô & Dự Án Ford Transit',
                            'description' => 'Hỗ trợ đặc biệt chi phí lăn bánh cho doanh nghiệp vận tải, tặng thẻ xăng và gói bảo dưỡng xe định kỳ.',
                            'image' => 'transit_hero.png',
                            'button_text' => 'Tư vấn doanh nghiệp'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => 'Khám phá Transit góc nhìn 360°',
                            'description' => 'Trải nghiệm không gian nội thất tiện nghi 16 chỗ cùng thiết kế ngoại thất vuông vắn, thực dụng từ mọi góc nhìn.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => 'Diện mạo chuyên nghiệp, thiết kế tối ưu vận tải',
                            'image_1' => 'transit_hero.png',
                            'image_2' => 'transit_hero.png',
                            'image_3' => 'transit_hero.png',
                            'title_2' => 'Không gian hành khách rộng rãi & Bậc lên xuống tự động',
                            'image_large' => 'transit_hero.png',
                            'image_large_2' => 'transit_hero.png',
                            'image_large_3' => 'transit_hero.png',
                            'title_3' => 'Động cơ Turbo Diesel 2.2L TDCi mạnh mẽ và bền bỉ',
                            'split_image' => 'transit_hero.png',
                            'split_title' => 'Tối ưu kinh doanh',
                            'split_features' => [
                                ['value' => '2.2L TDCi', 'label' => 'Động cơ dầu tăng áp bền bỉ'],
                                ['value' => 'Số sàn 6 cấp', 'label' => 'Vận hành êm ái, chủ động'],
                                ['value' => '16 - 18 Chỗ', 'label' => 'Cấu hình ghế ngồi linh hoạt'],
                                ['value' => 'Cửa trượt điện', 'label' => 'Tiện ích bậc bước chân tự động']
                            ]
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Các phiên bản Ford Transit thế hệ mới',
                            'descriptions' => [
                                'Transit Premium: Ghế ngồi bọc da cao cấp, trang bị cửa trượt điện và màn hình giải trí trung tâm.',
                                'Transit Trend: Phiên bản vận tải 16 chỗ tối ưu chi phí, bền bỉ và rộng rãi.'
                            ]
                        ]
                    ],
                    [
                        'type' => 'AccordionFAQs',
                        'data' => [
                            'faqs' => [
                                ['q' => 'Ford Transit Thế hệ mới có mấy phiên bản?', 'a' => 'Transit hiện được phân phối với các phiên bản: Trend (16 chỗ), Premium (16 chỗ) và Premium (18 chỗ), đáp ứng đa dạng nhu cầu vận tải.', 'is_open' => true],
                                ['q' => 'Chương trình ưu đãi cho khách hàng mua lô (Fleet) thế nào?', 'a' => 'Đồng Nai Ford có chính sách chiết khấu giá đặc biệt, tặng gói bảo dưỡng dài hạn và hỗ trợ hoàn tất thủ tục đăng ký biển số kinh doanh vận tải nhanh chóng cho doanh nghiệp.', 'is_open' => false]
                            ]
                        ]
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => 'Tối ưu hóa lợi nhuận kinh doanh cùng Ford Transit',
                            'phone' => '0918 90 90 60',
                            'btn_text' => 'Yêu cầu báo giá lô dự án',
                            'btn_link' => '/lien-he?vehicle=ford-transit-2024',
                            'car_image' => 'transit_hero.png'
                        ]
                    ]
                ]
            ],

            // FORD MUSTANG
            [
                'category_id' => $catSUV->id, // Mapped to SUV for showcase compatibility
                'type' => 'suv', // Mapped to suv for display group compatibility
                'is_best_seller' => true,
                'base_price' => 1150000000,
                'image' => 'mustang_hero.png',
                'image_thumbnail' => 'mustang_hero.png',
                'image_featured' => 'mustang_hero.png',
                'images' => ['mustang_hero.png', 'mustang_hero.png', 'mustang_hero.png', 'mustang_hero.png', 'mustang_dark_horse.png'],
                'images_360_external' => array_map(fn($i) => "uploads/vehicles/mustang/360/exterior/adriatic-blue-green/00{$i}-adriatic-blue-green-64f.jpeg", range(1, 28)),
                'images_360_internal' => array_merge(
                    array_map(fn($i) => "uploads/vehicles/mustang/360/interior/00{$i}-black-onyx.jpeg", range(1, 36)),
                    array_map(fn($i) => "uploads/vehicles/mustang/360/interior/00{$i}-space-gray.jpeg", range(1, 36))
                ),
                'image_360_internal_url' => "uploads/vehicles/mustang/360/interior/001-black-onyx.jpeg",
                'colors' => array_map(function($c) {
                    $colorId = $c['color_id'];
                    $images360 = [];
                    for ($i = 1; $i <= 28; $i++) {
                        $images360[] = "uploads/vehicles/mustang/360/exterior/{$colorId}/00{$i}-{$colorId}-64f.jpeg";
                    }
                    return [
                        'name' => $c['name'],
                        'hex' => $c['hex'],
                        'image_path' => 'mustang_hero.png',
                        'images_360' => $images360,
                        'image_360_internal' => 'uploads/vehicles/mustang/360/interior/001-black-onyx.jpeg'
                    ];
                }, [
                    ['color_id' => 'adriatic-blue-green', 'name' => 'Adriatic Blue Metallic', 'hex' => '#15444c'],
                    ['color_id' => 'orange-fury', 'name' => 'Orange Fury Metallic', 'hex' => '#ff7e00'],
                    ['color_id' => 'avalanche-gray', 'name' => 'Avalanche Gray', 'hex' => '#dadbce'],
                    ['color_id' => 'shadow-black', 'name' => 'Shadow Black', 'hex' => '#10101d'],
                    ['color_id' => 'carbonized-gray', 'name' => 'Carbonized Gray', 'hex' => '#8c8989'],
                    ['color_id' => 'vapor-blue', 'name' => 'Vapor Blue Metallic', 'hex' => '#424e5a'],
                    ['color_id' => 'molten-magenta', 'name' => 'Molten Magenta Metallic', 'hex' => '#850034'],
                    ['color_id' => 'race-red', 'name' => 'Race Red', 'hex' => '#d50f00'],
                    ['color_id' => 'oxford-white', 'name' => 'Oxford White', 'hex' => '#e4e2e5'],
                ]),
                'vi' => [
                    'title' => 'FORD MUSTANG',
                    'slug' => 'mustang-fastback',
                    'tagline' => 'Biểu tượng xe cơ bắp Mỹ thế hệ mới.',
                    'description' => 'Trải nghiệm sức mạnh huyền thoại từ khối động cơ Coyote V8 kết hợp với thiết kế đột phá và khoang lái kỹ thuật số tối tân hướng trọn về người lái.'
                ],
                'versions' => [
                    [
                        'price' => 1150000000,
                        'specs' => [
                            'engine' => '2.3L EcoBoost® I4 tăng áp',
                            'power' => '315 Hp @ 5500 rpm',
                            'torque' => '475 Nm @ 3000 rpm',
                            'transmission' => 'Tự động 10 cấp SelectShift®',
                            'drivetrain' => 'Cầu sau (RWD)',
                            'dimensions' => '4.811 x 1.915 x 1.397 mm',
                            'clearance' => '140 mm',
                            'fuelEconomy' => '9.5 L/100km'
                        ],
                        'vi' => ['name' => 'Mustang® EcoBoost® Fastback']
                    ],
                    [
                        'price' => 1350000000,
                        'specs' => [
                            'engine' => '2.3L EcoBoost® I4 tăng áp',
                            'power' => '315 Hp @ 5500 rpm',
                            'torque' => '475 Nm @ 3000 rpm',
                            'transmission' => 'Tự động 10 cấp SelectShift®',
                            'drivetrain' => 'Cầu sau (RWD)',
                            'dimensions' => '4.811 x 1.915 x 1.397 mm',
                            'clearance' => '140 mm',
                            'fuelEconomy' => '9.5 L/100km'
                        ],
                        'vi' => ['name' => 'Mustang® EcoBoost® Premium Fastback']
                    ],
                    [
                        'price' => 1850000000,
                        'specs' => [
                            'engine' => '5.0L Coyote V8 thế hệ thứ 4',
                            'power' => '480 Hp @ 7150 rpm',
                            'torque' => '563 Nm @ 4900 rpm',
                            'transmission' => 'Số sàn 6 cấp hoặc 10 cấp SelectShift®',
                            'drivetrain' => 'Cầu sau (RWD)',
                            'dimensions' => '4.811 x 1.915 x 1.397 mm',
                            'clearance' => '140 mm',
                            'fuelEconomy' => '11.8 L/100km'
                        ],
                        'vi' => ['name' => 'Mustang® GT Fastback']
                    ],
                    [
                        'price' => 2150000000,
                        'specs' => [
                            'engine' => '5.0L Coyote V8 thế hệ thứ 4',
                            'power' => '480 Hp @ 7150 rpm',
                            'torque' => '563 Nm @ 4900 rpm',
                            'transmission' => 'Số sàn 6 cấp hoặc 10 cấp SelectShift®',
                            'drivetrain' => 'Cầu sau (RWD)',
                            'dimensions' => '4.811 x 1.915 x 1.397 mm',
                            'clearance' => '140 mm',
                            'fuelEconomy' => '11.8 L/100km'
                        ],
                        'vi' => ['name' => 'Mustang® GT Premium Fastback']
                    ],
                    [
                        'price' => 2950000000,
                        'specs' => [
                            'engine' => '5.0L Coyote V8 hiệu năng cao',
                            'power' => '500 Hp @ 7250 rpm',
                            'torque' => '567 Nm @ 4900 rpm',
                            'transmission' => 'Số sàn 6 cấp TREMEC® hoặc 10 cấp SelectShift®',
                            'drivetrain' => 'Cầu sau (RWD)',
                            'dimensions' => '4.817 x 1.915 x 1.397 mm',
                            'clearance' => '135 mm',
                            'fuelEconomy' => '12.5 L/100km'
                        ],
                        'vi' => ['name' => 'Mustang® Dark Horse®']
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'FORD MUSTANG',
                            'tagline' => 'Trải nghiệm sức mạnh huyền thoại xe cơ bắp Mỹ.',
                            'button_text' => 'Tư vấn đặc quyền',
                            'button_link' => '/lien-he?vehicle=mustang-fastback',
                            'background_image' => 'mustang_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Đặc Quyền Sở Hữu Biểu Tượng Mustang',
                            'description' => 'Tặng gói phủ Ceramic cao cấp bảo vệ nước sơn độc quyền, hỗ trợ giao xe tận nhà bằng xe chuyên dụng và quà lưu niệm Mustang đặc quyền.',
                            'image' => 'mustang_hero.png',
                            'button_text' => 'Đăng ký tư vấn'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => 'Trải nghiệm Mustang 360°',
                            'description' => 'Tự do xoay 360 độ để chiêm ngưỡng thiết kế fastback thể thao, tùy chỉnh các màu sơn ngoại thất và đổi kiểu mâm xe.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => 'Thiết kế cơ bắp, thể thao phóng khoáng đầy kiêu hãnh',
                            'image_1' => 'mustang_hero.png',
                            'image_2' => 'mustang_hero.png',
                            'image_3' => 'mustang_hero.png',
                            'title_2' => 'Buồng lái kỹ thuật số lấy cảm hứng từ máy bay chiến đấu phản lực',
                            'image_large' => 'mustang_hero.png',
                            'image_large_2' => 'mustang_hero.png',
                            'image_large_3' => 'mustang_hero.png',
                            'title_3' => 'Động cơ Coyote V8 5.0L thế hệ thứ 4 mạnh mẽ vượt bậc',
                            'split_image' => 'mustang_hero.png',
                            'split_title' => 'Trải nghiệm phấn khích',
                            'split_features' => [
                                ['value' => 'Coyote V8 5.0L', 'label' => 'Động cơ hút khí tự nhiên uy lực'],
                                ['value' => '10-Cấp số', 'label' => 'Hộp số tự động SelectShift cực nhanh'],
                                ['value' => '12.4" + 13.2"', 'label' => 'Màn hình cong đôi siêu sắc nét'],
                                ['value' => 'Active Exhaust', 'label' => 'Hệ thống xả van chủ động thể thao']
                            ]
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Các phiên bản Ford Mustang Fastback',
                            'descriptions' => [
                                'Mustang Dark Horse: Sức mạnh cực đại Coyote V8 cùng trang bị trường đua chuyên dụng.',
                                'Mustang GT: Động cơ 5.0L truyền thống đầy phấn khích.',
                                'Mustang EcoBoost: Giải pháp thể thao thời thượng và tiết kiệm nhiên liệu.'
                            ]
                        ]
                    ],
                    [
                        'type' => 'AccordionFAQs',
                        'data' => [
                            'faqs' => [
                                ['q' => 'Động cơ Coyote V8 5.0L trên bản GT mạnh cỡ nào?', 'a' => 'Động cơ Coyote V8 thế hệ thứ 4 cho công suất tối đa 480 mã lực và mô-men xoắn cực đại 563 Nm, đem lại khả năng tăng tốc vô cùng uy lực.', 'is_open' => true],
                                ['q' => 'Hệ thống màn hình kép trên Mustang có gì đặc biệt?', 'a' => 'Hệ thống gồm màn hình kỹ thuật số cụm đồng hồ 12.4 inch và màn hình cảm ứng trung tâm 13.2 inch đặt nghiêng hướng về người lái, chạy hệ điều hành SYNC 4 hiện đại nhất.', 'is_open' => false]
                            ]
                        ]
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => 'Khẳng định phong cách riêng cùng Ford Mustang',
                            'phone' => '0918 90 90 60',
                            'btn_text' => 'Liên hệ tư vấn VIP',
                            'btn_link' => '/lien-he?vehicle=mustang-fastback',
                            'car_image' => 'mustang_hero.png'
                        ]
                    ]
                ]
            ],

            // FORD MUSTANG MACH-E
            [
                'category_id' => $catSUV->id,
                'type' => 'suv',
                'is_best_seller' => false,
                'base_price' => 1699000000,
                'image' => 'mach_e_hero.png',
                'image_thumbnail' => 'mach_e_hero.png',
                'image_featured' => 'mach_e_hero.png',
                'images' => ['mach_e_hero.png', 'mach_e_hero.png'],
                'colors' => [
                    ['name' => 'Xanh Lucid', 'hex' => '#0b3c5d', 'image_path' => 'mach_e_hero.png'],
                    ['name' => 'Đỏ Rapid', 'hex' => '#b22222', 'image_path' => 'mach_e_hero.png'],
                    ['name' => 'Đen Shadow', 'hex' => '#0a0a0a', 'image_path' => 'mach_e_hero.png']
                ],
                'vi' => [
                    'title' => 'FORD MUSTANG MACH-E',
                    'slug' => 'new-mustang-mach-e',
                    'tagline' => 'Tương lai của hiệu năng và phong cách.',
                    'description' => 'Dòng SUV thuần điện đầu tiên lấy cảm hứng từ biểu tượng xe cơ bắp Mỹ Mustang. Khả năng tăng tốc vượt trội và thiết kế khí động học tương lai.'
                ],
                'versions' => [
                    [
                        'price' => 1699000000,
                        'specs' => [
                            'engine' => 'Động cơ điện Dual-Motor',
                            'power' => '346 Hp / 258 kW',
                            'torque' => '580 Nm',
                            'transmission' => 'Một cấp tự động',
                            'drivetrain' => 'Hai cầu toàn thời gian (AWD)',
                            'dimensions' => '4.713 x 1.881 x 1.597 mm',
                            'clearance' => '147 mm',
                            'fuelEconomy' => '18.7 kWh/100km'
                        ],
                        'vi' => ['name' => 'Mustang Mach-E Premium AWD']
                    ]
                ],
                'layout_blocks' => [
                    [
                        'type' => 'HeroBanner',
                        'data' => [
                            'title' => 'MUSTANG MACH-E',
                            'tagline' => 'SUV thuần điện mang dòng máu Mustang.',
                            'button_text' => 'Tìm hiểu công nghệ điện',
                            'button_link' => '/lien-he?vehicle=new-mustang-mach-e',
                            'background_image' => 'mach_e_hero.png'
                        ]
                    ],
                    [
                        'type' => 'Promotions',
                        'data' => [
                            'title' => 'Ưu Đãi Đặc Quyền Xe Điện Mach-E',
                            'description' => 'Tặng ngay bộ sạc Wallbox chính hãng 7.4 kW, hỗ trợ chi phí lắp đặt tại nhà và bảo hành pin đặc biệt lên đến 8 năm.',
                            'image' => 'mach_e_hero.png',
                            'button_text' => 'Liên hệ tư vấn sạc'
                        ]
                    ],
                    [
                        'type' => 'ThreeSixtyViewer',
                        'data' => [
                            'title' => 'Khám phá Mach-E góc nhìn 360°',
                            'description' => 'Cảm nhận thiết kế SUV lai Coupe khí động học đỉnh cao, các đường gân nổi mạnh mẽ và chọn màu sắc ngoại thất thời thượng.'
                        ]
                    ],
                    [
                        'type' => 'FeaturesGrid',
                        'data' => [
                            'title_1' => 'Kiến trúc xe điện thể thao lai Coupe độc đáo',
                            'image_1' => 'mach_e_hero.png',
                            'image_2' => 'mach_e_hero.png',
                            'image_3' => 'mach_e_hero.png',
                            'title_2' => 'Màn hình cảm ứng đặt dọc 15.5 inch điều khiển tối giản',
                            'image_large' => 'mach_e_hero.png',
                            'image_large_2' => 'mach_e_hero.png',
                            'image_large_3' => 'mach_e_hero.png',
                            'title_3' => 'Hệ dẫn động 2 cầu AWD cùng động cơ điện Dual-Motor vượt trội',
                            'split_image' => 'mach_e_hero.png',
                            'split_title' => 'Tương lai xanh',
                            'split_features' => [
                                ['value' => 'Dual-Motor', 'label' => 'Động cơ điện đôi AWD mạnh mẽ'],
                                ['value' => '346 mã lực', 'label' => 'Khả năng tăng tốc tức thì ấn tượng'],
                                ['value' => '15.5 inch', 'label' => 'Màn hình trung tâm điều khiển SYNC 4A'],
                                ['value' => 'B&O 10 Loa', 'label' => 'Hệ thống âm thanh rạp hát đỉnh cao']
                            ]
                        ]
                    ],
                    [
                        'type' => 'VersionsGrid',
                        'data' => [
                            'title' => 'Dòng SUV điện thể thao',
                            'descriptions' => [
                                'Mustang Mach-E Premium: Vận hành bền bỉ kết hợp hệ dẫn động 2 cầu toàn thời gian thông minh.'
                            ]
                        ]
                    ],
                    [
                        'type' => 'AccordionFAQs',
                        'data' => [
                            'faqs' => [
                                ['q' => 'Thời gian sạc của Mustang Mach-E là bao lâu?', 'a' => 'Với bộ sạc nhanh DC, xe có thể sạc từ 10% lên 80% chỉ trong khoảng 45 phút. Bộ sạc Wallbox tại nhà 7.4 kW sạc đầy pin qua đêm trong khoảng 8-10 tiếng.', 'is_open' => true],
                                ['q' => 'Quãng đường di chuyển tối đa của Mach-E là bao nhiêu?', 'a' => 'Phiên bản Premium AWD có khả năng di chuyển quãng đường tối đa lên đến hơn 450 km (theo chuẩn WLTP) sau một lần sạc đầy.', 'is_open' => false]
                            ]
                        ]
                    ],
                    [
                        'type' => 'BookingBanner',
                        'data' => [
                            'title' => 'Chinh phục kỷ nguyên điện cùng Mustang Mach-E',
                            'phone' => '0918 90 90 60',
                            'btn_text' => 'Đặt lịch lái thử xe điện',
                            'btn_link' => '/lien-he?vehicle=new-mustang-mach-e',
                            'car_image' => 'mach_e_hero.png'
                        ]
                    ]
                ]
            ]
        ];

        // Seed vehicles
        foreach ($vehiclesData as $index => $vData) {
            $vData = $this->transformPaths($vData);
            $v = new Vehicle([
                'type'            => $vData['type'],
                'is_best_seller'  => $vData['is_best_seller'],
                'base_price'      => $vData['base_price'],
                'image'           => ['path' => $vData['image']],
                'image_thumbnail' => isset($vData['image_thumbnail']) ? ['path' => $vData['image_thumbnail']] : null,
                'image_featured'  => isset($vData['image_featured'])  ? ['path' => $vData['image_featured']]  : null,
                'images'          => array_map(fn($p) => ['path' => $p], $vData['images']),
                'colors'          => $vData['colors'],
                'images_360_external' => isset($vData['images_360_external']) ? array_map(fn($p) => ['path' => $p], $vData['images_360_external']) : null,
                'images_360_internal' => isset($vData['images_360_internal']) ? array_map(fn($p) => ['path' => $p], $vData['images_360_internal']) : null,
                'image_360_internal_url' => $vData['image_360_internal_url'] ?? null,
                'layout_blocks'   => $vData['layout_blocks'],
                'status'          => 'ACTIVE',
                'sort_order'      => $index + 1
            ]);
            $v->fill(['vi' => $vData['vi']]);
            $v->save();

            if (isset($vData['category_id'])) {
                $v->categories()->sync([$vData['category_id']]);
            }

            // Seed version
            foreach ($vData['versions'] as $vVerData) {
                $vVer = new VehicleVersion([
                    'vehicle_id' => $v->id,
                    'price' => $vVerData['price'],
                    'specs' => $vVerData['specs'],
                    'image' => isset($vVerData['image']) ? ['path' => $vVerData['image']] : null,
                    'status' => 'ACTIVE',
                    'sort_order' => 0
                ]);
                $vVer->fill(['vi' => $vVerData['vi']]);
                $vVer->save();
            }
        }

        $this->command->info('✅ Successfully seeded ' . count($vehiclesData) . ' Ford DNF vehicles & versions with dynamic blocks');

        // 3. CẤU HÌNH PHÍ LĂN BÁNH (Registration Fees)
        $regions = Region::where('level', 1)->get();
        if ($regions->isEmpty()) {
            $rDongNai = Region::firstOrCreate(['code' => '48'], [
                'country_id' => 1,
                'level' => 1,
                'name' => 'Đồng Nai',
                'name_with_type' => 'Tỉnh Đồng Nai'
            ]);
            $regions = collect([$rDongNai]);
        }

        foreach ($regions as $region) {
            $taxPercent = ($region->name == 'Hà Nội' || $region->name == 'Hồ Chí Minh') ? 12.00 : 10.00;
            $plateFee = ($region->name == 'Hà Nội' || $region->name == 'Hồ Chí Minh') ? 20000000 : 1000000;
            
            RegistrationFee::firstOrCreate(
                ['region_id' => $region->id],
                [
                    'registration_tax_percent' => $taxPercent,
                    'license_plate_fee' => $plateFee,
                    'inspection_fee' => 340000,
                    'road_maintenance_fee' => 1560000,
                    'civil_insurance_fee' => 480700,
                    'service_fee' => 2000000,
                ]
            );
        }

        $this->command->info('✅ Registration fees configured');

        // 4. BANNERS (Banners)
        $banners = [
            [
                'title'       => 'Ford Ranger Wildtrak Mới',
                'subtitle'    => 'Bản lĩnh dẫn đầu phân khúc bán tải​',
                'button_text' => 'Khám phá ngay',
                'button_link' => '/san-pham/ford-ranger',
                'location'    => ['homepage'],
                'image'       => ['path' => 'ranger_hero.png'],
                'sort_order'  => 1,
            ],
            [
                'title'       => 'Khuyến Mãi Đặc Biệt',
                'subtitle'    => 'Ưu Đãi Lệ Phí Trước Bạ & Quà Tặng Cho Khách Hàng Biên Hòa',
                'button_text' => 'Nhận ưu đãi',
                'button_link' => '/lien-he?reason=Nhận%20chương%20trình%20ưu%20đãi',
                'location'    => ['homepage', 'homepage_hero'],
                'image'       => ['path' => 'assets/img-gradient-2.png'],
                'sort_order'  => 2,
            ],
            [
                'title'       => 'Ford Everest Mới',
                'subtitle'    => 'Dấn bước phiêu lưu - Đỉnh cao SUV 7 chỗ​',
                'button_text' => 'Đăng ký lái thử',
                'button_link' => '/lien-he?reason=Đăng%20ký%20lái%20thử&vehicle=ford-everest',
                'location'    => ['homepage'],
                'image'       => ['path' => 'everest_hero.png'],
                'sort_order'  => 3,
            ],
        ];

        foreach ($banners as $b) {
            $b = $this->transformPaths($b);
            Banner::create([
                'title' => $b['title'],
                'subtitle' => $b['subtitle'],
                'button_text' => $b['button_text'],
                'button_link' => $b['button_link'],
                'location' => $b['location'],
                'image' => $b['image'],
                'status' => 'ACTIVE',
                'sort_order' => $b['sort_order']
            ]);
        }

        $this->command->info('✅ Banners created');

        // 5. ĐỘI NGŨ TƯ VẤN BÁN HÀNG (Sales Consultants)
        $consultants = [
            [
                'name' => 'Nguyễn Minh Tuấn',
                'job_title' => 'Trưởng nhóm kinh doanh',
                'department' => 'Phòng Kinh Doanh',
                'phone' => '0901234567',
                'email' => 'tuan.nm@dongnaiford.com.vn',
                'facebook_url' => 'https://facebook.com/tuanford',
                'zalo_url' => 'https://zalo.me/0901234567',
                'sort_order' => 1,
            ],
            [
                'name' => 'Trần Thị Thảo',
                'job_title' => 'Tư vấn bán hàng cao cấp',
                'department' => 'Phòng Kinh Doanh',
                'phone' => '0909876543',
                'email' => 'thao.tt@dongnaiford.com.vn',
                'facebook_url' => 'https://facebook.com/thaoford',
                'zalo_url' => 'https://zalo.me/0909876543',
                'sort_order' => 2,
            ]
        ];

        foreach ($consultants as $sc) {
            $consultant = new SalesConsultant([
                'department' => $sc['department'],
                'phone' => $sc['phone'],
                'email' => $sc['email'],
                'facebook_url' => $sc['facebook_url'],
                'zalo_url' => $sc['zalo_url'],
                'status' => 'ACTIVE',
                'sort_order' => $sc['sort_order']
            ]);
            $consultant->fill([
                'vi' => [
                    'name' => $sc['name'],
                    'job_title' => $sc['job_title'],
                    'slug' => str($sc['name'])->slug()
                ]
            ]);
            $consultant->save();
        }

        $this->command->info('✅ Sales consultants created');

        // 6. Ý KIẾN KHÁCH HÀNG (Customer Reviews)
        $everestDb = Vehicle::whereTranslation('slug', 'ford-everest')->first() ?? Vehicle::first();
        $territoryDb = Vehicle::whereTranslation('slug', 'ford-territory')->first() ?? Vehicle::first();
        $rangerDb = Vehicle::whereTranslation('slug', 'ford-ranger')->first() ?? Vehicle::first();
        $transitDb = Vehicle::whereTranslation('slug', 'ford-transit-2024')->first() ?? Vehicle::first();
        $mustangDb = Vehicle::whereTranslation('slug', 'mustang-fastback')->first() ?? Vehicle::first();
        $machEDb = Vehicle::whereTranslation('slug', 'new-mustang-mach-e')->first() ?? Vehicle::first();

        $reviews = [
            [
                'customer_name' => 'Anh Hoàng Bách (Biên Hòa)',
                'content' => 'Rất hài lòng với chiếc Ford Everest mới mua tại đại lý. Nhân viên tư vấn nhiệt tình, làm thủ tục đăng ký biển số và dự toán chi phí lăn bánh cực nhanh gọn, giao xe đúng hẹn.',
                'rating' => 5,
                'vehicle_id' => $everestDb ? $everestDb->id : null
            ],
            [
                'customer_name' => 'Chị Phương Vy (Long Thành)',
                'content' => 'Gia đình mình mua chiếc Territory để đi lại trong phố. Xe 5 chỗ cabin rộng rãi, thiết kế đẹp và nhiều công nghệ hiện đại. Cảm ơn đội ngũ Đồng Nai Ford.',
                'rating' => 5,
                'vehicle_id' => $territoryDb ? $territoryDb->id : null
            ],
            [
                'customer_name' => 'Anh Quốc Bảo (Biên Hòa)',
                'content' => 'Tôi mua chiếc Ford Ranger Wildtrak phục vụ cho công việc đi công trình. Xe gầm cao, máy dầu Bi-Turbo cực kỳ khỏe và tiết kiệm nhiên liệu. Chở đồ hay đi đèo dốc đều vô cùng an tâm.',
                'rating' => 5,
                'vehicle_id' => $rangerDb ? $rangerDb->id : null
            ],
            [
                'customer_name' => 'Chị Minh Thư (Nhơn Trạch)',
                'content' => 'Gia đình rất ưng ý chiếc Territory Titanium X. Cửa sổ trời toàn cảnh panorama siêu rộng làm bọn trẻ nhà mình rất thích thú. Khoang hành lý rộng rãi tha hồ đựng đồ dã ngoại.',
                'rating' => 5,
                'vehicle_id' => $territoryDb ? $territoryDb->id : null
            ],
            [
                'customer_name' => 'Anh Hữu Đạt (Long Khánh)',
                'content' => 'Quyết định lên đời Everest Platinum là hoàn toàn đúng đắn. Xe cách âm tốt vượt trội so với các đối thủ cùng phân khúc, chạy cao tốc Biên Hòa - Vũng Tàu đầm chắc và an toàn.',
                'rating' => 5,
                'vehicle_id' => $everestDb ? $everestDb->id : null
            ],
            [
                'customer_name' => 'Anh Minh Trí (Biên Hòa)',
                'content' => 'Công ty vận tải của tôi vừa mua thêm 2 chiếc Transit Premium 18S chạy tuyến sân bay. Khách đi xe ai cũng khen không gian trần cao thoáng đãng, ghế ngồi độc lập êm ái và máy lạnh mát sâu.',
                'rating' => 5,
                'vehicle_id' => $transitDb ? $transitDb->id : null
            ],
            [
                'customer_name' => 'Chị Khánh Vy (Trảng Bom)',
                'content' => 'Chiếc Mustang Fastback màu đỏ thu hút mọi ánh nhìn khi tôi lái xe trên đường phố Biên Hòa. Động cơ Ecoboost tăng tốc cực nhạy, tiếng pô cơ bắp thể thao uy lực.',
                'rating' => 5,
                'vehicle_id' => $mustangDb ? $mustangDb->id : null
            ],
            [
                'customer_name' => 'Anh Tuấn Hải (Biên Hòa)',
                'content' => 'Trải nghiệm chiếc SUV điện Mustang Mach-E tại Đồng Nai Ford thật tuyệt vời. Xe vận hành cực kỳ êm ái, tăng tốc tức thời mà không có độ trễ của động cơ xăng, sạc pin cũng nhanh gọn.',
                'rating' => 5,
                'vehicle_id' => $machEDb ? $machEDb->id : null
            ],
            [
                'customer_name' => 'Anh Ngọc Sơn (Xuân Lộc)',
                'content' => 'Ranger Raptor thực sự là một con quái thú offroad. Phuộc Fox Racing đi qua ổ gà ổ voi êm ru, các chế độ lái địa hình hỗ trợ tối đa cho các cung đường sình lầy dã ngoại cuối tuần.',
                'rating' => 5,
                'vehicle_id' => $rangerDb ? $rangerDb->id : null
            ],
            [
                'customer_name' => 'Chị Thu Trang (Biên Hòa)',
                'content' => 'Tôi mua chiếc Everest Active 7 chỗ cho gia đình đi lại hằng ngày. Xe to cao, tầm quan sát tốt, nhiều túi khí an toàn và hệ thống chống lật làm tôi rất tự tin khi tự tay cầm lái.',
                'rating' => 5,
                'vehicle_id' => $everestDb ? $everestDb->id : null
            ],
            [
                'customer_name' => 'Anh Minh Khôi (Vĩnh Cửu)',
                'content' => 'Đại lý Đồng Nai Ford hỗ trợ làm thủ tục vay trả góp mua xe Transit rất nhanh gọn. Xe chạy dịch vụ bền bỉ, chi phí bảo dưỡng định kỳ rẻ giúp tôi nhanh thu hồi vốn đầu tư.',
                'rating' => 5,
                'vehicle_id' => $transitDb ? $transitDb->id : null
            ],
            [
                'customer_name' => 'Anh Hoàng Nam (Biên Hòa)',
                'content' => 'Hệ thống hỗ trợ giữ làn đường và phanh khẩn cấp Co-Pilot 360 trên Territory Titanium hoạt động rất nhạy và chính xác, giúp lái xe an toàn hơn nhiều khi đường phố đông đúc.',
                'rating' => 5,
                'vehicle_id' => $territoryDb ? $territoryDb->id : null
            ],
        ];

        foreach ($reviews as $rev) {
            if ($rev['vehicle_id']) {
                $review = new CustomerReview([
                    'vehicle_id' => $rev['vehicle_id'],
                    'rating' => $rev['rating'],
                    'status' => 'ACTIVE',
                    'sort_order' => 0
                ]);
                $review->fill([
                    'vi' => [
                        'customer_name' => $rev['customer_name'],
                        'content' => $rev['content']
                    ]
                ]);
                $review->save();
            }
        }

        $this->command->info('✅ Customer reviews created');

        // 7. HOẠT ĐỘNG ĐẠI LÝ (Dealer Activities)
        $activities = [
            ['title' => 'Lễ bàn giao xe Ford Everest thế hệ mới cho khách hàng Biên Hòa', 'sort_order' => 1],
            ['title' => 'Chương trình Ngày hội lái thử xe Ford cùng các quà tặng đặc biệt', 'sort_order' => 2],
            ['title' => 'Chiến dịch chăm sóc và bảo dưỡng xe miễn phí lưu động', 'sort_order' => 3],
        ];

        foreach ($activities as $act) {
            DealerActivity::create([
                'title' => $act['title'],
                'status' => 'ACTIVE',
                'sort_order' => $act['sort_order'],
                'image' => ['path' => 'assets/img-gradient.png']
            ]);
        }

        $this->command->info('✅ Dealer activities created');

        // 8. ĐỐI TÁC NGÂN HÀNG / BẢO HIỂM (Partners)
        $partners = [
            ['name' => 'Ngân hàng VIB (Ưu đãi lãi vay mua xe)', 'link' => 'https://vib.com.vn', 'sort_order' => 1],
            ['name' => 'Ngân hàng Techcombank', 'link' => 'https://techcombank.com', 'sort_order' => 2],
            ['name' => 'Bảo hiểm Liberty (Bảo hiểm thân vỏ chính hãng)', 'link' => 'https://libertycar.com', 'sort_order' => 3],
        ];

        foreach ($partners as $part) {
            Partner::create([
                'name' => $part['name'],
                'link' => $part['link'],
                'status' => 'ACTIVE',
                'sort_order' => $part['sort_order']
            ]);
        }

        $this->command->info('✅ Partners created');
        $this->command->info('🎉 All Ford DNF database seeders completed successfully!');
    }

    private function transformPaths($data)
    {
        if (is_string($data)) {
            if (str_ends_with($data, '.png') || str_ends_with($data, '.jpg') || str_ends_with($data, '.jpeg')) {
                if (!str_starts_with($data, 'uploads/') && !str_starts_with($data, '/uploads/') && !str_starts_with($data, 'assets/')) {
                    return 'uploads/vehicles/' . $data;
                }
            }
            return $data;
        }
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $data[$key] = $this->transformPaths($value);
            }
        }
        return $data;
    }
}
