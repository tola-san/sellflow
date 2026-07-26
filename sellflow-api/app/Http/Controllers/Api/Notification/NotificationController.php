<?php

namespace App\Http\Controllers\Api\Notification;

use App\Http\Controllers\Controller;
use App\Models\BusinessNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'status' => ['nullable', Rule::in(['all', 'unread'])],
            'type' => ['nullable', Rule::in(['order', 'inventory', 'system'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);
        $business = $request->user()->business;

        if (! $business) {
            return response()->json([
                'success' => true,
                'data' => [],
                'unread_count' => 0,
                'meta' => ['current_page' => 1, 'last_page' => 1, 'per_page' => 20, 'total' => 0],
            ]);
        }

        $base = $business->notifications()->whereNull('dismissed_at');
        $unreadCount = (clone $base)->whereNull('read_at')->count();
        $notifications = $base
            ->when(($filters['status'] ?? 'all') === 'unread', fn ($query) => $query->whereNull('read_at'))
            ->when($filters['type'] ?? null, fn ($query, string $type) => $query->where('type', $type))
            ->latest()
            ->paginate((int) ($filters['per_page'] ?? 20));

        return response()->json([
            'success' => true,
            'data' => collect($notifications->items())->map(fn (BusinessNotification $notification) => $this->item($notification)),
            'unread_count' => $unreadCount,
            'meta' => [
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
                'per_page' => $notifications->perPage(),
                'total' => $notifications->total(),
            ],
        ]);
    }

    public function markRead(Request $request, BusinessNotification $notification): JsonResponse
    {
        $this->ensureOwnership($request, $notification);
        $notification->update(['read_at' => $notification->read_at ?? now()]);

        return response()->json(['success' => true, 'data' => $this->item($notification->fresh())]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->business?->notifications()
            ->whereNull('dismissed_at')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['success' => true, 'message' => 'All notifications marked as read.']);
    }

    public function destroy(Request $request, BusinessNotification $notification): JsonResponse
    {
        $this->ensureOwnership($request, $notification);
        $notification->update(['dismissed_at' => now(), 'read_at' => $notification->read_at ?? now()]);

        return response()->json(['success' => true, 'message' => 'Notification dismissed.']);
    }

    private function ensureOwnership(Request $request, BusinessNotification $notification): void
    {
        abort_unless($request->user()->business?->id === $notification->business_id, 403);
    }

    private function item(BusinessNotification $notification): array
    {
        return [
            'id' => $notification->id,
            'type' => $notification->type,
            'title' => $notification->title,
            'message' => $notification->message,
            'action_url' => $notification->action_url,
            'data' => $notification->data ?? [],
            'is_read' => $notification->read_at !== null,
            'read_at' => $notification->read_at,
            'created_at' => $notification->created_at,
        ];
    }
}
