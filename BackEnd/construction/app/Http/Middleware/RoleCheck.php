<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user()->tokens) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        } /* else {
            if ($request->user() && $request->user()->tokens) {
                $token = $request->user()->tokens->firstWhere('name', '_AdminToken');
                if (!$token || !$token->can('_AdminToken')) {
                    return response()->json(['error' => 'Unauthorized123'], 401);
                }
            }
        } */

        return $next($request);
    }
}
