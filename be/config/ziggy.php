<?php

return [
    'groups' => [
        'frontend' => [
            'except' => [
                'ignition.*',
                'admin.*',
                'sidebar.*',
                'helper.*',
                'password.*',
                'login',
                'logout',
                'register.*',
                'verification.*'
            ],
        ],
    ],
];
