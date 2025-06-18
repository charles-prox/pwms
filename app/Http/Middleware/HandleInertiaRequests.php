<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Office;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $additional_data  = array_merge(parent::share($request), [
            'auth' => [
                'user' => fn() => $request->user() ? [
                    'id' => $request->user()->id,
                    'hris_id' => $request->user()->hris_id,
                    'user_id' => $request->user()->user_id,
                    'first_name' => $request->user()->first_name,
                    'middle_name' => $request->user()->middle_name,
                    'last_name' => $request->user()->last_name,
                    'full_name' => $request->user()->full_name,
                    'email' => $request->user()->email,
                    'contact_no' => $request->user()->contact_no,
                    'employment_status' => $request->user()->employment_status,
                    'account_status' => $request->user()->account_status,
                    'office_id' => $request->user()->office_id,
                    'position' => $request->user()->position?->only(['id', 'name', 'abbreviation']),
                    'roles' => $request->user()->getRoleNames(),
                    'profile_photo_url' => $request->user()->profile_photo_url,
                    'photo' => null,
                ] : null,

            ],
        ]);

        return $additional_data;
    }
}
