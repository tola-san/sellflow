<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\CheckoutRequest;
use App\Http\Resources\Storefront\PublicOrderResource;
use App\Jobs\SendNewOrderTelegramNotification;
use App\Services\Storefront\CheckoutService;
use App\Services\TelegramMiniAppAuthService;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    public function __construct(
        protected CheckoutService $checkoutService,
        protected TelegramMiniAppAuthService $telegramAuth,
        protected OrderTelegramNotificationService $notifications,
    ) {}

    public function store(CheckoutRequest $request, string $slug): JsonResponse
    {
        $order = $this->checkoutService->create($slug, $request->validated());
        SendNewOrderTelegramNotification::dispatchAfterResponse($order->id);

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully.',
            'data' => new PublicOrderResource($order),
        ], 201);
    }
}
