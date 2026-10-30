<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Contact;
use App\Models\File;
use Illuminate\Support\Facades\Notification;
use App\Http\Notifications\CommonNotification;
use App\Http\Notifications\ServiceBookingNotification;
use App\Models\Vehicle\LandingPage;
use App\Models\Vehicle\SalesConsultant;
use App\Traits\ApiResponse;

class ContactController extends Controller
{
    use ApiResponse;
    public $model = Contact::class;

    public function store(Request $request)
    {
        try {
            if (!$request->has('contact.data')) {
                return $this->empty();
            }
            $data = $request->input('contact')['data'] ?? [];
            $requestData = $request->all()['contact'] ?? [];
            $rawType = $requestData['type'] ?? key(config('contact.types'));
            $requestData['type'] = $rawType;

            // Chuẩn hóa Họ và tên
            $nameVal = $data['Name'] ?? $data['Họ và tên'] ?? $data['full_name'] ?? $data['fullname'] ?? $data['name'] ?? null;
            if ($nameVal) {
                $data['Name'] = $nameVal;
                $data['Họ và tên'] = $nameVal;
            }

            // Chuẩn hóa Số điện thoại
            $phoneVal = $data['Phone'] ?? $data['Số điện thoại'] ?? $data['phone'] ?? $data['telephone'] ?? $data['sdt'] ?? null;
            if ($phoneVal) {
                $data['Phone'] = $phoneVal;
                $data['Số điện thoại'] = $phoneVal;
            }

            // Chuẩn hóa Email
            $emailVal = $data['Email'] ?? $data['E-mail'] ?? $data['email'] ?? null;
            if ($emailVal) {
                $data['Email'] = $emailVal;
                $data['E-mail'] = $emailVal;
            }

            // Chuẩn hóa Lời nhắn / Ghi chú
            $noteVal = $data['Nội dung cần hỗ trợ'] ?? $data['notes'] ?? $data['note'] ?? $data['message'] ?? $data['Ghi chú'] ?? null;
            if ($noteVal) {
                $data['Nội dung cần hỗ trợ'] = $noteVal;
            }

            // Chuẩn hóa trường Product cho ADVISE_FORM và TEST_DRIVE để tránh lỗi validation khi form gửi từ Landing Page
            if ($rawType === 'ADVISE_FORM' || $rawType === 'TEST_DRIVE') {
                if (empty($data['Product']) || !is_array($data['Product'])) {
                    $vehicleId = $data['vehicle_id'] ?? 'ford-longkhanh';
                    $vehicleTitle = 'Long Khánh Ford';
                    $vehicleSlug = 'ford-longkhanh';
                    if (!empty($data['vehicle_id']) && is_numeric($data['vehicle_id'])) {
                        try {
                            $vModel = \App\Models\Vehicle\Vehicle::find($data['vehicle_id']);
                            if ($vModel) {
                                $vehicleTitle = $vModel->title ?? $vModel->name ?? 'Long Khánh Ford';
                                $vehicleSlug = $vModel->slug ?? 'ford-longkhanh';
                            }
                        } catch (\Throwable $e) {}
                    }
                    $data['Product'] = [
                        'id' => (string)$vehicleId,
                        'slug' => $vehicleSlug,
                        'title' => $vehicleTitle,
                        'type' => 'vehicle',
                    ];
                } else {
                    if (empty($data['Product']['id'])) {
                        $data['Product']['id'] = 'ford-longkhanh';
                    }
                    if (empty($data['Product']['slug'])) {
                        $data['Product']['slug'] = 'ford-longkhanh';
                    }
                    if (empty($data['Product']['title'])) {
                        $data['Product']['title'] = 'Long Khánh Ford';
                    }
                }
            }

            $requestData['data'] = $data;
            $requestData['sent_at'] = now();
            $rules = config('contact.types.' . $rawType . '.rules');

            if (!is_array($rules)) {
                $rules = [
                    'Phone' => 'nullable',
                    'Name' => 'nullable',
                    'Số điện thoại' => 'nullable',
                    'Họ và tên' => 'nullable',
                ];
            }
            $validator = Validator::make($data, $rules);

            if ($validator->fails()) {
                return $this->failure($validator->errors());
            }

            if (isset($requestData['data']['File CV'])) {
                $files = $requestData['data']['File CV'];
                $file = new File($request->input('path', '/'));

                $fileUploaded = $file->store($files);

                unset($requestData['data']['File CV']);

                $requestData['data']['File CV'] = [];

                if (isset($fileUploaded['successFiles'])) {
                    foreach ($fileUploaded['successFiles'] as $item) {
                        $requestData['data']['File CV'][] = $item;
                    }
                }
            }

            if (empty($requestData['sales_consultant_id'])) {
                $scIdFromData = $requestData['data']['sales_consultant_id'] ?? null;
                $ldpIdFromData = $requestData['data']['landing_page_id'] ?? $requestData['landing_page_id'] ?? null;
                if (!empty($scIdFromData)) {
                    $requestData['sales_consultant_id'] = $scIdFromData;
                } elseif (!empty($ldpIdFromData)) {
                    $requestData['sales_consultant_id'] = LandingPage::where('id', $ldpIdFromData)->value('sales_consultant_id');
                }
            }

            if (!empty($requestData['sales_consultant_id'])) {
                $scObj = SalesConsultant::find($requestData['sales_consultant_id']);
                if ($scObj && empty($requestData['data']['Cố vấn phụ trách'])) {
                    $scPhoneStr = $scObj->phone ? " ({$scObj->phone})" : '';
                    $requestData['data']['Cố vấn phụ trách'] = $scObj->name . $scPhoneStr;
                    if ($scObj->phone && empty($requestData['data']['SĐT Cố vấn nhận liên hệ'])) {
                        $requestData['data']['SĐT Cố vấn nhận liên hệ'] = $scObj->phone;
                    }
                }
            }

            if (in_array($rawType, ['LDP_CLICK_CALL', 'LDP_CLICK_ZALO'], true)) {
                $actionLabel = $rawType === 'LDP_CLICK_CALL' ? 'Khách bấm Gọi điện trên LDP' : 'Khách bấm Chat Zalo trên LDP';
                if (empty($requestData['data']['Họ và tên']) && empty($requestData['data']['Name'])) {
                    $requestData['data']['Họ và tên'] = $actionLabel;
                    $requestData['data']['Name'] = $actionLabel;
                }
                if (empty($requestData['data']['Số điện thoại']) && empty($requestData['data']['Phone'])) {
                    $fallbackPhone = $rawType === 'LDP_CLICK_CALL' ? 'Click gọi trực tiếp' : 'Click mở chat Zalo';
                    $requestData['data']['Số điện thoại'] = $fallbackPhone;
                    $requestData['data']['Phone'] = $fallbackPhone;
                }
            }

            $createdContact = $this->model::create($requestData);

            // Gửi thông báo tức thì qua Telegram cho Sales team
            try {
                $telegramService = app(\App\Services\TelegramService::class);
                $contactData = $requestData['data'] ?? [];
                $type = $requestData['type'] ?? 'CONTACT_FORM';

                // Tên khách hàng
                $contactName = $contactData['Họ và tên'] 
                    ?? $contactData['Name'] 
                    ?? $contactData['Tên'] 
                    ?? $contactData['Họ tên'] 
                    ?? $contactData['Khách hàng'] 
                    ?? 'Khách hàng ẩn danh';

                // Số điện thoại
                $contactPhone = $contactData['Số điện thoại'] 
                    ?? $contactData['Phone'] 
                    ?? $contactData['SĐT'] 
                    ?? $contactData['Số ĐT'] 
                    ?? $contactData['Điện thoại'] 
                    ?? 'Chưa có SĐT';

                // Email
                $contactEmail = $contactData['Email'] 
                    ?? $contactData['E-mail'] 
                    ?? null;

                // Dòng xe quan tâm
                $vehicle = null;
                if (!empty($contactData['Dòng xe quan tâm'])) {
                    $vehicle = $contactData['Dòng xe quan tâm'];

                } elseif (!empty($contactData['Dòng xe đăng ký'])) {
                    $vehicle = $contactData['Dòng xe đăng ký'];
                } elseif (!empty($contactData['Dòng xe lái thử'])) {
                    $vehicle = $contactData['Dòng xe lái thử'];

                } elseif (!empty($contactData['Dòng xe'])) {
                    $vehicle = $contactData['Dòng xe'];
                } elseif (!empty($contactData['Loại xe'])) {
                    $vehicle = $contactData['Loại xe'];
                } elseif (!empty($contactData['Xe quan tâm'])) {
                    $vehicle = $contactData['Xe quan tâm'];
                } elseif (!empty($contactData['Product']['title'])) {
                    $vehicle = $contactData['Product']['title'];
                }

                // Nhận diện nguồn form & tiêu đề cảnh báo
                $rawMessage = $contactData['Ghi chú yêu cầu thêm']
                    ?? $contactData['Nội dung yêu cầu dịch vụ']
                    ?? $contactData['Ghi chú thêm']
                    ?? $contactData['Lời nhắn']
                    ?? $contactData['Ý kiến đóng góp khác']
                    ?? $contactData['Nội dung yêu cầu'] 
                    ?? $contactData['Nội dung cần hỗ trợ'] 
                    ?? $contactData['Nội dung quan tâm'] 
                    ?? $contactData['Nội dung'] 
                    ?? $contactData['Ghi chú'] 
                    ?? $contactData['Message'] 
                    ?? $contactData['message'] 
                    ?? $contactData['note'] 
                    ?? '';

                $formSource = '✉️ Form Liên Hệ & Đóng Góp Ý Kiến (Tab Liên hệ khác)';
                $formTitle = '✉️ LIÊN HỆ & ĐÓNG GÓP Ý KIẾN';
                $formType = 'general';
                $cleanMessage = $rawMessage;

                if (str_contains($rawMessage, '[Đăng ký tư vấn từ popup trang chủ]')) {
                    $formSource = '🎯 Popup Đăng Ký Tư Vấn (Trang Chủ)';
                    $formTitle = '🚘 ĐĂNG KÝ TƯ VẤN FORD';
                    $formType = 'quote';
                    $cleanMessage = trim(str_replace(['[Đăng ký tư vấn từ popup trang chủ]', '- Nội dung quan tâm:'], '', $rawMessage));
                } elseif (str_contains($rawMessage, '[Đăng ký tư vấn từ bài viết:')) {
                    $formSource = '📰 Form Tư Vấn Bài Viết Tin Tức';
                    $formTitle = '📰 TƯ VẤN TỪ BÀI VIẾT TIN TỨC';
                    $formType = 'quote';
                    $cleanMessage = trim(preg_replace('/\[Đăng ký tư vấn từ bài viết:[^\]]+\]/', '', $rawMessage));
                } elseif ($type === 'REPAIR_QUOTE_FORM') {
                    $formSource = '🔧 Form Báo Giá Sửa Chữa (Tab Báo giá sửa chữa)';
                    $formTitle = '🔧 TƯ VẤN & BÁO GIÁ SỬA CHỮA XE';
                    $formType = 'repair_quote';
                } elseif ($type === 'SERVICE_BOOKING') {
                    $formSource = '📅 Form Đặt Lịch Dịch Vụ (Tab Đặt lịch dịch vụ)';
                    $formTitle = '🛠️ ĐẶT HẸN DỊCH VỤ TRỰC TUYẾN';
                    $formType = 'service_booking';
                } elseif ($type === 'NEW_CAR_QUOTE_FORM') {
                    $formSource = '💰 Form Báo Giá Xe Mới (Tab Mua xe mới)';
                    $formTitle = '🚗 YÊU CẦU BÁO GIÁ XE MỚI';
                    $formType = 'new_car_quote';
                } elseif ($type === 'TEST_DRIVE') {
                    $formSource = '🚘 Form Đăng Ký Lái Thử';
                    $formTitle = '🚘 ĐĂNG KÝ LÁI THỬ XE';
                    $formType = 'test_drive';
                } elseif ($type === 'APPLY_FORM') {
                    $formSource = '💼 Form Ứng Tuyển Tuyển Dụng';
                    $formTitle = '💼 HỒ SƠ ỨNG TUYỂN MỚI';
                    $formType = 'apply';
                } elseif ($type === 'ADVISE_FORM') {
                    $reqKind = $contactData['Loại yêu cầu'] ?? '';
                    $prodType = $contactData['Product']['type'] ?? 'vehicle';
                    if (str_contains(mb_strtolower($reqKind), 'lăn bánh') || !empty($contactData['Tổng dự toán lăn bánh'])) {
                        $formTitle = '💰 DỰ TOÁN CHI PHÍ LĂN BÁNH & BÁO GIÁ XE';
                        $formSource = '💰 Form Dự Toán Chi Phí Lăn Bánh';
                        $formType = 'rolling_cost';
                    } elseif (str_contains(mb_strtolower($reqKind), 'lái thử')) {
                        $formTitle = '🚘 ĐĂNG KÝ LÁI THỬ XE';
                        $formSource = '🚘 Form Đăng Ký Lái Thử';
                        $formType = 'test_drive';
                    } elseif ($prodType === 'used_vehicle') {
                        $formTitle = '🚘 TƯ VẤN XE ĐÃ QUA SỬ DỤNG (FORD ASSURED)';
                        $formSource = '🚘 Form Tư Vấn Xe Đã Qua Sử Dụng';
                        $formType = 'used_vehicle';
                    } elseif ($prodType === 'accessory') {
                        $formTitle = '🧩 ĐĂNG KÝ TƯ VẤN & LẮP ĐẶT PHỤ KIỆN';
                        $formSource = '🧩 Form Tư Vấn Phụ Kiện Chính Hãng';
                        $formType = 'accessory';
                    } else {
                        $formTitle = !empty($reqKind) ? '🚗 ' . mb_strtoupper($reqKind) : '🚗 ĐĂNG KÝ TƯ VẤN & NHẬN BÁO GIÁ XE';
                        $formSource = (!empty($contactData['source']) && $contactData['source'] !== 'landing_page_consultation')
                            ? $contactData['source']
                            : '🎯 Form Đăng Ký Tư Vấn & Báo Giá';
                        $formType = 'new_car_quote';
                    }
                } elseif ($type === 'TEST_DRIVE_SURVEY') {
                    $formTitle = '⭐ KHẢO SÁT TRẢI NGHIỆM LÁI THỬ';
                    $formSource = '📋 Form Khảo Sát Lái Thử';
                    $formType = 'survey';
                    $vehicle = $vehicle ?: ($contactData['Dòng xe lái thử'] ?? null);
                } elseif ($type === 'SERVICE_SURVEY') {
                    $formTitle = '⭐ KHẢO SÁT CHẤT LƯỢNG DỊCH VỤ';
                    $formSource = '📋 Form Khảo Sát Dịch Vụ';
                    $formType = 'survey';

                } elseif ($type === 'LDP_CLICK_CALL') {
                    $formSource = $contactData['source'] ?? '📞 Khách bấm nút Gọi điện trên LDP';
                    $formTitle = '📞 KHÁCH BẤM NÚT GỌI ĐIỆN TRÊN LDP';
                    $formType = 'ldp_click_call';
                    $vehicle = $vehicle ?: ($contactData['Dòng xe khách đang xem'] ?? null);
                } elseif ($type === 'LDP_CLICK_ZALO') {
                    $formSource = $contactData['source'] ?? '💬 Khách bấm nút Chat Zalo trên LDP';
                    $formTitle = '💬 KHÁCH BẤM NÚT CHAT ZALO TRÊN LDP';
                    $formType = 'ldp_click_zalo';
                    $vehicle = $vehicle ?: ($contactData['Dòng xe khách đang xem'] ?? null);
                } elseif ($type === 'CONTACT_FORM') {
                    $formSource = '✉️ Form Liên Hệ & Đóng Góp Ý Kiến (Tab Liên hệ khác)';
                    $formTitle = '✉️ LIÊN HỆ & ĐÓNG GÓP Ý KIẾN';
                    $formType = 'general';
                }

                // Dịch vụ / Gói dịch vụ đã chọn
                $serviceList = [];
                if (!empty($contactData['Gói dịch vụ'])) {
                    $serviceList[] = $contactData['Gói dịch vụ'];
                }
                if (!empty($contactData['Mốc bảo dưỡng'])) {
                    $serviceList[] = 'Mốc ' . $contactData['Mốc bảo dưỡng'];
                }
                if (!empty($contactData['Service']['title'])) {
                    $serviceList[] = $contactData['Service']['title'];
                }
                if (!empty($contactData['Phụ kiện quan tâm'])) {
                    $serviceList[] = 'Phụ kiện: ' . $contactData['Phụ kiện quan tâm'];
                }
                if (!empty($contactData['Vị trí ứng tuyển'])) {
                    $serviceList[] = 'Vị trí: ' . $contactData['Vị trí ứng tuyển'];
                }
                if (!empty($contactData['Job']['title'])) {
                    $serviceList[] = 'Vị trí ứng tuyển: ' . $contactData['Job']['title'];
                }
                if (!empty($contactData['CarModel'])) {
                    $serviceList[] = 'Dòng xe lắp đặt: ' . $contactData['CarModel'];
                }
                if (!empty($contactData['Mức độ hài lòng chung'])) {
                    $serviceList[] = 'Đánh giá: ' . $contactData['Mức độ hài lòng chung'];
                }
                $selectedService = !empty($serviceList) ? implode(' - ', $serviceList) : null;

                // Hình thức mua xe / Phương thức thanh toán
                $paymentMethod = $contactData['Hình thức mua xe'] 
                    ?? $contactData['Hình thức mua'] 
                    ?? $contactData['Hình thức thanh toán'] 
                    ?? $contactData['Phương thức thanh toán'] 
                    ?? null;

                // Tỉnh thành nhận xe / Nơi ở
                $city = $contactData['Tỉnh / Thành phố'] 
                    ?? $contactData['Tỉnh / Thành phố nhận xe'] 
                    ?? $contactData['Tỉnh/Thành phố'] 
                    ?? $contactData['Tỉnh/Thành'] 
                    ?? $contactData['Khu vực'] 
                    ?? $contactData['Province']
                    ?? $contactData['City'] 
                    ?? null;

                // Lịch hẹn & Địa điểm
                $appointment = null;
                if (!empty($contactData['Thời gian hẹn'])) {
                    $rawDate = $contactData['Thời gian hẹn'];
                    if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $rawDate, $m)) {
                        $appointment = "{$m[3]}/{$m[2]}/{$m[1]}";
                    } else {
                        $appointment = $rawDate;
                    }
                } elseif (!empty($contactData['InstallDate']) || !empty($contactData['Ngày thực hiện dịch vụ'])) {
                    $rawDate = $contactData['InstallDate'] ?? $contactData['Ngày thực hiện dịch vụ'];
                    $appointment = preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $rawDate, $m) ? "{$m[3]}/{$m[2]}/{$m[1]}" : $rawDate;
                } elseif (!empty($contactData['Ngày lái thử'])) {
                    $appointment = $contactData['Ngày lái thử'] . (!empty($contactData['Thời gian lái thử']) ? ' (' . $contactData['Thời gian lái thử'] . ')' : '');
                }

                $location = $contactData['Địa điểm làm dịch vụ'] 
                    ?? $contactData['Tại'] 
                    ?? $contactData['Địa điểm'] 
                    ?? null;

                $leadData = [
                    'source' => $formSource,
                    'title' => $formTitle,
                    'type' => $formType,
                    'name' => $contactName,
                    'phone' => $contactPhone,
                    'email' => $contactEmail,
                    'vehicle' => $vehicle,
                    'service' => $selectedService,
                    'payment_method' => $paymentMethod,
                    'city' => $city,
                    'rolling_cost' => $contactData['Tổng dự toán lăn bánh'] ?? null,
                    'message' => $cleanMessage,
                    'license_plate' => $contactData['Biển số xe'] ?? null,
                    'mileage' => $contactData['Số KM hiện tại'] ?? null,
                    'appointment' => $appointment,
                    'location' => $location,
                    'score' => 'HOT',
                ];

                $ldpIdForTg = $contactData['landing_page_id'] ?? $requestData['landing_page_id'] ?? null;
                $scIdForTg = $requestData['sales_consultant_id'] ?? $contactData['sales_consultant_id'] ?? null;
                $tgChatIds = [];
                $tgConsultantName = null;
                if (!empty($ldpIdForTg) && ($ldpForTg = LandingPage::with('salesConsultant')->find($ldpIdForTg))) {
                    if (!empty($ldpForTg->telegram_chat_id)) {
                        $tgChatIds[] = $ldpForTg->telegram_chat_id;
                    }
                    $scIdForTg = $scIdForTg ?: $ldpForTg->sales_consultant_id;
                    $tgConsultantName = $ldpForTg->salesConsultant?->name;
                }
                if (!empty($scIdForTg)) {
                    $tgConsultantName = $tgConsultantName ?: SalesConsultant::find($scIdForTg)?->name;
                    if (empty($tgChatIds)) {
                        $tgChatIds = LandingPage::where('sales_consultant_id', $scIdForTg)
                            ->whereNotNull('telegram_chat_id')
                            ->where('telegram_chat_id', '!=', '')
                            ->pluck('telegram_chat_id')
                            ->all();
                    }
                }
                if (!empty($tgConsultantName)) {
                    $leadData['consultant_name'] = $tgConsultantName;
                    $leadData['source'] .= " (LDP: {$tgConsultantName})";
                }
                $tgConsultantObj = !empty($scIdForTg) ? SalesConsultant::find($scIdForTg) : ($ldpForTg->salesConsultant ?? null);
                $leadData['consultant_phone'] = $tgConsultantObj?->phone ?: ($contactData['SĐT Cố vấn nhận liên hệ'] ?? null);
                $leadData['button_position'] = $contactData['Vị trí nút bấm trên trang']
                    ?? $contactData['Vị trí nút bấm']
                    ?? $contactData['button_position']
                    ?? null;
                $leadData['page_url'] = $contactData['Đường dẫn trang (URL)']
                    ?? $contactData['Trang LDP']
                    ?? $contactData['page_url']
                    ?? null;
                $leadData['telegram_chat_ids'] = $tgChatIds;

                $telegramService->sendHotLeadAlert($leadData, 'FORM-' . $createdContact->id);
            } catch (\Throwable $e) {
                try { \Illuminate\Support\Facades\Log::error('Telegram form notification error: ' . $e->getMessage()); } catch (\Throwable $_) {}
            }

            // Tự động gửi Email thông báo Lead mới (Khóa 1-1: Cố vấn phụ trách + Admin BCC cố định; bỏ qua click Call/Zalo để tránh spam mail)
            if (!in_array($rawType, ['LDP_CLICK_CALL', 'LDP_CLICK_ZALO'], true))
            try {
                $contactData = $requestData['data'] ?? [];
                $landingPageId = $contactData['landing_page_id'] ?? $requestData['landing_page_id'] ?? null;
                $salesConsultantId = $requestData['sales_consultant_id'] ?? $contactData['sales_consultant_id'] ?? null;

                $consultantEmails = [];

                // 1. Email từ trường sales_email gửi trực tiếp từ form hoặc LDP
                $salesEmail = $contactData['sales_email'] ?? $requestData['sales_email'] ?? null;
                if (!empty($salesEmail) && filter_var(trim($salesEmail), FILTER_VALIDATE_EMAIL)) {
                    $consultantEmails[] = trim($salesEmail);
                }

                // 2. Nếu có landing_page_id, truy vấn Landing Page để lấy sales_email cấu hình và email của cố vấn
                $landingPage = null;
                if (!empty($landingPageId)) {
                    try {
                        $landingPage = LandingPage::with('salesConsultant')->find($landingPageId);
                        if ($landingPage) {
                            if (!empty($landingPage->sales_email) && filter_var(trim($landingPage->sales_email), FILTER_VALIDATE_EMAIL)) {
                                $consultantEmails[] = trim($landingPage->sales_email);
                            }
                            if ($landingPage->salesConsultant && !empty($landingPage->salesConsultant->email) && filter_var(trim($landingPage->salesConsultant->email), FILTER_VALIDATE_EMAIL)) {
                                $consultantEmails[] = trim($landingPage->salesConsultant->email);
                            }
                            if (empty($salesConsultantId) && $landingPage->sales_consultant_id) {
                                $salesConsultantId = $landingPage->sales_consultant_id;
                            }
                        }
                    } catch (\Throwable $e) {
                        \Illuminate\Support\Facades\Log::warning('Error loading LandingPage for email notification: ' . $e->getMessage());
                    }
                }

                // 3. Nếu có sales_consultant_id
                $consultant = null;
                if (!empty($salesConsultantId)) {
                    try {
                        $consultant = SalesConsultant::find($salesConsultantId);
                        if (empty($landingPage?->sales_email)) {
                            $ldpEmails = LandingPage::where('sales_consultant_id', $salesConsultantId)
                                ->where('status', 'ACTIVE')
                                ->whereNotNull('sales_email')
                                ->where('sales_email', '!=', '')
                                ->pluck('sales_email');
                            foreach ($ldpEmails as $le) {
                                if (filter_var(trim($le), FILTER_VALIDATE_EMAIL)) {
                                    $consultantEmails[] = trim($le);
                                }
                            }
                        }
                        if ($consultant && !empty($consultant->email) && filter_var(trim($consultant->email), FILTER_VALIDATE_EMAIL)) {
                            $consultantEmails[] = trim($consultant->email);
                        }
                    } catch (\Throwable $e) {
                        \Illuminate\Support\Facades\Log::warning('Error loading SalesConsultant for email notification: ' . $e->getMessage());
                    }
                }

                $consultantEmails = array_values(array_unique(array_filter($consultantEmails)));
                $adminBccEmails = [];
                $rawAdminBcc = function_exists('notification_admin_bcc') ? notification_admin_bcc() : config('contact.admin_bcc_email', '');
                if (!empty($rawAdminBcc)) {
                    $bccParts = is_array($rawAdminBcc) ? $rawAdminBcc : explode(',', (string) $rawAdminBcc);
                    foreach ($bccParts as $bccItem) {
                        $bccItem = trim((string) $bccItem);
                        if (filter_var($bccItem, FILTER_VALIDATE_EMAIL)) {
                            $adminBccEmails[] = $bccItem;
                        }
                    }
                }
                $adminBccEmails = array_values(array_unique($adminBccEmails));

                $targetEmails = [];
                if (!empty($consultantEmails)) {
                    // Lead ĐÃ có Cố vấn phụ trách: chỉ gửi 1-1 cho Cố vấn (không cộng dồn notification_to)
                    $targetEmails = $consultantEmails;
                } else {
                    $generalEmailSetting = function_exists('notification_to') ? notification_to() : null;
                    if (!empty($generalEmailSetting)) {
                        $arr = is_array($generalEmailSetting) ? $generalEmailSetting : explode(',', (string) $generalEmailSetting);
                        foreach ($arr as $gm) {
                            $gm = trim((string) $gm);
                            if (filter_var($gm, FILTER_VALIDATE_EMAIL)) {
                                $targetEmails[] = $gm;
                            }
                        }
                    }
                    if (empty($targetEmails) && !empty($adminBccEmails)) {
                        $targetEmails = $adminBccEmails;
                    }
                    if (empty($targetEmails)) {
                        $defaultMail = config('mail.from.address') ?: 'admin@longkhanhford.com.vn';
                        if (filter_var($defaultMail, FILTER_VALIDATE_EMAIL)) {
                            $targetEmails[] = $defaultMail;
                        }
                    }
                }
                $targetEmails = array_values(array_unique(array_filter($targetEmails)));

                if (config('contact.send_email_default', true) && !empty($targetEmails)) {
                    $consultantName = $consultant?->name ?? $landingPage?->salesConsultant?->name ?? '';
                    $isLandingPage = !empty($landingPageId) || !empty($salesConsultantId) || !empty($salesEmail);

                    $isTestDrive = ($requestData['type'] ?? '') === 'TEST_DRIVE'
                        || ($contactData['Loại yêu cầu'] ?? '') === 'Đăng ký lái thử xe'
                        || str_contains(mb_strtolower($formTitle ?? ''), 'lái thử')
                        || str_contains(mb_strtolower($cleanMessage ?? ''), 'lái thử')
                        || str_contains(mb_strtolower($formSource ?? ''), 'lái thử');

                    $submittedAt = now()->timezone('Asia/Ho_Chi_Minh')->format('H:i d/m/Y');
                    $subjectSuffix = " #{$createdContact->id} - {$submittedAt}";

                    if ($isTestDrive) {
                        $mailSubject = '🚗💨 [Đăng Ký Lái Thử' . ($consultantName ? " - {$consultantName}" : '') . '] ' . $contactName . ($vehicle ? " - {$vehicle}" : '') . $subjectSuffix;
                    } elseif ($isLandingPage) {
                        $mailSubject = '🔥 [Landing Page' . ($consultantName ? " - {$consultantName}" : '') . '] ' . ($vehicle ? "Báo giá {$vehicle}: " : 'Báo giá xe mới: ') . $contactName . $subjectSuffix;
                    } else {
                        $mailSubject = '🔥 [Long Khánh Ford] ' . ($formTitle ?? 'Yêu cầu liên hệ mới') . ': ' . $contactName . $subjectSuffix;
                    }

                    $emailData = [
                        'mail_title' => $mailSubject,
                        'Loại yêu cầu' => $isTestDrive ? 'Đăng ký lái thử xe' : ($contactData['Loại yêu cầu'] ?? ($formTitle ?? 'Yêu cầu tư vấn báo giá')),
                        'Họ và tên khách hàng' => $contactName,
                        'Số điện thoại' => $contactPhone,
                    ];

                    if (!empty($contactEmail)) {
                        $emailData['Email khách hàng'] = $contactEmail;
                    }
                    if (!empty($vehicle)) {
                        $emailData[$isTestDrive ? 'Dòng xe đăng ký lái thử' : 'Dòng xe quan tâm'] = $vehicle;
                    }
                    if (!empty($contactData['Tổng dự toán lăn bánh'])) {
                        $emailData['Tổng dự toán lăn bánh'] = $contactData['Tổng dự toán lăn bánh'];
                    }
                    if (!empty($city)) {
                        $emailData['Khu vực sinh sống'] = $city;
                    }
                    if (!empty($cleanMessage)) {
                        $emailData['Ghi chú yêu cầu thêm'] = $cleanMessage;
                    }
                    if (!empty($selectedService)) {
                        $emailData['Dịch vụ quan tâm'] = $selectedService;
                    }
                    if (!empty($paymentMethod)) {
                        $emailData['Hình thức mua xe'] = $paymentMethod;
                    }
                    if (!empty($appointment)) {
                        $emailData['Thời gian hẹn'] = $appointment;
                    }
                    if (!empty($location)) {
                        $emailData['Địa điểm'] = $location;
                    }
                    if ($isLandingPage && !empty($consultantName)) {
                        $emailData['Cố vấn phụ trách'] = $consultantName;
                    }
                    $emailData['Nguồn gửi'] = $formSource ?? ($isTestDrive ? 'Form Đăng Ký Lái Thử Xe' : 'Website');
                    $emailData['Thời gian'] = $submittedAt;
                    try {
                        $emailData['url'] = $createdContact->getUrl();
                    } catch (\Throwable $_) {
                        $emailData['url'] = url('/admin/contacts/form/' . $createdContact->id);
                    }

                    $targetEmailsLower = array_map('mb_strtolower', $targetEmails);
                    $bccList = array_values(array_filter($adminBccEmails, function ($bccEmail) use ($targetEmailsLower) {
                        return !in_array(mb_strtolower($bccEmail), $targetEmailsLower, true);
                    }));
                    $bccSent = false;

                    foreach ($targetEmails as $recipientEmail) {
                        try {
                            $recipientEmailData = $emailData;
                            if (!$bccSent && !empty($bccList)) {
                                $recipientEmailData['bcc_emails'] = $bccList;
                            }
                            Notification::route('mail', $recipientEmail)
                                ->notifyNow(new CommonNotification($recipientEmailData));
                            $bccSent = true;
                            try { \Illuminate\Support\Facades\Log::info("Sent contact notification email to: {$recipientEmail} for contact ID {$createdContact->id}"); } catch (\Throwable $_) {}
                        } catch (\Throwable $e) {
                            try { \Illuminate\Support\Facades\Log::error("Failed to send contact notification email to {$recipientEmail}: " . $e->getMessage()); } catch (\Throwable $_) {}
                        }
                    }
                }
            } catch (\Throwable $e) {
                try { \Illuminate\Support\Facades\Log::error('Contact notification email general error: ' . $e->getMessage()); } catch (\Throwable $_) {}
            }

            if ($request->wantsJson() || $request->ajax()) {
                return $this->success($requestData, 'Gửi yêu cầu thành công!');
            }

            return redirect()->back()->withSuccess('success');
        } catch (\Throwable $th) {
            if ($request->wantsJson() || $request->ajax()) {
                return $this->failure($th->getMessage(), 500);
            }
            throw $th;
        }
    }

    public function sendEmail($contact, $mailNotification = null)
    {
        if ($contact->status === Contact::STATUS_IS_SPAM) {
            $emails = explode(',', config('contact.mail_spam', 'khapcn.flamedia@gmail.com'));

            $data['mail_title'] = config('contact.message.new_spam', 'Thông báo nhận được Spam');

            $data = array_merge($data, $contact->data);

            $route = config('contact.types.' . $contact->type . '.route');

            $data['url'] = route(current_locale() . '.admin.' . $route . '.form', ['id' => $contact->id]);

            foreach ($emails as $email) {
                Notification::route('mail', $email)
                    ->notify(new CommonNotification($data));
            }
        } else {
            $emails = empty($mailNotification) ? explode(',', notification_to()) : explode(',', $mailNotification);
            $data['mail_title'] = config('contact.message.new_contact');

            $contactData = $contact->data;
            $emailData = [
                'mail_title' => config('contact.message.new_contact')
            ];

            if ($contact->type == 'CONTACT_FORM') {
                $emailData = array_merge($emailData, [
                    'Name' => $contactData['Họ và tên'],
                    'Phone' => $contactData['Số điện thoại'],
                    'Email' => $contactData['Email'],
                    'Note' => $contactData['Nội dung cần hỗ trợ'],
                    'Service' => $contactData['Service']['title'],
                    'Service link' => route(current_locale() . '.services.show', ['slug' => $contactData['Service']['slug']]),
                    'url' => route(current_locale() . '.admin.contacts.form', ['id' => $contact->id])
                ]);
            } else if ($contact->type == 'SERVICE_BOOKING') {
                $emailData = [
                    'mail_title' => 'Yêu cầu dịch vụ - Long Khánh Ford',
                    'customer_name' => $contactData['Họ và tên'],
                    'phone' => $contactData['Số điện thoại'],
                    'email' => $contactData['E-mail'] ?? '--',
                    'license_plate' => $contactData['Biển số xe'],
                    'appointment_time' => $contactData['Thời gian hẹn'],
                    'content' => $contactData['Nội dung yêu cầu dịch vụ'] ?? '',
                    'location' => $contactData['Tại'],
                    'url' => route(current_locale() . '.admin.contacts.form', ['id' => $contact->id])
                ];
            } else if ($contact->type == 'APPLY_FORM') {
                $files = [];

                foreach ($contactData['File CV'] as $index => $cv) {
                    $link = str_replace(' ', '%20', str_replace("/static/", "/storage/", config('app.url') . $cv));
                    $files['File CV ' . $index + 1] = 'File CV: <a href="' . $link . '">' . $link . '</a>';
                }

                $emailData = array_merge($emailData, [
                    'Name' => $contactData['Họ và tên'],
                    'Phone' => $contactData['Phone'],
                    'Email' => $contactData['Email'],
                    'Job' => $contactData['Job']['title'],
                    'Job link' => route(current_locale() . '.jobs.show', ['slug' => $contactData['Job']['slug']]),
                    'File cv' => $files,
                    'url' => route(current_locale() . '.admin.applies.form', ['id' => $contact->id])
                ]);
            }

            foreach ($emails as $email) {
                if ($contact->type == 'SERVICE_BOOKING') {
                    Notification::route('mail', $email)
                        ->notify(new ServiceBookingNotification($emailData));
                } else {
                    Notification::route('mail', $email)
                        ->notify(new CommonNotification($emailData));
                }
            }
        }

        // send customer
        if (method_exists($contact, 'transformEmailDetails')) {
            $data = $contact->transformEmailDetails();

            if (isset($data['File CV']['CV 1'])) {
                $data['File CV']['CV 1'] = 'File CV: <a href="' . $data['File CV']['CV 1'] . '">' . $data['File CV']['CV 1'] . '</a>';
            }
        } else {
            $data = $contact->data;
        }

        $data['mail_title'] = config('contact.message.success_form');
        $emailTo = $data['Email'] ?? $data['E-mail'] ?? null;
        if ($emailTo) {
            Notification::route('mail', $emailTo)
                ->notify(new CommonNotification($data));
        }
    }
}
