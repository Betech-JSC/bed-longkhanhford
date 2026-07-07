<?php

namespace App\Traits;

use Illuminate\Support\Facades\Notification;
use JamstackVietnam\Contact\Notifications\CommonNotification;
use JamstackVietnam\Contact\Models\Contact;
use App\Http\Notifications\ServiceBookingNotification;

trait HasNotification
{
    public static function bootHasNotification()
    {
        static::created(function ($model) {
            if (request()->route() === null || !config('contact.send_email_default', true)) return;

            if ($model->status === Contact::STATUS_IS_SPAM) {
                $emails = [config('contact.mail_spam', '')];

                $data['mail_title'] = config('contact.message.new_spam', 'Thông báo nhận được Spam');

                $data = array_merge($data, $model->data);

                $route = config('contact.types.' . $model->type . '.route');

                $data['url'] = route(current_locale() . '.admin.' . $route . '.form', ['id' => $model->id]);

                foreach ($emails as $email) {
                    Notification::route('mail', $email)
                        ->notify(new CommonNotification($data));
                }
            } else {
                $emails = array_filter(explode(',', notification_to()));
                if (empty($emails)) {
                    $emails = [config('contact.mail_spam') ?: 'admin@dongnaiford.com.vn'];
                }

                if ($model->type === 'SERVICE_BOOKING') {
                    $contactData = $model->data;
                    $emailData = [
                        'mail_title' => 'Yêu cầu dịch vụ - Đồng Nai Ford',
                        'customer_name' => $contactData['Họ và tên'],
                        'phone' => $contactData['Số điện thoại'],
                        'email' => $contactData['E-mail'] ?? '--',
                        'license_plate' => $contactData['Biển số xe'],
                        'appointment_time' => $contactData['Thời gian hẹn'],
                        'content' => $contactData['Nội dung yêu cầu dịch vụ'] ?? '',
                        'location' => $contactData['Tại'],
                        'url' => route(current_locale() . '.admin.contacts.form', ['id' => $model->id])
                    ];

                    foreach ($emails as $email) {
                        Notification::route('mail', $email)
                            ->notify(new ServiceBookingNotification($emailData));
                    }
                } else {
                    $data['mail_title'] = config('contact.message.new_contact');

                    if (method_exists($model, 'transformEmail')) {
                        $data = array_merge($data, $model->transformEmail());
                    } else {
                        $data = array_merge($data, $model->data);
                    }

                    foreach ($emails as $email) {
                        Notification::route('mail', $email)
                            ->notify(new CommonNotification($data));
                    }
                }
            }

            // send customer
            if (method_exists($model, 'transformEmailDetails')) {
                $data = $model->transformEmailDetails();
            } else {
                $data = $model->data;
            }

            $data['mail_title'] = config('contact.message.success_form');
            $emailTo = $data['Email'] ?? $data['E-mail'] ?? null;
            if ($emailTo) {
                Notification::route('mail', $emailTo)
                    ->notify(new CommonNotification($data));
            }
        });
    }
}

