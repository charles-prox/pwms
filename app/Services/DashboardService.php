<?php

namespace App\Services;

use App\Models\Box;
use App\Models\Request;
use App\Models\Office;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use App\Models\Document;
use App\Models\Request as RequestModel;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getSummaryData(): array
    {
        $user = auth()->user();
        $isGlobalAccess = $user->hasRole('super-user') || $user->hasRole('regional-document-custodian');

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();

        $boxQuery = Box::query();
        $requestQuery = Request::query();
        $documentQuery = Document::query();

        if (! $isGlobalAccess) {
            $boxQuery->where('office_id', $user->office_id);
            $requestQuery->where('office_id', $user->office_id);
            $documentQuery->whereHas('box', function ($q) use ($user) {
                $q->where('office_id', $user->office_id);
            });
        }

        return [
            'total_boxes' => [
                'count' => (clone $boxQuery)->where('status', 'stored')->count(),
                'added_this_month' => (clone $boxQuery)->where('status', 'stored')->whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
            ],
            'boxes_due_for_disposal' => [
                'count' => (clone $boxQuery)->where('status', 'stored')
                    ->whereDate('disposal_date', '<=', $now->copy()->addMonth())
                    ->count(),
                'added_this_month' => (clone $boxQuery)->where('status', 'stored')
                    ->whereDate('disposal_date', '<=', $now->copy()->addMonth())
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->count(),
            ],
            'boxes_for_return' => [
                'count' => (clone $boxQuery)->where('status', 'withdrawn')->count(),
                'added_this_month' => (clone $boxQuery)->where('status', 'withdrawn')
                    ->whereBetween('updated_at', [$startOfMonth, $endOfMonth])
                    ->count(),
            ],
            'pending_requests' => [
                'count' => (clone $requestQuery)->where('status', 'pending')->count(),
                'added_this_month' => (clone $requestQuery)->where('status', 'pending')
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->count(),
            ],
            'completed_requests' => [
                'count' => (clone $requestQuery)->where('status', 'completed')->count(),
                'added_this_month' => (clone $requestQuery)->where('status', 'completed')
                    ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                    ->count(),
            ],
            'total_documents' => [
                'count' => (clone $documentQuery)->count(),
                'added_this_month' => (clone $documentQuery)->whereBetween('created_at', [$startOfMonth, $endOfMonth])->count(),
            ],
        ];
    }

    public function getRequestsSummaryData(): array
    {
        $user = auth()->user();
        $isGlobalAccess = $user->hasRole('super-user') || $user->hasRole('regional-document-custodian');

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();

        $types = ['storage', 'withdrawal', 'return', 'disposal'];

        $requestMetrics = collect($types)->mapWithKeys(function ($type) use ($startOfMonth, $user, $isGlobalAccess) {
            $query = RequestModel::where('request_type', $type);

            if (!$isGlobalAccess) {
                $query->where('office_id', $user->office_id);
            }

            $total = (clone $query)->count();

            $addedThisMonth = (clone $query)
                ->whereDate('created_at', '>=', $startOfMonth)
                ->count();

            // Fetch requests with pending and completed logs
            $requestsWithLogs = DB::table('requests')
                ->join('request_status_logs as pending_logs', function ($join) {
                    $join->on('requests.id', '=', 'pending_logs.request_id')
                        ->where('pending_logs.status', 'pending');
                })
                ->join('request_status_logs as completed_logs', function ($join) {
                    $join->on('requests.id', '=', 'completed_logs.request_id')
                        ->where('completed_logs.status', 'completed');
                })
                ->where('requests.request_type', $type)
                ->when(!$isGlobalAccess, function ($query) use ($user) {
                    $query->where('requests.office_id', $user->office_id);
                })
                ->select('pending_logs.created_at as pending_at', 'completed_logs.created_at as completed_at')
                ->get();

            // Compute TAT in business days (excluding weekends)
            $totalBusinessDays = 0;
            $countedRequests = 0;

            foreach ($requestsWithLogs as $log) {
                $pendingAt = Carbon::parse($log->pending_at)->startOfDay();
                $completedAt = Carbon::parse($log->completed_at)->startOfDay();

                if ($completedAt->lt($pendingAt)) continue; // skip invalid logs

                $period = CarbonPeriod::create($pendingAt, $completedAt);

                $businessDays = collect($period)->filter(function (Carbon $date) {
                    return !$date->isWeekend();
                })->count();

                $totalBusinessDays += $businessDays;
                $countedRequests++;
            }

            $averageTATInDays = $countedRequests > 0 ? round($totalBusinessDays / $countedRequests, 2) : null;

            return [
                $type => [
                    'title' => ucfirst($type) . ' Requests',
                    'type' => $type,
                    'value' => $total,
                    'change' => $addedThisMonth,
                    'isIncrease' => $addedThisMonth > 0,
                    'averageTatDays' => $averageTATInDays,
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
