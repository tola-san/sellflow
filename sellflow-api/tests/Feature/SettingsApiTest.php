<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SettingsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_profile_details(): void
    {
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
        ]);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', [
            'name' => 'Sokha Seller',
            'email' => 'sokha@example.com',
        ])
            ->assertOk()
            ->assertJsonPath('data.name', 'Sokha Seller')
            ->assertJsonPath('data.email', 'sokha@example.com');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Sokha Seller',
            'email' => 'sokha@example.com',
        ]);
    }

    public function test_profile_email_must_remain_unique(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);
        $user = User::factory()->create(['email' => 'owner@example.com']);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile', [
            'name' => 'Owner',
            'email' => 'taken@example.com',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_user_can_change_password_with_current_password(): void
    {
        $user = User::factory()->create(['password' => Hash::make('old-password')]);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile/password', [
            'current_password' => 'old-password',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ])->assertOk();

        $this->assertTrue(Hash::check('new-secure-password', $user->fresh()->password));
    }

    public function test_password_change_rejects_an_incorrect_current_password(): void
    {
        $user = User::factory()->create(['password' => Hash::make('old-password')]);
        Sanctum::actingAs($user);

        $this->patchJson('/api/v1/profile/password', [
            'current_password' => 'wrong-password',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('current_password');
    }

    public function test_profile_settings_require_authentication(): void
    {
        $this->patchJson('/api/v1/profile', [])->assertUnauthorized();
        $this->patchJson('/api/v1/profile/password', [])->assertUnauthorized();
    }
}
