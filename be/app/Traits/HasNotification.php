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
            if (request()->route() === null || !config('contact.send_email_default', false)) return;

            try {
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
                        $emails = [config('contact.mail_spam') ?: 'admin@longkhanhford.com.vn'];
                    }

                    // Tùy biến email nhận thông báo về Sale nếu form gửi từ Landing Page hoặc có cấu hình sales_email
                    $salesEmail = null;
                    if (!empty($model->data['sales_email']) && filter_var($model->data['sales_email'], FILTER_VALIDATE_EMAIL)) {
                        $salesEmail = trim($model->data['sales_email']);
                    } elseif (!empty($model->data['landing_page_id'])) {
                        $ldp = \App\Models\Vehicle\LandingPage::find($model->data['landing_page_id']);
                        if ($ldp && !empty($ldp->sales_email) && filter_var($ldp->sales_email, FILTER_VALIDATE_EMAIL)) {
                            $salesEmail = trim($ldp->sales_email);
                        }
                    } elseif (!empty($model->sales_consultant_id)) {
                        $ldp = \App\Models\Vehicle\LandingPage::where('sales_consultant_id', $model->sales_consultant_id)
                            ->whereNotNull('sales_email')
                            ->first();
                        if ($ldp && !empty($ldp->sales_email) && filter_var($ldp->sales_email, FILTER_VALIDATE_EMAIL)) {
                            $salesEmail = trim($ldp->sales_email);
                        } elseif ($model->salesConsultant && !empty($model->salesConsultant->email) && filter_var($model->salesConsultant->email, FILTER_VALIDATE_EMAIL)) {
                            $salesEmail = trim($model->salesConsultant->email);
                        }
                    }

                    if ($salesEmail) {
                        $emails = [$salesEmail];
                    }

                    if ($model->type === 'SERVICE_BOOKING') {
                        $contactData = $model->data ?? [];
                        $emailData = [
                            'mail_title' => 'Yêu cầu dịch vụ - Long Khánh Ford',
                            'customer_name' => $contactData['Họ và tên'] ?? $contactData['Name'] ?? 'Khách hàng',
                            'phone' => $contactData['Số điện thoại'] ?? $contactData['Phone'] ?? '--',
                            'email' => $contactData['E-mail'] ?? $contactData['Email'] ?? '--',
                            'license_plate' => $contactData['Biển số xe'] ?? '--',
                            'appointment_time' => $contactData['Thời gian hẹn'] ?? '--',
                            'content' => $contactData['Nội dung yêu cầu dịch vụ'] ?? $contactData['Nội dung'] ?? '',
                            'location' => $contactData['Tại'] ?? $contactData['Địa điểm làm dịch vụ'] ?? 'Long Khánh Ford',
                            'url' => route(current_locale() . '.admin.service-bookings.form', ['id' => $model->id])
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
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('SMTP Mail sending failed: ' . $e->getMessage());
            }
        });
    }
}
