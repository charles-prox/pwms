<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'user_id'           => $this->user_id,
            'hris_id'           => $this->hris_id,
            'first_name'        => $this->first_name,
            'middle_name'       => $this->middle_name,
            'last_name'         => $this->last_name,
            'full_name'         => $this->full_name, // accessor
            'email'             => $this->email,
            'contact_no'        => $this->contact_no,
            'employment_status' => $this->employment_status,
            'account_status'    => $this->account_status,
            'office_id'         => $this->office_id,
            'position'          => $this->position,
            'roles'             => $this->roles->pluck('name'), // from Spatie
            'profile_photo_url' => $this->profile_photo_url,
        ];
    }
}
