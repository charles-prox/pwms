<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RestrictRegisterIfSuperAdminExists
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $superAdminExists = User::role('super-admin')->exists();

        if ($superAdminExists) {
            abort(403, 'Registration is closed.');
        }

        return $next($request);
    }
}
