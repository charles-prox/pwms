<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'full_name'         => $this->full_name,
            'position'          => $this->position,
            'contact_number'    => $this->contact_no,
            'email'             => $this->email,
            'account_status'    => $this->status ?? 'Active',
            'employment_status' => $this->employment_status,
            'hris_id'           => $this->hris_id,
            'profile_photo_url' => $this->profile_photo_url,
        ];
    }
}
