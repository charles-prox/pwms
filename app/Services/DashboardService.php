<?php

namespace App\Services;

use App\Models\Box;
use App\Models\Request;
use App\Models\Office;
use Carbon\Carbon;
use App\Models\Document;
use App\Models\Request as RequestModel;

class DashboardService
{
    public function getSummaryData(): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        return [
            'total_boxes' => [
                'count' => Box::where('status', 'stored')->count(),
                'added_this_month' => Box::where('status', 'stored')->whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
            ],
            'boxes_due_for_disposal' => [
                'count' => Box::where('status', 'stored')
                    ->whereDate('disposal_date', '<=', $now->copy()->addMonth())
                    ->count(),
                'added_this_month' => Box::where('status', 'stored')
                    ->whereDate('disposal_date', '<=', $now->copy()->addMonth())
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->count(),
            ],
            'boxes_for_return' => [
                'count' => Box::where('status', 'withdrawn')->count(),
                'added_this_month' => Box::where('status', 'withdrawn')
                    ->whereBetween('updated_at', [$startOfMonth, $endOfMonth])
                    ->count(),
            ],
            'pending_requests' => [
                'count' => Request::where('status', 'pending')->count(),
                'added_this_month' => Request::where('status', 'pending')
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->count(),
            ],
            'completed_requests' => [
                'count' => Request::where('status', 'completed')->count(),
                'added_this_month' => Request::where('status', 'completed')
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->count(),
            ],
            'total_documents' => [
                'count' => Document::count(),
                'added_this_month' => Document::whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
            ],
        ];
    }

    public function getRequestsSummaryData(): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();

        $types = ['storage', 'withdrawal', 'return', 'disposal'];

        $requestMetrics = collect($types)->mapWithKeys(function ($type) use ($startOfMonth) {
            $total = RequestModel::where('request_type', $type)->count();
            $addedThisMonth = RequestModel::where('request_type', $type)
                ->whereDate('created_at', '>=', $startOfMonth)
                ->count();

            return [
                $type => [
                    'title' => ucfirst($type) . ' Requests',
                    'type' => $type,
                    'value' => $total,
                    'change' => $addedThisMonth,
                    'isIncrease' => $addedThisMonth > 0,
                ],
            ];
        });

        return [
            'request_metrics' => $requestMetrics,
        ];
    }

    protected function getOfficeUsageStats(): array
    {
        return Office::withCount(['boxes'])->get()->map(function ($office) {
            return [
                'office' => $office->name,
                'box_count' => $office->boxes_count,
            ];
        })->toArray();
    }
}
