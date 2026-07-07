### Nested contact for Laravel

- [Installation](#installation)
- [Config](#config)
- [Setting](#setting)
- [Usage](#usage)

### Installation

Install the package via Composer:

```bash
composer require jamstackvietnam/contact
```

Publish the migration file with:

```bash
php artisan vendor:publish --provider="JamstackVietnam\Contact\ServiceProvider" --tag="migrations"
```

### Config

```bash
php artisan vendor:publish --provider="JamstackVietnam\Contact\ServiceProvider" --tag="config"
```

### Setting
Default contact type is 'CONTACT_FORM'

You can add another type of system to the config file.

See the configuration below:

```php
    'types' => [
        'CONTACT_FORM' => [
            'title' => 'Liên hệ',
            'columns' => [
                'Email',
                'Phone',
            ],
            'all_columns' => [
                'Email',
                'Phone',
            ],
            'rules' => [
                'Phone' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12',
                'Email' => 'required',
            ],
            'route' => 'contacts',
        ],
        'APPLY_FORM' => [
            'title' => 'Ứng tuyển',
            'columns' => [
                'Email',
                'Phone',
            ],
            'all_columns' => [
                'Email',
                'Phone',
                'Post' => [
                    'column' => 'post_url',
                    'route' => [
                        'name' => 'post.show',
                        'params' => [
                            'slug',
                            'id',
                        ],
                    ],
                ],
                'File CV'
            ],
            'rules' => [
                'Phone' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12',
                'Email' => 'required',
                'File CV.*' => 'mimes:pdf|max:5120'
            ],
            'route' => 'contacts',
        ],
    ],
```

Next steps:

```php
    'email_urls' => [
        'url' => 'Xem chi tiết liên hệ',
        'post_url' => 'Chi tiết bài viết',
    ],
```

After the migration has been published you can create db tables by running:

```bash
php artisan migrate
```

### Usage


`routes/frontend.php`
```php
use JamstackVietnam\Contact\Controllers\ContactController;

Route::post('contact', [ContactController::class, 'store'])->name('contact.store');
```
