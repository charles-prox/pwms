<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $creator = $this->creator;
        $middleInitial = $creator->middle_name ? strtoupper(substr($creator->middle_name, 0, 1)) . '.' : '';
        $fullName = trim("{$creator->first_name} {$middleInitial} {$creator->last_name}");

        return [
            'id' => $this->id,
            'form_number' => $this->form_number,
            'request_type' => ucfirst($this->request_type),
            'status' => ucfirst($this->status),
            'is_draft' => $this->is_draft,
            'submitted_at' => optional($this->submitted_at)->format('m/d/Y'),
            'office_id' => $this->office_id,
            'created_by' => $this->created_by,
            'created_at' => optional($this->created_at)->format('m/d/Y'),
            'updated_at' => optional($this->updated_at)->format('m/d/Y'),
            'completed_at' => optional($this->completed_at)->format('m/d/Y'),
            'approved_at' => optional($this->approved_at)->format('m/d/Y'),
            'creator' => $fullName,
            'status_logs' => $this->whenLoaded('statusLogs', function () {
                return $this->statusLogs->map(function ($log) {
                    return [
                        'status' => $log->status,
                        'date' => $log->created_at->toIso8601String(),
                        'remark' => $log->remarks,
                        'updated_by' => optional($log->updatedBy)->name ?? null,
                    ];
                });
            }),
        ];
    }
}
