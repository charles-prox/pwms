<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BoxResource;
use Illuminate\Http\Request;
use App\Models\Box;

class BoxController extends Controller
{

    public function search(Request $request)
    {
        $search = $request->query('search');

        $boxesQuery = Box::query()
            ->where('status', 'stored')
            ->whereHas('boxLocation') // Only boxes with a location
            ->with([
                'boxLocation.location',
                'documents',
                'office',
            ]);

        if ($search) {
            $search = strtolower($search); // Ensure case-insensitive

            $boxesQuery->where(function ($query) use ($search) {
                $query->whereRaw('LOWER(box_code) LIKE ?', ["%{$search}%"])
                    ->orWhereHas('documents', function ($docQuery) use ($search) {
                        $docQuery->whereRaw('LOWER(description) LIKE ?', ["%{$search}%"]);
                    })
                    ->orWhereHas('requests', function ($reqQuery) use ($search) {
                        $reqQuery->whereRaw('LOWER(request_box.storage_remarks) LIKE ?', ["%{$search}%"]);
                    });
            });
        }

        $boxes = $boxesQuery->get();

        return BoxResource::collection($boxes);
    }
}
