<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RDSResource extends JsonResource
{
    public function toArray($request)
    {
        // Convert array to object if needed
        $data = is_array($this->resource)
            ? (object) $this->resource
            : $this->resource;

        // Early exit if no valid RDS record
        if (!$data) {
            return null;
        }

        $active = trim($data->active ?? '');
        $storage = trim($data->storage ?? '');

        $retention = (strcasecmp($active, 'Permanent') === 0 || strcasecmp($storage, 'Permanent') === 0)
            ? 'Permanent'
            : ((int) $active + (int) $storage);

        return [
            'id' => $data->id ?? null,
            'module' => !empty($data->module) ? "Module {$data->module}" : null,
            'department' => $data->department ?? 'N/A',
            'rds_number' => !empty($data->item_no)
                ? "RDS-{$data->module} #{$data->item_no}"
                : 'Not in the RDS',
            'item_no' => $data->item_no ?? null,
            'document_title' => $data->title_description ?? 'Untitled',
            'retention_period' => $retention ?: 'N/A',
        ];
    }
}
