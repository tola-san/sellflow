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
        return response()->json(['success' => true, 'data' => $this->resource($this->telegram->settings($this->business($request)))]);
    }

    public function createCode(Request $request): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Telegram connection code generated.',
                'data' => $this->telegram->createConnectionCode($this->business($request)),
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
        $settings = $this->telegram->settings($this->business($request));
        $settings->update($data);

        return response()->json(['success' => true, 'message' => 'Telegram notification preferences updated.', 'data' => $this->resource($settings->fresh())]);
    }

    public function test(Request $request): JsonResponse
    {
        try {
            $this->telegram->sendTest($this->business($request));

            return response()->json(['success' => true, 'message' => 'Test notification sent to Telegram.']);
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        } catch (Throwable) {
            return response()->json(['message' => 'Telegram could not deliver the test notification. Please try again.'], 502);
        }
    }

    public function destroy(Request $request): JsonResponse
    {
        $settings = $this->telegram->disconnect($this->business($request));

        return response()->json(['success' => true, 'message' => 'Telegram disconnected successfully.', 'data' => $this->resource($settings)]);
    }

    private function business(Request $request): Business
    {
        return $request->user()->business()->firstOrFail();
    }

    private function resource(BusinessNotificationSetting $settings): array
    {
        return [
            'connected' => (bool) ($settings->telegram_enabled && $settings->telegram_chat_id),
            'chat_name' => $settings->telegram_chat_name,
            'new_order_enabled' => $settings->new_order_enabled,
            'payment_enabled' => $settings->payment_enabled,
            'connected_at' => $settings->connected_at?->toISOString(),
        ];
    }
}
