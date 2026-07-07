<?php

return [
    'order_number' => 'WC',
    'order_form' => [
        'columns' => [
            'name',
            'phone',
            'email',
            'note',
            'payment_method',
            'shipping_address',
            'city',
            'district',
            'ward',
            'tax_lines',

            'start_rental_date',
            'end_rental_date',
            'rental_date',
            'rental'
        ],
        'all_columns' => [
            'name',
            'phone',
            'email',
            'note',
            'payment_method',
            'shipping_address',
            'city',
            'district',
            'ward',
            'tax_lines',

            'start_rental_date',
            'end_rental_date',
            'rental_date',
            'rental'
        ],
        'rules' => [
            'name' => 'required|string|max:255',
            'phone' => 'required|regex:/(0)[0-9]/|not_regex:/[a-z]/|min:9|max:12',
            'note' => 'nullable|string',
        ],
    ],
    'cart_form' => [
        'store' => [
            'columns' => [
                'product_id',
                'quantity'
            ],
            'product_key' => 'product_id'
        ]
    ],
    'shipping_cost' => [
        'max_sub_total' => 0,
        'default_sub_total' => 0
    ]
];
