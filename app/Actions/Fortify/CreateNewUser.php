<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Jetstream\Jetstream;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $hasSuperAdmin = User::role('super-admin')->exists();

        if ($hasSuperAdmin) {
            $role = 'user'; // There is at least one user with the super-admin role
        } else {
            $role = 'super-admin';
        }

        Validator::make($input, [
            'hris_id' => ['required', 'string', 'max:255'],
            'user_id' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'contact_no' => ['required', 'string', 'max:255'],
            // 'pro_code' => ['integer'],
            'employment_status' => ['required', 'string', 'max:255'],
            'office_id' => ['required', 'integer'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => $this->passwordRules(),
            // 'terms' => Jetstream::hasTermsAndPrivacyPolicyFeature() ? ['accepted', 'required'] : '',
        ])->validate();

        return User::create([
            'hris_id' => $input['hris_id'],
            'user_id' => $input['user_id'],
            'first_name' => $input['first_name'],
            'middle_name' => $input['middle_name'],
            'last_name' => $input['last_name'],
            'position' => $input['position'],
            'contact_no' => $input['contact_no'],
            // 'pro_code' => $input['pro_code'],
            'employment_status' => $input['employment_status'],
            'office_id' => $input['office_id'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ])->assignRole($role);
    }
}
