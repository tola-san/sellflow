<?php

return [
    'disk' => env('BUSINESS_IMAGE_DISK', env('PRODUCT_IMAGE_DISK', 'public')),
    'directory' => env('BUSINESS_IMAGE_DIRECTORY', 'businesses'),
    'max_size_kb' => 4096,
];
