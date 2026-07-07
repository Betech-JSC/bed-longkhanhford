<?php

namespace JamstackVietnam\Contact\Models;

use JamstackVietnam\Contact\Rules\Blackwords;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Validator;
use JamstackVietnam\Core\Models\BaseModel;
use JamstackVietnam\Core\Traits\Searchable;
use JamstackVietnam\Contact\Traits\HasNotification;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contact extends BaseModel
{
    use HasFactory;
    use Searchable;
    use HasNotification;
    use SoftDeletes;

    const STATUS_NEW = 'NEW';
    const STATUS_RESPONSE = 'RESPONSE';
    const STATUS_PROCESSED = 'PROCESSED';
    const STATUS_CLOSE = 'CLOSE';
    const STATUS_IS_SPAM = 'IS_SPAM';

    public const STATUS_LIST = [
        self::STATUS_NEW => 'Mới',
        self::STATUS_RESPONSE => 'Đã phản hồi',
        self::STATUS_PROCESSED => 'Đã xử lý',
        self::STATUS_CLOSE => 'Đóng',
        self::STATUS_IS_SPAM => 'Spam',
    ];

    public function getFormattedStatusAttribute(): string
    {
        if (!empty($this->status)) {
            switch ($this->status) {
                case 'NEW':
                    return 'Mới';
                case 'RESPONSE':
                    return 'Đã phản hồi';
                case 'PROCESSED':
                    return 'Đã xử lý';
                case 'CLOSE':
                    return 'Đóng';
                case 'IS_SPAM':
                    return 'Spam';
                default:
                    return '';
            }
        }
        return '';
    }

    public $fillable = [
        'data',
        'type',
        'status',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    protected $appends = [
        'formatted_created_at',
        'formatted_updated_at',
        'data_contact'
    ];

    protected $searchable = [
        'columns' => [
            'contacts.data' => 10,
            'contacts.id' => 5,
            'contacts.status' => 5,
        ],
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->ip_address = $model->setIpAddress();
            $model->user_agent = $model->setUserAgent();
            $model->request_url = $model->setRequestUrl();
            $model->status = $model->setStatus();

            if ($model->status == self::STATUS_IS_SPAM) {
                $model->deleted_at = now();
            }
        });
    }

    public function modelRules()
    {
        return [
            'store' => [
                'data' => 'exclude_unless:id,null|array|max:20',
            ],
        ];
    }

    private function setIpAddress()
    {
        foreach (array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR') as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip);
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                        return $ip;
                    }
                }
            }
        }
        return request()->ip();
    }

    private function setUserAgent()
    {
        return $_SERVER['HTTP_USER_AGENT'];
    }

    private function setRequestUrl()
    {
        return request()->server->get('HTTP_REFERER');
    }

    private function setStatus()
    {
        return $this->isSpamContent() ? self::STATUS_IS_SPAM : self::STATUS_NEW;
    }

    private function isSpamContent()
    {
        $rules = ['*' => ['max:1000', new Blackwords]];
        return !Validator::make($this->data, $rules)->passes();
    }

    public function getDataContactAttribute()
    {
        return json_decode($this->attributes['data']);
    }

    public function getFormattedTypeAttribute()
    {
        return config('contact.types.' . $this->type . '.title') ?? '--';
    }

    public function transformEmail()
    {
        $data = ['Form' => $this->formatted_type];

        $columns = config('contact.types.' . $this->type . '.columns');
        foreach ($columns as $column) {
            $data[$column] = $this->data[$column] ?? null;
        }

        $data['url'] = $this->getUrl();
        return $data;
    }

    public function transformEmailDetails()
    {
        $data = ['Form' => $this->formatted_type];

        $columns = config('contact.types.' . $this->type . '.all_columns');
        foreach ($columns as $key => $column) {
            if (is_array($column) && isset($column['route']['name'])) {
                $params = [];
                foreach ($column['route']['params'] as $param) {
                    $params[$param] = $this->data[$key][$param] ?? null;
                }

                $routeLocale = config('app.locale');

                foreach (config('app.locales') as $locale) {
                    if (strpos($this->request_url, '/' . $locale . '/')) {
                        $routeLocale = $locale;
                    }
                }

                $data[$column['column']] = route($routeLocale . '.' . $column['route']['name'], $params);
            } else if ($column == 'File CV' && is_array($this->data[$column])) {
                $files = [];
                foreach ($this->data[$column] as $index => $file) {
                    $files['CV ' . $index + 1] = env('APP_URL') . $file;
                }
                $data[$column] = $files;
            } else {
                $data[$column] = $this->data[$column] ?? null;
            }
        }
        return $data;
    }

    public function getUrl()
    {
        $route = config('contact.types.' . $this->type . '.route');
        return route(current_locale() . '.admin.' . $route . '.form', ['id' => $this->id]);
    }
}
