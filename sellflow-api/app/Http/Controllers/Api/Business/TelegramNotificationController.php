<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\BusinessNotificationSetting;
use App\Services\TelegramNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;
use Throwable;

class TelegramNotificationController extends Controller
{
    public function __construct(private readonly TelegramNotificationService $telegram) {}

    public function show(Request $request): JsonResponse
    {
        $business = $this->business($request);

        return response()->json(['success' => true, 'data' => $this->resource($this->telegram->settings($business), $business)]);
    }

    public function createCode(Request $request): JsonResponse
    {
        $data = $request->validate(['purpose' => ['sometimes', 'in:sales_channel,customer_group,staff_group']]);
        try {
            return response()->json([
                'success' => true,
                'message' => 'Telegram connection code generated.',
                'data' => $this->telegram->createConnectionCode(
                    $this->business($request),
                    (string) config('services.telegram.webhook_url'),
                    $data['purpose'] ?? 'staff_group'
                ),
            ], 201);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 503);
        }
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'new_order_enabled' => ['sometimes', 'boolean'],
            'payment_enabled' => ['sometimes', 'boolean'],
        ]);
        $business = $this->business($request);
        $settings = $this->telegram->settings($business);
        $settings->update($data);

        return response()->json(['success' => true, 'message' => 'Telegram notification preferences updated.', 'data' => $this->resource($settings->fresh(), $business)]);
    }

    public function test(Request $request): JsonResponse
    {
        $data = $request->validate(['purpose' => ['sometimes', 'in:sales_channel,customer_group,staff_group']]);
        try {
            $this->telegram->sendTest($this->business($request), $data['purpose'] ?? 'staff_group');

            return response()->json(['success' => true, 'message' => 'Test notification sent to Telegram.']);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        } catch (Throwable) {
            return response()->json(['message' => 'Telegram could not deliver the test notification. Please try again.'], 502);
        }
    }

    public function destroy(Request $request): JsonResponse
    {
        $data = $request->validate(['purpose' => ['sometimes', 'in:sales_channel,customer_group,staff_group']]);
        $business = $this->business($request);
        $settings = $this->telegram->disconnect($business, $data['purpose'] ?? null);

        return response()->json(['success' => true, 'message' => 'Telegram disconnected successfully.', 'data' => $this->resource($settings, $business->fresh())]);
    }

    private function business(Request $request): Business
    {
        return $request->user()->business()->firstOrFail();
    }

    private function resource(BusinessNotificationSetting $settings, Business $business): array
    {
        $destinations = $business->telegramDestinations()->orderBy('purpose')->get()->map(fn ($destination) => [
            'purpose' => $destination->purpose,
            'chat_name' => $destination->telegram_chat_name,
            'chat_type' => $destination->telegram_chat_type,
            'bot_is_admin' => $destination->bot_is_admin,
            'connected_at' => $destination->connected_at?->toISOString(),
        ])->values();

        return [
            'connected' => (bool) ($settings->telegram_enabled && $settings->telegram_chat_id),
            'chat_name' => $settings->telegram_chat_name,
            'new_order_enabled' => $settings->new_order_enabled,
            'payment_enabled' => $settings->payment_enabled,
            'connected_at' => $settings->connected_at?->toISOString(),
            'destinations' => $destinations,
        ];
    }
}
