<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Services\Requests\RequestReturnService;

class RequestResource extends JsonResource
{
    protected ?RequestReturnService $returnService = null;

    // Keep default constructor
    public function __construct($resource)
    {
        parent::__construct($resource);
    }

    // Set the service manually via method
    public function withReturnService(RequestReturnService $service): static
    {
        $this->returnService = $service;
        return $this;
    }

    public function toArray(Request $request): array
    {
        $creator = $this->creator;
        $middleInitial = $creator->middle_name ? strtoupper(substr($creator->middle_name, 0, 1)) . '.' : '';
        $fullName = trim("{$creator->first_name} {$middleInitial} {$creator->last_name}");

        return [
            'id' => $this->id,
            'form_number' => $this->form_number,
            'request_type' => $this->request_type,
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
            'pdf_path' => url($this->pdf_path),
            'status_logs' => $this->whenLoaded('statusLogs', function () {
                return $this->statusLogs
                    ->sortBy('created_at')
                    ->values()
                    ->map(function ($log) {
                        return [
                            'status' => $log->status,
                            'date' => optional($log->created_at)->format('M d, Y'),
                            'remark' => $log->remarks,
                            'updated_by' => optional($log->updatedBy)->full_name ?? null,
                        ];
                    });
            }),
            'office' => $this->whenLoaded('office', function () {
                return [
                    'id' => $this->office->id,
                    'name' => $this->office->name,
                ];
            }),
            'boxes' => $this->whenLoaded('boxes', function () {
                if (!$this->returnService) return [];

                $boxesWithWithdrawal = $this->returnService->attachWithdrawalRequest($this->boxes);
                return $boxesWithWithdrawal->values()->all();
            }, []),
        ];
    }
}
