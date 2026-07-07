<?php
 
 use Illuminate\Database\Migrations\Migration;
 use Illuminate\Database\Schema\Blueprint;
 use Illuminate\Support\Facades\Schema;
 use Illuminate\Support\Facades\DB;
 
 return new class extends Migration
 {
     public function up(): void
     {
         // 1. Tạo bảng pivot accessory_ref_vehicles
         Schema::create('accessory_ref_vehicles', function (Blueprint $table) {
             $table->id();
             $table->unsignedBigInteger('accessory_id');
             $table->unsignedBigInteger('vehicle_id');
 
             $table->unique(['accessory_id', 'vehicle_id'], 'acc_ref_veh_unique');
             
             $table->foreign('accessory_id', 'fk_acc_ref_veh_acc_id')
                 ->references('id')
                 ->on('accessories')
                 ->onDelete('cascade');
 
             $table->foreign('vehicle_id', 'fk_acc_ref_veh_veh_id')
                 ->references('id')
                 ->on('vehicles')
                 ->onDelete('cascade');
         });
 
         // 2. Di chuyển dữ liệu từ accessories.fit_vehicles (JSON array) sang bảng pivot
         $accessories = DB::table('accessories')->get();
         foreach ($accessories as $acc) {
             if (empty($acc->fit_vehicles)) continue;
 
             $fitList = json_decode($acc->fit_vehicles, true);
             if (!is_array($fitList)) continue;
 
             foreach ($fitList as $vehName) {
                 if (empty($vehName)) continue;
 
                 // Tìm xe tương thích bằng exact match
                 $vehicle = DB::table('vehicles')
                     ->join('vehicle_translations', 'vehicles.id', '=', 'vehicle_translations.vehicle_id')
                     ->where('vehicle_translations.locale', 'vi')
                     ->whereRaw('LOWER(TRIM(vehicle_translations.title)) = ?', [strtolower(trim($vehName))])
                     ->select('vehicles.id')
                     ->first();
 
                 // Nếu không tìm thấy bằng exact match, thử tìm kiểu partial match (ví dụ: "Ford Ranger XLS" chứa "Ford Ranger")
                 if (!$vehicle) {
                     $allVehicles = DB::table('vehicles')
                         ->join('vehicle_translations', 'vehicles.id', '=', 'vehicle_translations.vehicle_id')
                         ->where('vehicle_translations.locale', 'vi')
                         ->select('vehicles.id', 'vehicle_translations.title')
                         ->get();
                     
                     foreach ($allVehicles as $v) {
                         $vTitle = strtolower(trim($v->title));
                         $target = strtolower(trim($vehName));
                         if (str_contains($target, $vTitle) || str_contains($vTitle, $target)) {
                             $vehicle = $v;
                             break;
                         }
                     }
                 }
 
                 if ($vehicle) {
                     // Insert và bỏ qua nếu trùng cặp
                     DB::table('accessory_ref_vehicles')->insertOrIgnore([
                         'accessory_id' => $acc->id,
                         'vehicle_id' => $vehicle->id,
                     ]);
                 }
             }
         }
     }
 
     public function down(): void
     {
         Schema::dropIfExists('accessory_ref_vehicles');
     }
 };
