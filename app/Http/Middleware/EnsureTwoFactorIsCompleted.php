<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureTwoFactorIsCompleted
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();


        // Adjust this check based on your 2FA implementation
        if (
            $user &&
            !$user->two_factor_secret &&
            !$user->two_factor_confirmed_at
            // !in_array($request->route()->getName(), $excludedRoutes)
        ) {
            // If not verified in this session, redirect to prompt
            return redirect()->route('two-factor.prompt');
        }

        return $next($request);
    }
}
