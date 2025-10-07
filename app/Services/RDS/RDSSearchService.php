<?php

namespace App\Services\RDS;

use App\Models\RDS;
use Illuminate\Support\Collection;

class RDSSearchService
{
    public function search(?string $query): array
    {
        $matchedItems = RDS::query()
            ->when($query, fn($q) => $q->where('title_description', 'ILIKE', "%{$query}%"))
            ->get();

        $parents = $matchedItems->map(fn($item) => [
            'module' => $item->module,
            'parent_no' => explode('.', $item->item_no)[0],
        ])->unique(fn($v) => $v['module'] . '-' . $v['parent_no']);

        $allItems = collect();
        foreach ($parents as $p) {
            $items = RDS::query()
                ->where('module', $p['module'])
                ->where(fn($q) => $q->where('item_no', $p['parent_no'])
                    ->orWhere('item_no', 'LIKE', $p['parent_no'] . '.%'))
                ->get();

            $allItems = $allItems->merge($items);
        }

        $formatted = $allItems->map(fn($rds) => [
            'id' => $rds->id,
            'module' => "Module " . $rds->module,
            'department' => $rds->department,
            'item_no' => $rds->item_no,
            'title_description' => $rds->title_description,
            'retention_period' => $this->getRetentionPeriod($rds),
        ]);

        $filtered = $this->filterSpecialItems($formatted, $query);

        return $this->groupItems($filtered);
    }

    private function getRetentionPeriod($rds)
    {
        $active = trim($rds->active ?? '');
        $storage = trim($rds->storage ?? '');

        return (strcasecmp($active, 'Permanent') === 0 || strcasecmp($storage, 'Permanent') === 0)
            ? 'Permanent'
            : ((int) $active + (int) $storage);
    }

    private function filterSpecialItems(Collection $items, ?string $query): Collection
    {
        return $items->filter(function ($item) use ($items, $query) {
            if (empty($query) && $item['item_no'] == 0) return false;

            $keywords = ['not', 'in', 'the', 'rds'];
            $matches = collect($keywords)->filter(fn($w) => stripos($query ?? '', $w) !== false)->count();

            if ($matches >= 2) return true;

            if ($item['item_no'] == 0) {
                $otherResults = $items->filter(fn($i) => $i['item_no'] != 0);
                return $otherResults->isEmpty();
            }

            return true;
        });
    }

    private function groupItems(Collection $items): array
    {
        return $items->groupBy('module')->map(function ($moduleItems) {
            return $moduleItems->groupBy('department')->map(function ($deptItems) {
                $groups = [];

                foreach ($deptItems as $item) {
                    $parts = explode('.', $item['item_no']);
                    $parentNo = $parts[0];

                    $groups[$parentNo] ??= ['parent_item' => null, 'sub_items' => []];

                    if (count($parts) === 1) {
                        $groups[$parentNo]['parent_item'] = $this->formatItem($item);
                    } else {
                        $groups[$parentNo]['sub_items'][] = $this->formatItem($item);
                    }
                }

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

    private function formatItem(array $item): array
    {
        return [
            'id' => $item['id'] ?? null,
            'title_description' => $item['title_description'],
            'retention_period' => $item['retention_period'],
            'item_no' => $item['item_no'],
            'rds_number' => "RDS-" . str_replace('Module ', '', $item['module']) . " #" . $item['item_no'],
        ];
    }
}
