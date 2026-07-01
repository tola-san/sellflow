<?php

namespace App\Http\Controllers\Api\Business;

use App\Http\Controllers\Controller;
use App\Http\Requests\Business\StoreBusinessRequest;
use App\Http\Requests\Business\UpdateBusinessRequest;
use App\Http\Resources\BusinessResource;
use App\Services\Business\BusinessService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    public function __construct(
        protected BusinessService $businessService
    ) {}

    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new BusinessResource(
                $request->user()->business
            ),
        ]);
    }

    public function store(StoreBusinessRequest $request): JsonResponse
    {
        $business = $this->businessService->create(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Business created successfully.',
            'data' => new BusinessResource($business),
        ], 201);
    }

    public function update(UpdateBusinessRequest $request): JsonResponse
    {
        $business = $this->businessService->update(
            $request->user()->business,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Business updated successfully.',
            'data' => new BusinessResource($business),
        ]);
    }
}