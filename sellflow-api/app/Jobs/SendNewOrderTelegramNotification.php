<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\TelegramNotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendNewOrderTelegramNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public array $backoff = [5, 30, 60];

    public function __construct(public readonly int $orderId) {}

    public function handle(TelegramNotificationService $telegram): void
    {
        $order = Order::query()
            ->with(['business.notificationSetting', 'items'])
            ->find($this->orderId);

        if (! $order) {
            return;
        }

        $telegram->sendNewOrder($order);
    }
}
