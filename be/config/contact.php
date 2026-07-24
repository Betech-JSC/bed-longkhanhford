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
                'Name' => 'required',
            ],
            'route' => 'contacts',
        ],
        'ADVISE_FORM' => [
            'title' => 'Tư vấn sản phẩm',
            'columns' => [
                'Phone',
            ],
            'all_columns' => [
                'Phone',
                'Product' => [
                    'column' => 'product_url',
                    'route' => [
                        'name' => 'api.vehicles.show',
                        'params' => [
                            'slug',
                        ],
                    ],
                ],
            ],
            'rules' => [
                'Phone' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12',
                'Product.id' => 'required',
                'Product.slug' => 'required',
                'Product.title' => 'required',
            ],
            'route' => 'contacts',
        ],
        'TEST_DRIVE_SURVEY' => [
            'title' => 'Khảo sát lái thử',
            'columns' => [
                'Số điện thoại',
            ],
            'all_columns' => [
                'Số điện thoại',
            ],
            'rules' => [
                'Họ và tên' => 'required',
                'Số điện thoại' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12',
                'Dòng xe lái thử' => 'required',
                'Động cơ' => 'required',
                'Cảm giác lái' => 'required',
                'Ngoại hình & Thiết kế' => 'required',
                'Tiện nghi & Công nghệ' => 'required',
                'Nhân viên tư vấn' => 'required',
                'Ý định mua xe' => 'required',
            ],
            'route' => 'test-drive-surveys',
        ],
        'SERVICE_SURVEY' => [
            'title' => 'Khảo sát dịch vụ',
            'columns' => [
                'Số điện thoại',
            ],
            'all_columns' => [
                'Số điện thoại',
            ],
            'rules' => [
                'Họ và tên' => 'required',
                'Số điện thoại' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12',
                'Biển số xe' => 'required',
                'Loại dịch vụ đã dùng' => 'required',
                'Chất lượng dịch vụ' => 'required',
                'Thái độ phục vụ của nhân viên' => 'required',
                'Cơ sở vật chất & Phòng chờ' => 'required',
                'Điểm giới thiệu (NPS)' => 'required',
            ],
            'route' => 'service-surveys',
        ],
        'SERVICE_BOOKING' => [
            'title' => 'Đặt hẹn dịch vụ',
            'columns' => [
                'Số điện thoại',
            ],
            'all_columns' => [
                'Số điện thoại',
                'E-mail',
            ],
            'rules' => [
                'Họ và tên' => 'required',
                'Số điện thoại' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12',
                'E-mail' => 'nullable|email',
                'Biển số xe' => 'required',
                'Thời gian hẹn' => 'required',
                'Nội dung yêu cầu dịch vụ' => 'required',
                'Tại' => 'required',
            ],
            'route' => 'service-bookings',
        ],
        'REPAIR_QUOTE_FORM' => [
            'title' => 'Báo giá sửa chữa',
            'columns' => [
                'Phone',
            ],
            'all_columns' => [
                'Phone',
                'Email',
                'Product' => [
                    'column' => 'product_url',
                    'route' => [
                        'name' => 'api.vehicles.show',
                        'params' => [
                            'slug',
                        ],
                    ],
                ],
            ],
            'rules' => [
                'Phone' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12',
                'Name' => 'required',
                'Product.id' => 'required',
                'Product.slug' => 'required',
                'Product.title' => 'required',
            ],
            'route' => 'repair-quotes',
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
