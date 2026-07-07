<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\KeywordController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\UsedVehicleController;
use App\Http\Controllers\Api\VehicleCategoryController;
use App\Http\Controllers\Api\CustomerReviewController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\SalesConsultantController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\AccessoryController;

Route::localized(function () {

    Route::prefix('vehicles')->name('api.vehicles.')->group(function () {
        // Dòng xe
        Route::get('featured', [VehicleController::class, 'featured'])->name('featured');
        Route::get('/', [VehicleController::class, 'index'])->name('index');

        // Danh mục xe
        Route::get('categories', [VehicleCategoryController::class, 'index'])->name('categories.index');

        // Đánh giá khách hàng
        Route::get('reviews', [CustomerReviewController::class, 'index'])->name('reviews.index');

        // Banners
        Route::get('banners', [BannerController::class, 'index'])->name('banners.index');

        // Đối tác
        Route::get('partners', [PartnerController::class, 'index'])->name('partners.index');

        // Đội ngũ cố vấn
        Route::get('consultants', [SalesConsultantController::class, 'index'])->name('consultants.index');
        Route::get('consultants/{slug}', [SalesConsultantController::class, 'show'])->name('consultants.show');

        // AI Generate Block Content
        Route::post('ai/generate-block-content', [VehicleController::class, 'generateBlockContent'])->name('generateBlockContent');

        // Chi tiết xe (Đặt ở dưới cùng để tránh tranh chấp wildcard {slug})
        Route::get('{slug}', [VehicleController::class, 'show'])->name('show');
        Route::put('{slug}/layout', [VehicleController::class, 'updateLayout'])->name('updateLayout');
    });

    Route::prefix('used-vehicles')->name('api.used_vehicles.')->group(function () {
        Route::get('/', [UsedVehicleController::class, 'index'])->name('index');
        Route::get('{slug}', [UsedVehicleController::class, 'show'])->name('show');
    });

    Route::prefix('accessories')->name('api.accessories.')->group(function () {
        Route::get('categories', [AccessoryController::class, 'categories'])->name('categories');
        Route::get('/', [AccessoryController::class, 'index'])->name('index');
        Route::get('{slug}', [AccessoryController::class, 'show'])->name('show');
    });

    Route::post('contacts', [App\Http\Controllers\Frontend\ContactController::class, 'store'])->name('api.contacts.store');
    Route::get('services', [\App\Http\Controllers\Frontend\ServiceController::class, 'index'])->name('api.services');
    Route::get('services/{slug}', [\App\Http\Controllers\Frontend\ServiceController::class, 'show'])->name('api.services.show');
    Route::get('posts', [\App\Http\Controllers\Frontend\PostController::class, 'index'])->name('api.posts');
    Route::get('posts/{slug}', [\App\Http\Controllers\Frontend\PostController::class, 'show'])->name('api.posts.show');
    Route::get('policies', [\App\Http\Controllers\Frontend\PolicyController::class, 'index'])->name('api.policies');
    Route::get('policies/{slug}', [\App\Http\Controllers\Frontend\PolicyController::class, 'show'])->name('api.policies.show');
    Route::get('jobs', [\App\Http\Controllers\Frontend\JobController::class, 'index'])->name('api.jobs');
    Route::get('jobs/{slug}', [\App\Http\Controllers\Frontend\JobController::class, 'show'])->name('api.jobs.show');
    Route::get('agencies', [\App\Http\Controllers\Frontend\AgencyController::class, 'index'])->name('api.agencies');
    Route::get('regions/provinces', [\App\Http\Controllers\Api\RegionController::class, 'province'])->name('api.regions.provinces');
    Route::get('regions/registration-fees', [\App\Http\Controllers\Api\RegionController::class, 'registrationFees'])->name('api.regions.registration-fees');

    // AI Chatbot
    Route::post('ai/chat', [ChatController::class, 'chat'])->name('api.ai.chat');

    // Lịch bảo dưỡng xe
    Route::get('maintenance-schedules', [\App\Http\Controllers\Api\MaintenanceScheduleController::class, 'index'])->name('api.maintenance_schedules.index');

    // Tri ân khách hàng (Bàn giao xe)
    Route::get('customer-handovers', [\App\Http\Controllers\Frontend\CustomerHandoverController::class, 'index'])->name('api.customer_handovers');

    // Tải ảnh trực tiếp từ FrontEnd Page Builder
    Route::post('upload', [VehicleController::class, 'uploadImage'])->name('api.upload');

    // Lấy cấu hình lãi suất trả góp cho frontend
    Route::get('settings/installment', function () {
        $installmentSettings = settings()->group('installment')->all();
        return response()->json([
            'success' => true,
            'data' => [
                'rate_year_1' => (float) ($installmentSettings['installment_rate_year_1'] ?? 8.5),
                'rate_subsequent' => (float) ($installmentSettings['installment_rate_subsequent'] ?? 11.0),
            ],
            'message' => 'OK'
        ]);
    })->name('api.settings.installment');

    // Lấy cấu hình chung và mã inject code cho frontend (GA4, Tag Manager...)
    Route::get('settings/general', function () {
        $generalSettings = settings()->group('general')->all();
        return response()->json([
            'success' => true,
            'data' => [
                'inject_head' => $generalSettings['inject_head'] ?? '',
                'inject_body_start' => $generalSettings['inject_body_start'] ?? '',
                'inject_body_end' => $generalSettings['inject_body_end'] ?? '',
                'general_company_address' => $generalSettings['general_company_address'] ?? '',
                'general_company_phone' => $generalSettings['general_company_phone'] ?? '',
                'general_company_hotline' => $generalSettings['general_company_hotline'] ?? '',
                'general_company_tax_code' => $generalSettings['general_company_tax_code'] ?? '',
                'general_company_working_hours' => $generalSettings['general_company_working_hours'] ?? '',
                'general_company_copyright' => $generalSettings['general_company_copyright'] ?? '',
            ],
            'message' => 'OK'
        ]);
    })->name('api.settings.general');
});

Route::get('keywords/index', [KeywordController::class, 'index'])
    ->name('api.keywords.index');

Route::get('sitemap', [\App\Http\Controllers\Frontend\SitemapController::class, 'index'])
    ->name('api.sitemap');

