<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // dd($this);
        $active = trim($this->rds->active ?? '');
        $storage = trim($this->rds->storage ?? '');

        $retention_period = (strcasecmp($active, "Permanent") === 0 || strcasecmp($storage, "Permanent") === 0)
            ? "Permanent"
            : ((int) $active + (int) $storage);

        return [
            'id' => $this->rds_id,
            'document_code' => $this->document_code,
            'document_title' => $this->rds->title_description ?? null,
            'rds_number' => "RDS-" . $this->rds->module . " #" . $this->rds->item_no,
            'retention_period' => $retention_period,
            'document_date' => $this->document_date_from || $this->document_date_to ? [
                'start' => $this->document_date_from ? [
                    'raw' => $this->document_date_from->toDateString(),
                    'formatted' => $this->document_date_from->format('F j, Y'),
                ] : null,
                'end' => $this->document_date_to ? [
                    'raw' => $this->document_date_to->toDateString(),
                    'formatted' => $this->document_date_to->format('F j, Y'),
                ] : null,
                'readable' => $this->formatReadableDateRange($this->document_date_from, $this->document_date_to),
            ] : null,
            'disposal_date' => $this->is_permanent
                ? 'Permanent'
                : [
                    'raw' => optional($this->disposal_date)->toDateString(),
                    'formatted' => optional($this->disposal_date)->format('F Y'),
                ],
        ];
    }

    private function formatReadableDateRange($start, $end): ?string
    {
        if (!$start && !$end) {
            return null;
        }

        if ($start && !$end) {
            return $start->format('F j, Y');
        }

        if (!$start && $end) {
            return $end->format('F j, Y');
        }

        // Same date
        if ($start->equalTo($end)) {
            return $start->format('F j, Y');
        }

        // Same year
        if ($start->year === $end->year) {
            // Same month
            if ($start->month === $end->month) {
                return $start->format('F j') . '–' . $end->format('j, Y');
            }
            return $start->format('F j') . ' – ' . $end->format('F j, Y');
        }

        // Different years
        return $start->format('F j, Y') . ' – ' . $end->format('F j, Y');
    }
}
