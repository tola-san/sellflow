<?php

namespace App\Events;

use App\Models\BusinessNotification;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BusinessNotificationCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public BusinessNotification $notification) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('business.'.$this->notification->business_id);
    }

    public function broadcastAs(): string
    {
        return 'business.notification.created';
    }

    public function broadcastWith(): array
    {
        return [
            'notification' => [
                'id' => $this->notification->id,
                'type' => $this->notification->type,
                'title' => $this->notification->title,
                'message' => $this->notification->message,
                'action_url' => $this->notification->action_url,
                'data' => $this->notification->data ?? [],
                'is_read' => $this->notification->read_at !== null,
                'read_at' => $this->notification->read_at?->toISOString(),
                'created_at' => $this->notification->created_at?->toISOString(),
            ],
        ];
    }
}
