<?php
// app/Services/RequestBoxService.php
namespace App\Services\Requests;

use App\Http\Resources\BoxResource;
use App\Models\Request as RequestModel;
use App\Models\Box;

class RequestBoxService
{
    public function getBoxesForRequest(RequestModel $request)
    {
        $boxesQuery = Box::with(['documents.rds', 'office', 'boxLocation.location']);

        return match (strtolower($request->request_type)) {
            'storage' => BoxResource::collection(
                $boxesQuery->where('request_id', $request->id)->get()
            )->toArray(request()),

            'withdrawal' => BoxResource::collection(
                $request->boxes()
                    ->with(['documents.rds', 'office', 'boxLocation.location'])
                    ->get()
            )->toArray(request()),

            default => [],
        };
    }
}
