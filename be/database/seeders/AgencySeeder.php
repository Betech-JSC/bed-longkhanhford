<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class AgencySeeder extends Seeder
{

    /**
     * Auto generated seed file
     *
     * @return void
     */
    public function run()
    {
        \DB::table('agencies')->delete();

        \DB::table('agencies')->insert(array (
            array('id' => '1','status' => 'ACTIVE','region' => 'mien_nam','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '2','status' => 'ACTIVE','region' => 'mien_nam','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '3','status' => 'ACTIVE','region' => 'mien_nam','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '4','status' => 'ACTIVE','region' => 'mien_bac','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '5','status' => 'ACTIVE','region' => 'mien_bac','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '6','status' => 'ACTIVE','region' => 'mien_bac','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '7','status' => 'ACTIVE','region' => 'mien_trung','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '8','status' => 'ACTIVE','region' => 'mien_trung','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '9','status' => 'ACTIVE','region' => 'mien_trung','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '10','status' => 'ACTIVE','region' => 'tay_nguyen','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '11','status' => 'ACTIVE','region' => 'tay_nguyen','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51'),
            array('id' => '12','status' => 'ACTIVE','region' => 'tay_nguyen','longitude' => NULL,'latitude' => NULL,'link_google_map' => NULL,'code' => NULL,'ward_id' => NULL,'district_id' => NULL,'province_id' => NULL,'is_headquarter' => '0','is_featured' => '0','position' => NULL,'image' => NULL,'deleted_at' => NULL,'created_at' => '2023-02-21 10:59:04','updated_at' => '2023-02-21 11:06:51')
        ));

        \DB::table('agency_translations')->delete();

        \DB::table('agency_translations')->insert(array (
            array('id' => '1','agency_id' => '1','title' => 'Trụ sở chính','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '2','agency_id' => '2','title' => 'Văn phòng AMATA','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '3','agency_id' => '3','title' => 'Văn phòng Thuận An - Bình Dương','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '4','agency_id' => '4','title' => 'Trụ sở chính','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '5','agency_id' => '5','title' => 'Văn phòng AMATA','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '6','agency_id' => '6','title' => 'Văn phòng Thuận An - Bình Dương','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '7','agency_id' => '7','title' => 'Trụ sở chính','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '8','agency_id' => '8','title' => 'Văn phòng AMATA','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '9','agency_id' => '9','title' => 'Văn phòng Thuận An - Bình Dương','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '10','agency_id' => '10','title' => 'Trụ sở chính','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '11','agency_id' => '11','title' => 'Văn phòng AMATA','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
            array('id' => '12','agency_id' => '12','title' => 'Văn phòng Thuận An - Bình Dương','locale' => 'vi','location' => '18A Lưu Trọng Lư, Phường Tân Thuận Đông, Quận 7,Thành phố Hồ Chí Minh.','full_address' => NULL,'description' => NULL,'phones' => NULL,'info' => '{"email":"info@kvi.konoike.net","phone":"+84 283.8722 846"}'),
        ));
    }
}
