<?php

namespace App\Services\RDS;

use App\Models\RDS;
use Illuminate\Http\Request;

class RDSQueryService
{
    public function getRDSItems(Request $request): array
    {
        $perPage = $request->input('per_page', 10);
        $page = $request->input('page', 1);
        $searchKey = $request->input('search_key', '');
        $filters = $request->input('filters', []);
        $fetchAll = $request->boolean('all');

        $filterable_columns = ['title_description', 'department', 'module', 'item_no'];

        $query = RDS::query();

        if ($searchKey) {
            $query->where('title_description', 'ILIKE', "%{$searchKey}%");
        }

        foreach ($filters as $filter) {
            if (!empty($filter['column']) && in_array($filter['column'], $filterable_columns) && isset($filter['value'])) {
                $query->where($filter['column'], 'ILIKE', "%{$filter['value']}%");
            }
        }

        $data = $fetchAll
            ? $query->get()
            : $query->paginate($perPage, ['*'], 'page', $page);

        return [
            'data' => $data,
            'filterable_columns' => $filterable_columns,
        ];
    }
}
