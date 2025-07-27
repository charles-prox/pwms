<?php

// app/Http/Middleware/EnsureTwoFactorIsNotEnabled.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureTwoFactorNotEnabled
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->two_factor_secret) {
            return redirect()->route('dashboard') // or any safe default route
                ->with('status', 'Two-Factor Authentication is already enabled.');
        }

        return $next($request);
    }
}
