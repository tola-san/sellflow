<?php

return [
    'trial_days' => (int) env('BILLING_TRIAL_DAYS', 30),
    'trial_plan' => env('BILLING_TRIAL_PLAN', 'business'),
];
