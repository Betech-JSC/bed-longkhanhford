<?php

namespace App\Http\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;
use Illuminate\Support\HtmlString;
use Illuminate\Contracts\Queue\ShouldQueue;

class CommonNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $data;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $email = (new MailMessage)
            ->subject($this->data['mail_title'])
            ->greeting($this->data['mail_title']);

        $bccEmails = $this->data['bcc_emails'] ?? [];
        if (is_string($bccEmails)) {
            $bccEmails = array_values(array_filter(array_map('trim', explode(',', $bccEmails)), fn ($e) => filter_var($e, FILTER_VALIDATE_EMAIL)));
        } elseif (is_array($bccEmails)) {
            $bccEmails = array_values(array_unique(array_filter(array_map('trim', $bccEmails), fn ($e) => filter_var($e, FILTER_VALIDATE_EMAIL))));
        } else {
            $bccEmails = [];
        }

        if (!empty($bccEmails)) {
            $email->bcc($bccEmails);
        }

        // Gắn X-Entity-Ref-ID riêng cho mỗi lead để Gmail không gộp chung các email khách hàng khác nhau vào 1 luồng
        $email->withSymfonyMessage(function ($message) {
            $message->getHeaders()->addTextHeader('X-Entity-Ref-ID', uniqid('lkf-lead-', true));
        });

        foreach ($this->data as $key => $value) {
            if (!in_array($key, ['mail_title', 'bcc_emails'], true)) {
                if (is_array($this->data[$key])) {
                    foreach ($this->data[$key] as $item => $res) {
                        if (in_array(str_replace('_', ' ', $item), config('contact.html_string', []))) {
                            $email->line(new HtmlString($res));
                        } else {
                            $email->line(Str::title(str_replace('_', ' ', $item)) . ': ' . $res);
                        }
                    }
                }
                if(!is_array($this->data[$key])) {
                    $isUrl = false;
                    foreach(config('contact.email_urls') as $key_url => $message) {
                        if($key == $key_url) {
                            $email->line(new HtmlString($this->bottom($message, $value)));
                            $isUrl = true;
                        }
                    }
                    if(!$isUrl) {
                        $email->line(Str::title(str_replace('_', ' ', $key)) . ': ' . $value);
                    }
                }
            }
        }

        return $email;
    }

    public function bottom($title, $url)
    {
        return '<div style="display: flex; justify-content: center; margin-top: 12px; margin-bottom: 12px">
        <a href="'.$url.'" style="box-sizing:border-box; border-radius:4px; display:inline-flex; justify-content: center; margin: 0 auto; padding-top: 8px; padding-bottom: 8px; padding-left: 18px; padding-right: 18px; background-color: #2d3748; text-decoration: none; color: white">'.$title.'</a>
        </div>';
    }
}
