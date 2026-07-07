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

            $this->model::create($requestData);

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
                    'mail_title' => 'Yêu cầu dịch vụ - Đồng Nai Ford',
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
