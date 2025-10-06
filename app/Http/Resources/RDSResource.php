<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RDSResource extends JsonResource
{
    public function toArray($request)
    {
        $active = trim($this->active);
        $storage = trim($this->storage);

        $retention = (strcasecmp($active, "Permanent") === 0 || strcasecmp($storage, "Permanent") === 0)
            ? "Permanent"
            : ((int) $active + (int) $storage);

        return [
            'id' => $this->id,
            'rds_number' => "RDS-" . $this->module . " #" . $this->item_no,
            'document_title' => $this->title_description,
            'retention_period' => $retention,
            'department' => $this->department,
        ];
    }
}
