<?php

return [
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
    ],
    'message' => [
        'new_contact' => 'Bạn nhận được liên hệ mới',
        'success_form' => 'Chúc mừng bạn gửi form thành công',
    ],
    'email_urls' => [
        'url' => 'Xem chi tiết liên hệ',
    ],
];
