<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BoxResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Get the first associated request (usually there's only one for withdrawn boxes)
        $requestModel = $this->requests->last();

        // Get the first status log where status is 'completed'
        $completedLog = $requestModel?->statusLogs->firstWhere('status', 'completed');

        return [
            'id' => $this->id,
            'box_code' => $this->box_code,
            'priority_level' => $this->priority_level ? [
                'value' => $this->priority_level,
                'label' => ucfirst($this->priority_level),
            ] : null,
            'remarks' =>  $this->pivot->storage_remarks ?? null,
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
                'storage' => $this->pivot->storage_remarks ?? null,
                'withdrawal' => $this->pivot->withdrawal_remarks ?? null,
                'return' => $this->pivot->return_remarks ?? null,
                'disposal' => $this->pivot->disposal_remarks ?? null,
            ],
            'completion_remarks' => [
                'storage' => $this->pivot->storage_completion_remarks ?? null,
                'withdrawal' => $this->pivot->withdrawal_completion_remarks ?? null,
                'return' => $this->pivot->return_completion_remarks ?? null,
                'disposal' => $this->pivot->disposal_completion_remarks ?? null,
            ],

            // ✅ Additional: Request and completed log info
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
