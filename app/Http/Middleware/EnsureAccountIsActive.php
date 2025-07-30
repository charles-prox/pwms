<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Fortify;

class EnsureAccountIsActive
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->account_status !== 'active') {
            /** @var \Illuminate\Contracts\Auth\StatefulGuard $auth */
            $auth = auth();
            $auth->logout();

            throw ValidationException::withMessages([
                Fortify::username() => ['Your account is not active.'],
            ]);
        }

        return $next($request);
    }
}
