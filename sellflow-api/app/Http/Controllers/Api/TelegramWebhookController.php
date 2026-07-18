<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TelegramNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TelegramWebhookController extends Controller
{
    public function __invoke(Request $request, TelegramNotificationService $telegram): JsonResponse
    {
        $expectedSecret = (string) config('services.telegram.webhook_secret');
        $providedSecret = (string) $request->header('X-Telegram-Bot-Api-Secret-Token');

        if ($expectedSecret === '' || ! hash_equals($expectedSecret, $providedSecret)) {
            return response()->json(['message' => 'Invalid Telegram webhook secret.'], 403);
        }

        $telegram->connectFromWebhook($request->all());

        return response()->json(['ok' => true]);
    }
}
