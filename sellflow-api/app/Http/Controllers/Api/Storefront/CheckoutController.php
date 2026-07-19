<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\CheckoutRequest;
use App\Http\Resources\Storefront\PublicOrderResource;
use App\Services\Order\OrderTelegramNotificationService;
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
        $data = $request->validated();
        $telegramCustomer = $this->telegramAuth->validate($data['telegram_init_data'] ?? null);
        unset($data['telegram_init_data']);

        $order = $this->checkoutService->create($slug, [
            ...$data,
            ...($telegramCustomer ?? []),
        ]);
        $this->notifications->orderCreated($order);

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully.',
            'data' => new PublicOrderResource($order),
        ], 201);
    }
}
