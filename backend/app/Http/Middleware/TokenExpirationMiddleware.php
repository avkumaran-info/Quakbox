<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Laravel\Passport\Token;

class TokenExpirationMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
    
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        } else {
             return $next($request);
        }
    
        $token = $request->bearerToken();  // Get token from the request header
    
        if (!$token) {
            return response()->json(['error' => 'Token not found.'], 401);
        }
    
        $token = Token::find($token);
        if (!$token || Carbon::parse($token->expires_at)->isPast()) {
            return response()->json(['error' => 'Session expired, please log in again'], 401);
        }
    
        return $next($request);
    }
}
