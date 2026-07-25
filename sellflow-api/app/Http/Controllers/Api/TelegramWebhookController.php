<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Order\OrderTelegramLinkService;
use App\Services\Order\TelegramOrderActionService;
use App\Services\TelegramNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TelegramWebhookController extends Controller
{
    public function __invoke(
        Request $request,
        TelegramNotificationService $telegram,
        TelegramOrderActionService $orderActions,
        OrderTelegramLinkService $orderLinks
    ): JsonResponse {
        $expectedSecret = trim((string) config('services.telegram.webhook_secret'));
        $providedSecret = trim((string) $request->header('X-Telegram-Bot-Api-Secret-Token'));

        if ($expectedSecret === '' || ! hash_equals($expectedSecret, $providedSecret)) {
            Log::warning('Telegram webhook request rejected because its secret did not match.', [
                'configured_secret_present' => $expectedSecret !== '',
                'provided_secret_present' => $providedSecret !== '',
                'update_id' => $request->input('update_id'),
            ]);

            return response()->json(['message' => 'Invalid Telegram webhook secret.'], 403);
        }

        if (! $orderActions->handle($request->all()) && ! $telegram->handleUpdate($request->all())) {
            $orderLinks->claimFromUpdate($request->all());
        }

        return response()->json(['ok' => true]);
    }
}
