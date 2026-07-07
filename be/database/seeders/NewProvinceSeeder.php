<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NewProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Xóa sạch dữ liệu cũ trong bảng regions để nạp cấu trúc 34 tỉnh thành mới
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('regions')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $provinces = [
            // 6 Thành phố trực thuộc Trung ương
            ['code' => '01', 'name' => 'Hà Nội', 'name_with_type' => 'Thành phố Hà Nội', 'type' => 'thanh_pho', 'sort' => 100],
            ['code' => '79', 'name' => 'TP. Hồ Chí Minh', 'name_with_type' => 'Thành phố Hồ Chí Minh', 'type' => 'thanh_pho', 'sort' => 99],
            ['code' => '31', 'name' => 'Hải Phòng', 'name_with_type' => 'Thành phố Hải Phòng', 'type' => 'thanh_pho', 'sort' => 98],
            ['code' => '48', 'name' => 'Đà Nẵng', 'name_with_type' => 'Thành phố Đà Nẵng', 'type' => 'thanh_pho', 'sort' => 97],
            ['code' => '92', 'name' => 'Cần Thơ', 'name_with_type' => 'Thành phố Cần Thơ', 'type' => 'thanh_pho', 'sort' => 96],
            ['code' => '46', 'name' => 'Huế', 'name_with_type' => 'Thành phố Huế', 'type' => 'thanh_pho', 'sort' => 95],

            // 28 Tỉnh mới và tỉnh giữ nguyên
            ['code' => '75', 'name' => 'Đồng Nai', 'name_with_type' => 'Tỉnh Đồng Nai', 'type' => 'tinh', 'sort' => 90],
            ['code' => '74', 'name' => 'Bình Dương', 'name_with_type' => 'Tỉnh Bình Dương', 'type' => 'tinh', 'sort' => 89],
            ['code' => '77', 'name' => 'Bà Rịa - Vũng Tàu', 'name_with_type' => 'Tỉnh Bà Rịa - Vũng Tàu', 'type' => 'tinh', 'sort' => 88],
            ['code' => '68', 'name' => 'Lâm Đồng', 'name_with_type' => 'Tỉnh Lâm Đồng', 'type' => 'tinh', 'sort' => 87],
            ['code' => '72', 'name' => 'Tây Ninh', 'name_with_type' => 'Tỉnh Tây Ninh', 'type' => 'tinh', 'sort' => 86],
            ['code' => '80', 'name' => 'Long An', 'name_with_type' => 'Tỉnh Long An', 'type' => 'tinh', 'sort' => 85],
            ['code' => '25', 'name' => 'Phú Thọ', 'name_with_type' => 'Tỉnh Phú Thọ', 'type' => 'tinh', 'sort' => 80],
            ['code' => '02', 'name' => 'Tuyên Quang', 'name_with_type' => 'Tỉnh Tuyên Quang', 'type' => 'tinh', 'sort' => 79],
            ['code' => '10', 'name' => 'Lào Cai', 'name_with_type' => 'Tỉnh Lào Cai', 'type' => 'tinh', 'sort' => 78],
            ['code' => '19', 'name' => 'Thái Nguyên', 'name_with_type' => 'Tỉnh Thái Nguyên', 'type' => 'tinh', 'sort' => 77],
            ['code' => '27', 'name' => 'Bắc Ninh', 'name_with_type' => 'Tỉnh Bắc Ninh', 'type' => 'tinh', 'sort' => 76],
            ['code' => '33', 'name' => 'Hưng Yên', 'name_with_type' => 'Tỉnh Hưng Yên', 'type' => 'tinh', 'sort' => 75],
            ['code' => '37', 'name' => 'Ninh Bình', 'name_with_type' => 'Tỉnh Ninh Bình', 'type' => 'tinh', 'sort' => 74],
            ['code' => '45', 'name' => 'Quảng Trị', 'name_with_type' => 'Tỉnh Quảng Trị', 'type' => 'tinh', 'sort' => 73],
            ['code' => '51', 'name' => 'Quảng Ngãi', 'name_with_type' => 'Tỉnh Quảng Ngãi', 'type' => 'tinh', 'sort' => 72],
            ['code' => '52', 'name' => 'Gia Lai', 'name_with_type' => 'Tỉnh Gia Lai', 'type' => 'tinh', 'sort' => 71],
            ['code' => '56', 'name' => 'Khánh Hòa', 'name_with_type' => 'Tỉnh Khánh Hòa', 'type' => 'tinh', 'sort' => 70],
            ['code' => '04', 'name' => 'Cao Bằng', 'name_with_type' => 'Tỉnh Cao Bằng', 'type' => 'tinh', 'sort' => 60],
            ['code' => '11', 'name' => 'Điện Biên', 'name_with_type' => 'Tỉnh Điện Biên', 'type' => 'tinh', 'sort' => 59],
            ['code' => '42', 'name' => 'Hà Tĩnh', 'name_with_type' => 'Tỉnh Hà Tĩnh', 'type' => 'tinh', 'sort' => 58],
            ['code' => '12', 'name' => 'Lai Châu', 'name_with_type' => 'Tỉnh Lai Châu', 'type' => 'tinh', 'sort' => 57],
            ['code' => '20', 'name' => 'Lạng Sơn', 'name_with_type' => 'Tỉnh Lạng Sơn', 'type' => 'tinh', 'sort' => 56],
            ['code' => '40', 'name' => 'Nghệ An', 'name_with_type' => 'Tỉnh Nghệ An', 'type' => 'tinh', 'sort' => 55],
            ['code' => '22', 'name' => 'Quảng Ninh', 'name_with_type' => 'Tỉnh Quảng Ninh', 'type' => 'tinh', 'sort' => 54],
            ['code' => '38', 'name' => 'Thanh Hóa', 'name_with_type' => 'Tỉnh Thanh Hóa', 'type' => 'tinh', 'sort' => 53],
            ['code' => '14', 'name' => 'Sơn La', 'name_with_type' => 'Tỉnh Sơn La', 'type' => 'tinh', 'sort' => 52],
            ['code' => '89', 'name' => 'An Giang', 'name_with_type' => 'Tỉnh An Giang', 'type' => 'tinh', 'sort' => 51],
            ['code' => '96', 'name' => 'Cà Mau', 'name_with_type' => 'Tỉnh Cà Mau', 'type' => 'tinh', 'sort' => 50],
            ['code' => '66', 'name' => 'Đắk Lắk', 'name_with_type' => 'Tỉnh Đắk Lắk', 'type' => 'tinh', 'sort' => 49],
            ['code' => '82', 'name' => 'Tiền Giang', 'name_with_type' => 'Tỉnh Tiền Giang', 'type' => 'tinh', 'sort' => 48],
        ];

        foreach ($provinces as $province) {
            DB::table('regions')->insert([
                'country_id' => 1,
                'level' => 1,
                'code' => $province['code'],
                'parent_code' => null,
                'type' => $province['type'],
                'name' => $province['name'],
                'name_with_type' => $province['name_with_type'],
                'path' => $province['name'],
                'path_with_type' => $province['name_with_type'],
                'sort' => $province['sort'],
                'shipping_price' => 0.00
            ]);
        }
    }
}
