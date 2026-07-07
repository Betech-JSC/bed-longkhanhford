<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CustomerHandover;
use Illuminate\Support\Facades\DB;

class CustomerHandoverSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Truncate existing records to avoid duplicates
        CustomerHandover::query()->delete();
        DB::table('customer_handover_translations')->truncate();

        // Everest Handover
        $h1 = CustomerHandover::create([
            'status' => 'ACTIVE',
            'position_sort' => 10,
            'image' => ['path' => 'uploads/customer_handover_everest.png']
        ]);
        $h1->translations()->create([
            'locale' => 'vi',
            'title' => 'Lễ bàn giao xe Ford Everest thế hệ mới cho gia đình anh Nguyễn Hoàng Nam'
        ]);
        $h1->translations()->create([
            'locale' => 'en',
            'title' => 'Handover ceremony of the Next-Gen Ford Everest to Mr. Nguyen Hoang Nam and family'
        ]);

        // Ranger Handover
        $h2 = CustomerHandover::create([
            'status' => 'ACTIVE',
            'position_sort' => 20,
            'image' => ['path' => 'uploads/customer_handover_ranger.png']
        ]);
        $h2->translations()->create([
            'locale' => 'vi',
            'title' => 'Bàn giao xe bán tải Ford Ranger Wildtrak cho công ty xây dựng An Phát'
        ]);
        $h2->translations()->create([
            'locale' => 'en',
            'title' => 'Handover ceremony of Ford Ranger Wildtrak pickup to An Phat Construction Company'
        ]);

        // Territory Handover
        $h3 = CustomerHandover::create([
            'status' => 'ACTIVE',
            'position_sort' => 30,
            'image' => ['path' => 'uploads/customer_handover_territory.png']
        ]);
        $h3->translations()->create([
            'locale' => 'vi',
            'title' => 'Chúc mừng chị Vy Oanh đón nhận xe Ford Territory Trend sang trọng'
        ]);
        $h3->translations()->create([
            'locale' => 'en',
            'title' => 'Congratulations to Ms. Vy Oanh on receiving her premium Ford Territory Trend'
        ]);

        $this->command->info('Customer handovers seeded successfully!');
    }
}
