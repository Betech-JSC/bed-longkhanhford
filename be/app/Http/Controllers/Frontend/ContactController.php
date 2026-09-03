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
            $data = $request->input('contact')['data'];
            $requestData = $request->all()['contact'];
            $requestData['type'] = $requestData['type'] ?? key(config('contact.types'));
            $rules = config('contact.types.' . $requestData['type'] . '.rules');
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
                $rawMessage = $contactData['Nội dung yêu cầu'] 
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
                } elseif ($type === 'REPAIR_QUOTE_FORM' || str_contains(mb_strtolower($rawMessage), 'sửa chữa')) {
                    $formSource = '🔧 Form Báo Giá Sửa Chữa (Tab Báo giá sửa chữa)';
                    $formTitle = '🔧 TƯ VẤN & BÁO GIÁ SỬA CHỮA XE';
                    $formType = 'repair_quote';
                } elseif ($type === 'SERVICE_BOOKING' || str_contains(mb_strtolower($rawMessage), 'đặt hẹn') || str_contains(mb_strtolower($rawMessage), 'đặt lịch')) {
                    $formSource = '📅 Form Đặt Lịch Dịch Vụ (Tab Đặt lịch dịch vụ)';
                    $formTitle = '🛠️ ĐẶT HẸN DỊCH VỤ TRỰC TUYẾN';
                    $formType = 'service_booking';
                } elseif ($type === 'NEW_CAR_QUOTE_FORM' || str_contains(mb_strtolower($rawMessage), 'báo giá xe') || str_contains(mb_strtolower($rawMessage), 'mua xe')) {
                    $formSource = '💰 Form Báo Giá Xe Mới (Tab Mua xe mới)';
                    $formTitle = '🚗 YÊU CẦU BÁO GIÁ XE MỚI';
                    $formType = 'new_car_quote';
                } elseif ($type === 'TEST_DRIVE' || str_contains(mb_strtolower($rawMessage), 'lái thử')) {
                    $formSource = '🚘 Form Đăng Ký Lái Thử';
                    $formTitle = '🚘 ĐĂNG KÝ LÁI THỬ XE';
                    $formType = 'test_drive';
                } elseif ($type === 'APPLY_FORM') {
                    $formSource = '💼 Form Ứng Tuyển Tuyển Dụng';
                    $formTitle = '💼 HỒ SƠ ỨNG TUYỂN MỚI';
                    $formType = 'apply';
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
                    'message' => $cleanMessage,
                    'license_plate' => $contactData['Biển số xe'] ?? null,
                    'mileage' => $contactData['Số KM hiện tại'] ?? null,
                    'appointment' => $appointment,
                    'location' => $location,
                    'score' => 'HOT',
                ];

                $telegramService->sendHotLeadAlert($leadData, 'FORM-' . $createdContact->id);
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::error('Telegram form notification error: ' . $e->getMessage());
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
