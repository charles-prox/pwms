<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return Auth::check() && $user->hasRole('super-admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')->id;

        return [
            'hris_id'           => ['required', 'string', 'max:8', Rule::unique('users')->ignore($userId)],
            'user_id'           => ['required', 'string', 'max:255', Rule::unique('users')->ignore($userId)],
            'first_name'        => ['required', 'string', 'max:255'],
            'middle_name'       => ['nullable', 'string', 'max:255'],
            'last_name'         => ['required', 'string', 'max:255'],
            'email'             => ['required', 'email', 'max:255', Rule::unique('users')->ignore($userId)],
            'position'          => ['required', 'string'],
            'contact_no'        => ['nullable', 'string', 'max:255'],
            'employment_status' => ['required', 'string'],
            'office_id'         => ['required', 'integer', 'exists:offices,id'],
            'account_status'    => ['required', 'string'],
            'role'              => ['required', 'string', 'exists:roles,name'],
            'photo'             => ['nullable', 'image', 'max:5120'],
        ];
    }
}
