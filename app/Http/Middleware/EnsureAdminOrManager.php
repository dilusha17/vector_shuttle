<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminOrManager
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! Auth::check() || ! Auth::user()->hasAdminAccess()) {
            if ($request->header('X-Inertia')) {
                return redirect()->route('admin.login');
            }

            return redirect()->route('admin.login');
        }

        return $next($request);
    }
}
