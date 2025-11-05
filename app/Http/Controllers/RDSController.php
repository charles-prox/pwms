<?php

namespace App\Http\Controllers;

use App\Http\Resources\RDSResource;
use App\Services\RDS\RDSImportService;
use App\Services\RDS\RDSQueryService;
use App\Services\RDS\RDSSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RDSController extends Controller
{
    protected RDSImportService $importService;
    protected RDSQueryService $queryService;
    protected RDSSearchService $searchService;

    public function __construct(
        RDSImportService $importService,
        RDSQueryService $queryService,
        RDSSearchService $searchService
    ) {
        $this->importService = $importService;
        $this->queryService = $queryService;
        $this->searchService = $searchService;
    }

    public function import(Request $request): JsonResponse
    {
        return $this->importService->import($request);
    }

    public function index(Request $request): JsonResponse
    {
        $hasPagination = $request->filled('page') && $request->filled('per_page');

        if ($hasPagination) {
            $result = $this->queryService->getRDSItems($request);

            return response()->json([
                'success' => true,
                'data' => [
                    'current_page' => $result['data']->currentPage(),
                    'data' => RDSResource::collection($result['data']),
                    'total' => $result['data']->total(),
                    'per_page' => $result['data']->perPage(),
                ],
                'filterable_columns' => $result['filterable_columns'] ?? [],
            ]);
        }

        // 🔍 Non-paginated search
        $searchKey = $request->input('search_key') ?? $request->input('q');
        $data = $this->searchService->search($searchKey);

        // 🚫 Don't wrap in RDSResource — it’s already formatted
        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $hasPagination = $request->filled('page') && $request->filled('per_page');

        if ($hasPagination) {
            $result = $this->queryService->getRDSItems($request);

            return response()->json([
                'success' => true,
                'data' => [
                    'current_page' => $result['data']->currentPage(),
                    'data' => RDSResource::collection($result['data']),
                    'total' => $result['data']->total(),
                    'per_page' => $result['data']->perPage(),
                ],
                'filterable_columns' => $result['filterable_columns'] ?? [],
            ]);
        }

        $searchKey = $request->input('search_key') ?? $request->input('q');
        $data = $this->searchService->search($searchKey);

        // 🚫 Again, return directly
        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
