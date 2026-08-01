<?php

namespace App\Http\Controllers\Api\Order;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use App\Http\Requests\Order\UpdatePaymentStatusRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\Order\OrderService;
use App\Support\OrderStatusWorkflow;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function __construct(protected OrderService $orderService) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', Rule::in(OrderStatusWorkflow::STATUSES)],
            'payment_status' => ['nullable', Rule::in(['pending', 'paid', 'failed', 'refunded'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);
        $business = $request->user()->business;

        if (! $business) {
            return response()->json(['success' => true, 'data' => [], 'summary' => $this->emptySummary(), 'meta' => $this->emptyMeta()]);
        }

        $orders = $this->orderService->paginate($business, $filters);

        return response()->json([
            'success' => true,
            'data' => OrderResource::collection($orders->items()),
            'summary' => $this->orderService->summary($business),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
        ]);
    }

    public function show(Request $request, Order $order): JsonResponse
    {
        $this->ensureOwnership($request, $order);

        return response()->json(['success' => true, 'data' => new OrderResource($this->orderService->show($order))]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $updated = $this->orderService->updateStatus($order, $request->validated('status'));

        return response()->json(['success' => true, 'message' => 'Order status updated.', 'data' => new OrderResource($updated)]);
    }

    public function updatePaymentStatus(UpdatePaymentStatusRequest $request, Order $order): JsonResponse
    {
        $updated = $this->orderService->updatePaymentStatus($order, $request->validated('payment_status'));

        return response()->json(['success' => true, 'message' => 'Payment status updated.', 'data' => new OrderResource($updated)]);
    }

    private function ensureOwnership(Request $request, Order $order): void
    {
        abort_unless($request->user()->business?->id === $order->business_id, 403);
    }

    private function emptySummary(): array
    {
        return ['total' => 0, 'pending' => 0, 'confirmed' => 0, 'preparing' => 0, 'ready' => 0, 'completed' => 0, 'cancelled' => 0, 'paid_revenue' => '0.00'];
    }

    private function emptyMeta(): array
    {
        return ['current_page' => 1, 'last_page' => 1, 'per_page' => 15, 'total' => 0];
    }
}
