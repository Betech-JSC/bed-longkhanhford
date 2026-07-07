<?php

if (file_exists(base_path('routes/backend_before.php'))) {
    require base_path('routes/backend_before.php');
}
require __DIR__ . '/backend_before.php';
require base_path('routes/backend.php');
require __DIR__ . '/backend_after.php';
if (file_exists(base_path('routes/backend_after.php'))) {
    require base_path('routes/backend_after.php');
}

