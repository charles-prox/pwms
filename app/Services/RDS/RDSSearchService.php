<?php

namespace App\Services\RDS;

use App\Models\RDS;
use Illuminate\Support\Collection;

class RDSSearchService
{
    public function search(?string $query, ?int $page = null, ?int $perPage = null): array
    {
        // Base query
        $rdsQuery = RDS::query()
            ->when($query, function ($q) use ($query) {
                $q->where('title_description', 'ILIKE', "%{$query}%")
                    ->orWhere('item_no', 'ILIKE', "%{$query}%")
                    ->orWhereRaw("('RDS-' || REPLACE(module, 'Module ', '') || ' #' || item_no) ILIKE ?", ["%{$query}%"]);
            });

        // Determine pagination mode
        $usePagination = !is_null($page) && !is_null($perPage);

        // Get either paginated or full results
        $matchedItems = $usePagination
            ? $rdsQuery->paginate($perPage, ['*'], 'page', $page)
            : $rdsQuery->get();

        // Always have a collection of arrays
        $collection = $matchedItems instanceof \Illuminate\Pagination\LengthAwarePaginator
            ? collect($matchedItems->items())->map(fn($item) => $item->toArray())
            : $matchedItems->map(fn($item) => $item->toArray());

        // Get unique parent entries
        $parents = $collection
            ->map(fn($item) => [
                'module' => $item['module'],
                'parent_no' => explode('.', $item['item_no'])[0],
            ])
            ->unique(fn($v) => $v['module'] . '-' . $v['parent_no']);

        // Gather all matching parent + sub items
        $allItems = collect();
        foreach ($parents as $p) {
            $items = RDS::query()
                ->where('module', $p['module'])
                ->where(fn($q) => $q->where('item_no', $p['parent_no'])
                    ->orWhere('item_no', 'LIKE', $p['parent_no'] . '.%'))
                ->get()
                ->map(fn($item) => $item->toArray());

            $allItems = $allItems->merge($items);
        }

        // Format RDS items consistently
        $formatted = $allItems->map(function (array $rds) {
            return [
                'id' => $rds['id'] ?? null,
                'module' => 'Module ' . ($rds['module'] ?? ''),
                'department' => $rds['department'] ?? null,
                'item_no' => $rds['item_no'] ?? null,
                'title_description' => $rds['title_description'] ?? null,
                'retention_period' => $this->getRetentionPeriod((object) [
                    'active' => $rds['active'] ?? null,
                    'storage' => $rds['storage'] ?? null,
                ]),
            ];
        });

        // Filter and group results
        $filtered = $this->filterSpecialItems($formatted, $query);
        $grouped = $this->groupItems($filtered);

        // Return unified response
        return $usePagination
            ? [
                'data' => $grouped,
                'meta' => [
                    'current_page' => $matchedItems->currentPage(),
                    'per_page' => $matchedItems->perPage(),
                    'total' => $matchedItems->total(),
                    'last_page' => $matchedItems->lastPage(),
                ],
            ]
            : $grouped;
    }

    /**
     * Compute total retention period or mark as Permanent
     */
    private function getRetentionPeriod($rds)
    {
        $active = trim($rds->active ?? '');
        $storage = trim($rds->storage ?? '');

        return (strcasecmp($active, 'Permanent') === 0 || strcasecmp($storage, 'Permanent') === 0)
            ? 'Permanent'
            : ((int) $active + (int) $storage);
    }

    /**
     * Filters "Not in the RDS" and special query cases
     */
    private function filterSpecialItems(Collection $items, ?string $query): Collection
    {
        return $items->filter(function ($item) use ($items, $query) {
            if (empty($query) && $item['item_no'] == 0) {
                return false;
            }

            $keywords = ['not', 'in', 'the', 'rds'];
            $matches = collect($keywords)->filter(fn($w) => stripos($query ?? '', $w) !== false)->count();

            if ($matches >= 2) {
                return true;
            }

            if ($item['item_no'] == 0) {
                $otherResults = $items->filter(fn($i) => $i['item_no'] != 0);
                return $otherResults->isEmpty();
            }

            return true;
        });
    }

    /**
     * Groups items by module, department, and parent item_no
     */
    private function groupItems(Collection $items): array
    {
        return $items->groupBy('module')->map(function ($moduleItems) {
            return $moduleItems->groupBy('department')->map(function ($deptItems) {
                $groups = [];

                foreach ($deptItems as $item) {
                    $parts = explode('.', $item['item_no']);
                    $parentNo = $parts[0];

                    $groups[$parentNo] ??= [
                        'parent_item' => null,
                        'sub_items' => [],
                    ];

                    if (count($parts) === 1) {
                        $groups[$parentNo]['parent_item'] = $this->formatItem($item);
                    } else {
                        $groups[$parentNo]['sub_items'][] = $this->formatItem($item);
                    }
                }

                // Inherit retention from parent if missing
                foreach ($groups as &$g) {
                    $parent = $g['parent_item'] ?? null;
                    if ($parent && !empty($parent['retention_period'])) {
                        foreach ($g['sub_items'] as &$sub) {
                            if (empty($sub['retention_period']) || $sub['retention_period'] == 0) {
                                $sub['retention_period'] = $parent['retention_period'];
                            }
                        }
                    }
                }

                return $groups;
            });
        })->toArray();
    }

    /**
     * Format a single RDS item into a simplified array
     */
    private function formatItem(array $item): array
    {
        return [
            'id' => $item['id'] ?? null,
            'title_description' => $item['title_description'] ?? null,
            'retention_period' => $item['retention_period'] ?? null,
            'item_no' => $item['item_no'] ?? null,
            'rds_number' => $item['item_no']
                ? 'RDS-' . str_replace('Module ', '', $item['module']) . ' #' . $item['item_no']
                : 'Not in the RDS',
        ];
    }
}
