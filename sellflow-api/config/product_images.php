<?php

return [
    'disk' => env('PRODUCT_IMAGE_DISK', 'public'),
    'directory' => env('PRODUCT_IMAGE_DIRECTORY', 'products'),
    'max_size_kb' => 4096,
];
