<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class BoxResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Get the relevant associated request (adjust if you need first(), specific type, etc.)
        $requestModel = $this->requests
            ->where('request_type', 'withdrawal')
            ->first();

        // Get pivot from the request relationship
        $pivot = $requestModel?->pivot;
        // dd($requestModel);
        $completedLog = $requestModel?->statusLogs
            ->first(fn($log) => str_contains($log->status, 'completed'));

        $storageRemarks = DB::table('request_box')
            ->where('box_id', $this->id)
            ->orderByDesc('id') // latest request relation if multiple
            ->value('storage_remarks');

        // dd($requestModel?->statusLogs);
        return [
            'id' => $this->id,
            'box_code' => $this->box_code,
            'priority_level' => $this->priority_level ? [
                'value' => $this->priority_level,
                'label' => ucfirst($this->priority_level),
            ] : null,
            'remarks' => $storageRemarks ?? null,
            'disposal_date' => $this->is_permanent
                ? 'Permanent'
                : [
                    'raw' => optional($this->disposal_date)->toISOString(),
                    'formatted' => optional($this->disposal_date)->format('F Y'),
                ],
            'office' => $this->office ? [
                'id' => $this->office->id,
                'name' => $this->office->name,
            ] : null,
            'box_details' => DocumentResource::collection($this->documents)->toArray(request()),
            'location' => $this->formatted_location,

            // Remarks from pivot table (creation and completion remarks)
            'request_remarks' => [
                'storage' => $pivot?->storage_remarks ?? null,
                'withdrawal' => $pivot?->withdrawal_remarks ?? null,
                'return' => $pivot?->return_remarks ?? null,
                'disposal' => $pivot?->disposal_remarks ?? null,
            ],
            'completion_remarks' => [
                'storage' => $pivot?->storage_completion_remarks ?? null,
                'withdrawal' => $pivot?->withdrawal_completion_remarks ?? null,
                'return' => $pivot?->return_completion_remarks ?? null,
                'disposal' => $pivot?->disposal_completion_remarks ?? null,
            ],

            'request_info' => $requestModel ? [
                'form_number' => $requestModel->form_number,
                'request_type' => $requestModel->request_type,
                'status' => $requestModel->status,
            ] : null,
            'completed_at' => $completedLog?->created_at?->format('m/d/Y'),
            'withdrawal_request' => $this->withdrawal_request ?? null,
        ];
    }
}
