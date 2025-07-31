<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Fortify;

class EnsureAccountIsActive
{
    public function handle(Request $request, \Closure $next)
    {
        $user = \App\Models\User::where(Fortify::username(), $request->input(Fortify::username()))->first();

        if ($user && $user->account_status !== 'active') {
            throw ValidationException::withMessages([
                Fortify::username() => ['Your account is not active.'],
            ]);
        }

        return $next($request);
    }
}
