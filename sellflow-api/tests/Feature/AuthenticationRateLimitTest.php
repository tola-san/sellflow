<?php

namespace Tests\Feature;

use Tests\TestCase;

class AuthenticationRateLimitTest extends TestCase
{
    public function test_login_is_limited_to_five_attempts_per_email_and_ip_each_minute(): void
    {
        for ($attempt = 1; $attempt <= 5; $attempt++) {
            $this->postJson('/api/v1/login', [
                'email' => 'owner@example.com',
            ])->assertUnprocessable();
        }

        $this->postJson('/api/v1/login', [
            'email' => 'owner@example.com',
        ])->assertTooManyRequests();
    }

    public function test_registration_is_limited_to_three_attempts_per_ip_each_minute(): void
    {
        for ($attempt = 1; $attempt <= 3; $attempt++) {
            $this->postJson('/api/v1/register', [])->assertUnprocessable();
        }

        $this->postJson('/api/v1/register', [])->assertTooManyRequests();
    }
}
