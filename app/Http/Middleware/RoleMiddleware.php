<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if ($user->status === 'suspended') {
            auth()->logout();
            return redirect()->route('login')->withErrors(['email' => 'Your account has been suspended. Please contact support.']);
        }

        if (!in_array($user->role, $roles)) {
            abort(403, 'Unauthorized action for your role.');
        }

        return $next($request);
    }
}
