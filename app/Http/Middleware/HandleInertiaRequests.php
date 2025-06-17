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
                    'name' => $request->user()->full_name,
                    'email' => $request->user()->email,
                    'position' => $request->user()->position?->only(['id', 'name', 'abbreviation']),
                    'roles' => $request->user()->getRoleNames(),
                    'profile_photo_url' => $request->user()->profile_photo_url
                ] : null,
            ],
        ]);

        return $additional_data;
    }
}
