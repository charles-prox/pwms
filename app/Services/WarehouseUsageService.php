<?php

namespace App\Services;

use App\Models\Box;
use App\Models\Location;
use App\Models\Office;
use Illuminate\Support\Facades\DB;

class WarehouseUsageService
{
    /**
     * Get warehouse usage summary.
     */
    public function getWarehouseUsageSummary(): array
    {
        // 1. Stored Boxes
        $storedBoxes = Box::where('status', 'stored')->count();

        // 2. Total Capacity
        $totalCapacity = Location::sum(DB::raw('total_positions * capacity_per_position'));

        // 3. Total Occupied Boxes (Stored in Locations)
        $totalOccupied = Location::sum('current_boxes');

        // 4. Remaining Space
        $remainingSpace = $totalCapacity - $totalOccupied;

        // 5. Total Occupying Offices
        $occupyingOfficesCount = Location::whereNotNull('office_id')
            ->where('current_boxes', '>', 0)
            ->distinct('office_id')
            ->count('office_id');

        // 6. Office-wise Occupied Locations
        $officeUsage = Location::whereNotNull('office_id')
            ->select('office_id', DB::raw('COUNT(*) as occupied_locations'))
            ->groupBy('office_id')
            ->with('office:id,name,acronym')
            ->get();

        // 7. Ground Stats
        $ground = Location::where('floor', 'ground')
            ->selectRaw('SUM(current_boxes) as used, SUM(total_positions * capacity_per_position) as capacity')
            ->first();

        // 8. Mezzanine Stats
        $mezzanine = Location::where('floor', 'mezzanine')
            ->selectRaw('SUM(current_boxes) as used, SUM(total_positions * capacity_per_position) as capacity')
            ->first();

        return [
            'stored_boxes' => $storedBoxes,
            'total_capacity' => $totalCapacity,
            'remaining_space' => $remainingSpace,
            'occupying_offices_count' => $occupyingOfficesCount,
            'office_usage' => $officeUsage,
            'ground_used' => (int) $ground->used,
            'ground_capacity' => (int) $ground->capacity,
            'mezzanine_used' => (int) $mezzanine->used,
            'mezzanine_capacity' => (int) $mezzanine->capacity,
        ];
    }
}
