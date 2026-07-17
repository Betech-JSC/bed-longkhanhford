<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use JamstackVietnam\Blog\Models\Post;
use JamstackVietnam\Blog\Models\PostCategory;
use JamstackVietnam\Tag\Models\Tag;

class PostNewsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. TẠO CATEGORIES
        $categories = [
            ['vi' => ['title' => 'Tin tức', 'slug' => 'tin-tuc'], 'en' => ['title' => 'News', 'slug' => 'news']],
            ['vi' => ['title' => 'Xe Ford', 'slug' => 'xe-ford'], 'en' => ['title' => 'Ford Vehicles', 'slug' => 'ford-vehicles']],
            ['vi' => ['title' => 'Khuyến Mãi', 'slug' => 'khuyen-mai'], 'en' => ['title' => 'Promotions', 'slug' => 'promotions']],
            ['vi' => ['title' => 'Hướng dẫn', 'slug' => 'huong-dan'], 'en' => ['title' => 'Guides', 'slug' => 'guides']],
            ['vi' => ['title' => 'Thư viện Media', 'slug' => 'thu-vien-media'], 'en' => ['title' => 'Media Library', 'slug' => 'media-library']],
        ];

        $createdCategories = [];
        foreach ($categories as $idx => $cat) {
            $category = new PostCategory(['status' => 'ACTIVE', 'position' => $idx + 1]);
            $category->fill($cat);
            $category->save();
            $createdCategories[] = $category;
        }

        $this->command->info('✅ Post categories created');

        // 2. TẠO TAGS
        $tags = [
            ['vi' => ['title' => 'SUV', 'slug' => 'suv']],
            ['vi' => ['title' => 'Bán tải', 'slug' => 'ban-tai']],
            ['vi' => ['title' => 'Everest', 'slug' => 'everest']],
            ['vi' => ['title' => 'Territory', 'slug' => 'territory']],
            ['vi' => ['title' => 'Ranger', 'slug' => 'ranger']],
            ['vi' => ['title' => 'Đánh giá xe', 'slug' => 'danh-gia-xe']],
            ['vi' => ['title' => 'Khuyến mãi', 'slug' => 'khuyen-mai']],
            ['vi' => ['title' => 'Bảo dưỡng', 'slug' => 'bao-duong']],
        ];

        $createdTags = [];
        foreach ($tags as $tagData) {
            $tag = new Tag(['status' => 'ACTIVE']);
            $tag->fill($tagData);
            $tag->save();
            $createdTags[] = $tag;
        }

        $this->command->info('✅ Tags created');

        // 3. TẠO POSTS/NEWS
        $posts = [
            [
                'image' => ['path' => 'uploads/vehicles/everest_hero.png'],
                'published_at' => now()->subDays(10),
                'is_featured' => true,
                'type' => 'POST',
                'category_ids' => [1, 2], // Xe Ford
                'tag_ids' => [3, 6], // Everest, Đánh giá xe
                'vi' => [
                    'title' => 'Ford Everest Máy Xăng: Sự Thật Ít Ai Biết & Tư Vấn Mua Xe Tại Long Khánh Ford',
                    'slug' => 'ford-everest-may-xang-su-that-it-ai-biet',
                    'description' => 'Ford Everest luôn là cái tên hot trong phân khúc SUV 7 chỗ tại Việt Nam. Bài viết này sẽ phân tích chi tiết phiên bản máy xăng của Ford Everest thế hệ mới.',
                    'content' => '<h2>Ưu điểm nổi bật của Ford Everest Động cơ Xăng</h2><p>Khác với động cơ dầu có tiếng nổ đặc trưng và độ rung nhẹ, động cơ xăng Ecoboost mang lại trải nghiệm vận hành êm ái đến kinh ngạc. Cabin xe hoàn toàn yên tĩnh, giúp các chuyến đi dài cùng gia dịch trở nên thư thái hơn rất nhiều.</p><h3>Mức tiêu hao nhiên liệu thực tế tại Long Khánh</h3><p>Qua các thử nghiệm thực tế của đội ngũ kỹ thuật Long Khánh Ford trên cung đường từ TP. Biên Hòa đi Long Khánh, mức tiêu hao nhiên liệu trung bình của Ford Everest máy xăng rơi vào khoảng 8.5L/100km đường trường và khoảng 11L - 12L/100km trong điều kiện đô thị đông đúc.</p>'
                ]
            ],
            [
                'image' => ['path' => 'uploads/blog/blog_promotion.png'],
                'published_at' => now()->subDays(5),
                'is_featured' => true,
                'is_home' => true,
                'type' => 'POST',
                'category_ids' => [3], // Khuyến mãi
                'tag_ids' => [7, 8], // Khuyến mãi, Bảo dưỡng
                'vi' => [
                    'title' => 'CHƯƠNG TRÌNH KHUYẾN MÃI TRONG THÁNG 5',
                    'slug' => 'chuong-trinh-khuyen-mai-thang-5',
                    'description' => 'Long Khánh Ford triển khai chương trình khuyến mãi cực khủng: Hỗ trợ lên đến 100% lệ phí trước bạ cho các dòng xe SUV Territory, Ranger XLS.',
                    'content' => '<h2>Đồng loạt giảm 10% các dịch vụ kỹ thuật cao</h2><ul><li>Vệ sinh buồng đốt bằng khí Hydro, vệ sinh kim phun bằng sóng siêu âm.</li><li>Dịch vụ vệ sinh và khử khuẩn dàn lạnh điều hòa bằng thiết bị chuyên dùng.</li><li>Cân chỉnh thước lái điện tử 3D bằng hệ thống Hunter hiện đại.</li></ul><h3>Ưu đãi cộng thêm dành cho khách hàng đặt lịch hẹn trước</h3><p>Giảm ngay 500.000đ cho các dòng xe Ford quay lại làm dịch vụ thay nhớt sau thời gian trên 12 tháng chưa quay lại xưởng.</p>'
                ]
            ],
            [
                'image' => ['path' => 'uploads/vehicles/ranger_raptor.png'],
                'published_at' => now()->subDays(15),
                'is_featured' => false,
                'type' => 'POST',
                'category_ids' => [2], // Xe Ford
                'tag_ids' => [2, 5, 6], // Bán tải, Ranger, Đánh giá xe
                'vi' => [
                    'title' => 'Ford Ranger Raptor: Đánh Giá Chi Tiết & Báo Giá Mới Nhất Tại Long Khánh Ford',
                    'slug' => 'ford-ranger-raptor-danh-gia-chi-tiet',
                    'description' => 'Được phát triển bởi Ford Performance, dòng Ranger Raptor sở hữu những nâng cấp vượt trội về hệ thống lái và khung gầm.',
                    'content' => '<h2>Khả năng Off-road tối thượng nhờ hệ thống giảm xóc FOX</h2><p>Điểm đắt giá nhất trên Ranger Raptor chính là bộ giảm xóc FOX Live Valve 2.5 inch. Hệ thống treo này có khả năng tự động điều chỉnh độ cứng/mềm theo thời gian thực dựa trên địa hình thực tế.</p><h3>Động cơ Bi-Turbo 2.0L mạnh mẽ</h3><p>Trái tim của Ranger Raptor là khối động cơ Diesel Bi-Turbo 2.0L sản sinh công suất tối đa lên đến 210 mã lực và mô-men xoắn cực đại 500 Nm.</p>'
                ]
            ],
            [
                'image' => ['path' => 'uploads/vehicles/territory_hero.png'],
                'published_at' => now()->subDays(20),
                'is_featured' => false,
                'type' => 'POST',
                'category_ids' => [2], // Xe Ford
                'tag_ids' => [1, 4, 6], // SUV, Territory, Đánh giá xe
                'vi' => [
                    'title' => 'Đánh Giá Xe Ford Territory 2026: Lựa Chọn Cho Gia Đình Việt',
                    'slug' => 'danh-gia-xe-ford-territory-2026',
                    'description' => 'Diện mạo mới đầy cuốn hút, công nghệ ngập tràn và không gian cabin rộng rãi bậc nhất phân khúc.',
                    'content' => '<h2>Không gian nội thất rộng rãi và đầy công nghệ</h2><p>Bước vào cabin của Territory, bạn sẽ ngay lập tức bị ấn tượng bởi màn hình kép 12 inch trải dài trên bảng táp-lô sang trọng.</p><h3>Hệ thống hỗ trợ lái Co-Pilot 360 thông minh</h3><p>Ford Territory được trang bị gói công nghệ an toàn chủ động Co-Pilot 360 với hơn 20 tính năng vượt trội.</p>'
                ]
            ],
            [
                'image' => ['path' => 'uploads/vehicles/transit_hero.png'],
                'published_at' => now()->subDays(25),
                'is_featured' => false,
                'type' => 'POST',
                'category_ids' => [1, 2], // Tin tức, Xe Ford
                'tag_ids' => [],
                'vi' => [
                    'title' => 'Giải pháp vận chuyển hành khách tối ưu cùng Ford Transit 2026',
                    'slug' => 'giai-phap-van-chuyen-hành-khach-ford-transit',
                    'description' => 'Ford Transit Thế hệ Mới được thiết kế tối ưu với không gian rộng rãi hơn, tiện nghi vượt trội cùng độ bền bỉ cao.',
                    'content' => '<h2>Nâng cấp toàn diện thiết kế và trang bị nội thất</h2><p>Ford Transit thế hệ mới mang lại diện mạo chuyên nghiệp hơn với lưới tản nhiệt lớn mạ chrome sang trọng.</p><h3>Động cơ Turbo Diesel 2.2L mạnh mẽ và tiết kiệm</h3><p>Transit thế hệ mới sử dụng động cơ dầu 2.2L TDCi kết hợp hộp số sàn 6 cấp cho khả năng kéo tải cực tốt.</p>'
                ]
            ],
            [
                'image' => ['path' => 'uploads/blog/blog_safe_driving.png'],
                'published_at' => now()->subDays(30),
                'is_featured' => false,
                'is_home' => true,
                'type' => 'POST',
                'category_ids' => [1], // Tin tức
                'tag_ids' => [],
                'vi' => [
                    'title' => 'Long Khánh Ford đồng hành cùng chương trình Hướng dẫn Lái xe An toàn (DSFL)',
                    'slug' => 'long-khanh-ford-chuong-trinh-lai-xe-an-toan',
                    'description' => 'Chương trình Hướng dẫn Lái xe An toàn và Thân thiện với Môi trường (DSFL) do Ford Việt Nam phối hợp cùng Long Khánh Ford tổ chức thu hút hơn 200 học viên tham gia.',
                    'content' => '<h2>Trang bị kiến thức và kỹ năng thực tế</h2><p>Chương trình tập trung huấn luyện các kỹ năng thiết thực như: nhận diện nguy hiểm từ xa, kiểm soát lái trong các tình huống trơn trượt, lái xe tiết kiệm nhiên liệu.</p>'
                ]
            ],
            [
                'image' => ['path' => 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=800'],
                'published_at' => now()->subDays(6),
                'is_featured' => false,
                'type' => 'MEDIA',
                'category_ids' => [5],
                'tag_ids' => [],
                'vi' => [
                    'title' => 'Tư thế ngồi lái & Cách chỉnh gương chiếu hậu đúng chuẩn',
                    'slug' => 'dsfl-sit-correctly',
                    'author' => 'NnUj3yK3Bic',
                    'description' => 'Chuyên gia Ford hướng dẫn cách căn chỉnh vị trí ngồi, độ cao ghế và góc gương chiếu hậu để có tầm quan sát tối đa, tránh điểm mù và giảm mệt mỏi.',
                    'content' => '<p>Chuyên gia Ford hướng dẫn cách căn chỉnh vị trí ngồi, độ cao ghế và góc gương chiếu hậu để có tầm quan sát tối đa, tránh điểm mù và giảm mệt mỏi.</p>'
                ]
            ],
            [
                'image' => ['path' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800'],
                'published_at' => now()->subDays(5),
                'is_featured' => false,
                'type' => 'MEDIA',
                'category_ids' => [5],
                'tag_ids' => [],
                'vi' => [
                    'title' => 'Kỹ thuật cầm vô lăng và kiểm soát hướng lái an toàn',
                    'slug' => 'dsfl-steering-technique',
                    'author' => 'nJsnHwV3nsw',
                    'description' => 'Hướng dẫn tư thế cầm vô lăng chuẩn 9:15, kỹ thuật quay vô lăng chéo tay (hand-over-hand) và trả lái mượt mà khi di chuyển qua các góc cua hẹp.',
                    'content' => '<p>Hướng dẫn tư thế cầm vô lăng chuẩn 9:15, kỹ thuật quay vô lăng chéo tay (hand-over-hand) và trả lái mượt mà khi di chuyển qua các góc cua hẹp.</p>'
                ]
            ],
            [
                'image' => ['path' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800'],
                'published_at' => now()->subDays(4),
                'is_featured' => false,
                'type' => 'MEDIA',
                'category_ids' => [5],
                'tag_ids' => [],
                'vi' => [
                    'title' => 'Kiểm tra kỹ thuật xe toàn diện trước khi khởi hành',
                    'slug' => 'dsfl-precheck-vehicle',
                    'author' => 'Vd_Q4lR8rAw',
                    'description' => 'Các bước kiểm tra nhanh lốp xe, nước làm mát, dầu động cơ và hệ thống đèn tín hiệu để đảm bảo an toàn tuyệt đối trước mỗi chuyến đi xa.',
                    'content' => '<p>Các bước kiểm tra nhanh lốp xe, nước làm mát, dầu động cơ và hệ thống đèn tín hiệu để đảm bảo an toàn tuyệt đối trước mỗi chuyến đi xa.</p>'
                ]
            ],
            [
                'image' => ['path' => 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800'],
                'published_at' => now()->subDays(3),
                'is_featured' => false,
                'type' => 'MEDIA',
                'category_ids' => [5],
                'tag_ids' => [],
                'vi' => [
                    'title' => 'Kỹ năng lái xe số tự động an toàn & tiết kiệm nhiên liệu',
                    'slug' => 'dsfl-automatic-transmission',
                    'author' => 'Zp9kK8K71lE',
                    'description' => 'Tìm hiểu nguyên lý hoạt động của hộp số tự động và kỹ thuật sử dụng chân phanh/ga đúng cách giúp xe vận hành trơn tru và tối ưu hóa mức tiêu hao.',
                    'content' => '<p>Tìm hiểu nguyên lý hoạt động của hộp số tự động và kỹ thuật sử dụng chân phanh/ga đúng cách giúp xe vận hành trơn tru và tối ưu hóa mức tiêu hao.</p>'
                ]
            ],
            [
                'image' => ['path' => 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=800'],
                'published_at' => now()->subDays(2),
                'is_featured' => false,
                'type' => 'MEDIA',
                'category_ids' => [5],
                'tag_ids' => [],
                'vi' => [
                    'title' => 'Kỹ thuật phanh khẩn cấp & Sự hỗ trợ từ hệ thống ABS',
                    'slug' => 'dsfl-emergency-braking',
                    'author' => 'Y-i03cpx8L4',
                    'description' => 'Cách xử lý phanh khẩn cấp trong các tình huống bất ngờ, hiểu rõ cơ chế hoạt động của hệ thống phanh chống bó cứng ABS để duy trì kiểm soát lái.',
                    'content' => '<p>Cách xử lý phanh khẩn cấp trong các tình huống bất ngờ, hiểu rõ cơ chế hoạt động của hệ thống phanh chống bó cứng ABS để duy trì kiểm soát lái.</p>'
                ]
            ],
            [
                'image' => ['path' => 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800'],
                'published_at' => now()->subDays(1),
                'is_featured' => false,
                'type' => 'MEDIA',
                'category_ids' => [5],
                'tag_ids' => [],
                'vi' => [
                    'title' => 'Kinh nghiệm lái xe ban đêm & Xử lý đèn pha/cốt',
                    'slug' => 'dsfl-night-driving',
                    'author' => 'aFzI25q-P10',
                    'description' => 'Các nguyên tắc an toàn khi di chuyển trong bóng tối, cách sử dụng đèn chiếu xa/gần đúng luật để không gây chói mắt xe ngược chiều mà vẫn đảm bảo tầm nhìn.',
                    'content' => '<p>Các nguyên tắc an toàn khi di chuyển trong bóng tối, cách sử dụng đèn chiếu xa/gần đúng luật để không gây chói mắt xe ngược chiều mà vẫn đảm bảo tầm nhìn.</p>'
                ]
            ],
        ];

        foreach ($posts as $postData) {
            $post = new Post([
                'image' => $postData['image'],
                'published_at' => $postData['published_at'],
                'is_featured' => $postData['is_featured'] ?? false,
                'is_home' => $postData['is_home'] ?? false,
                'type' => $postData['type'],
                'status' => 'ACTIVE',
            ]);
            $post->fill(['vi' => $postData['vi']]);
            $post->save();

            // Attach categories
            if (!empty($postData['category_ids'])) {
                foreach ($postData['category_ids'] as $catId) {
                    $post->categories()->attach($createdCategories[$catId - 1]->id);
                }
            }

            // Attach tags
            if (!empty($postData['tag_ids'])) {
                foreach ($postData['tag_ids'] as $tagId) {
                    $post->tags()->attach($createdTags[$tagId - 1]->id);
                }
            }
        }

        $this->command->info('✅ Posts/News created: ' . count($posts) . ' articles');
        $this->command->info('🎉 Post & News seeding completed!');
    }
}
