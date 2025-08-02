<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use App\Services\WarehouseUsageService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $data = app(DashboardService::class)->getSummaryData();
        $requestsSummary = app(DashboardService::class)->getRequestsSummaryData();
        $warehouseUsageSummary = app(WarehouseUsageService::class)->getWarehouseUsageSummary();
        return Inertia::render('Dashboard', [
            'kpiCards' => $data,
            'requestsSummary' => $requestsSummary,
            'warehouseUsageSummary' => $warehouseUsageSummary,
        ]);
    }
}
