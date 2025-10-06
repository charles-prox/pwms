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
        $result = $this->queryService->getRDSItems($request);

        return response()->json([
            'success' => true,
            'data' => RDSResource::collection($result['data']),
            'filterable_columns' => $result['filterable_columns'],
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $data = $this->searchService->search($request->input('q'));

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
