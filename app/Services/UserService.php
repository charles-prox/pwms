<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;

class UserService
{
    /**
     * Create a new user with optional photo upload and role assignment.
     */
    public function create(array $data): User
    {
        $user = User::create([
            'hris_id' => $data['hris_id'],
            'user_id' => $data['user_id'],
            'first_name' => $data['first_name'],
            'middle_name' => $data['middle_name'] ?? null,
            'last_name' => $data['last_name'],
            'email' => $data['email'],
            'position' => $data['position'],
            'contact_no' => $data['contact_no'] ?? null,
            'employment_status' => $data['employment_status'],
            'office_id' => $data['office_id'],
            'account_status' => $data['account_status'],
            'password' => Hash::make('Phic@12345'), // default password
        ]);

        // Assign role
        if (isset($data['role'])) {
            $user->syncRoles([$data['role']]);
        }

        // Upload photo if provided
        if (isset($data['photo']) && $data['photo'] instanceof UploadedFile) {
            $user->updateProfilePhoto($data['photo']);
        }

        return $user;
    }
}
