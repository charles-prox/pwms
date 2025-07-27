<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureTwoFactorIsCompleted
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // If not logged in, bail early
        if (!$user) {
            return redirect()->route('login');
        }

        // If user has NOT setup 2FA, force them to do it
        if (!$user->two_factor_secret) {
            return redirect()->route('two-factor.prompt');
        }

        return $next($request);
    }
}
