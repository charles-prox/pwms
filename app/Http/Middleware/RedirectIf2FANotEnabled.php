<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Route;

class RedirectIf2FANotEnabled
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Skip if user not logged in
        if (!$user) return redirect()->route('login');

        // Skip if 2FA not required by system
        if (!Features::enabled(Features::twoFactorAuthentication())) {
            return $next($request);
        }

        // Allow if 2FA already set
        if ($user->two_factor_secret) {
            return $next($request);
        }

        // Allow user to reach 2FA setup routes without redirect loop
        if ($request->is('user/two-factor*') || $request->is('user/profile')) {
            return $next($request);
        }

        // Force user to 2FA setup page
        return redirect()->route('two-factor.prompt');
    }
}
