<?php

namespace App\Http\Controllers\Api\Storefront;

use App\Http\Controllers\Controller;
use App\Http\Requests\Storefront\CheckoutRequest;
use App\Http\Resources\Storefront\PublicOrderResource;
use App\Jobs\SendNewOrderTelegramNotification;
use App\Services\BusinessNotificationService;
use App\Services\Order\OrderTelegramNotificationService as CustomerOrderTelegramNotifications;
use App\Services\Order\OrderTelegramLinkService;
use App\Services\Storefront\CheckoutService;
use App\Services\TelegramMiniAppAuthService as TelegramCustomerAuthenticator;
use Illuminate\Http\JsonResponse;

class CheckoutController extends Controller
{
    public function __construct(
        protected CheckoutService $checkoutService,
        protected TelegramCustomerAuthenticator $telegramAuth,
        protected CustomerOrderTelegramNotifications $notifications,
        protected OrderTelegramLinkService $telegramLinks,
        protected BusinessNotificationService $businessNotifications,
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
        $this->businessNotifications->orderCreated($order);

        // The customer receipt is attempted immediately so checkout can report
        // whether Telegram accepted it. Seller delivery remains after-response.
        $this->notifications->orderCreated($order);
        $telegramLinkUrl = $this->telegramLinks->create($order);
        SendNewOrderTelegramNotification::dispatchAfterResponse($order->id);

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully.',
            'data' => [
                ...(new PublicOrderResource($order))->resolve($request),
                'telegram_link_url' => $telegramLinkUrl,
            ],
        ], 201);
    }
}
