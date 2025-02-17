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
        $tokenId = $request->user()->token()->id;
        $token = Token::find($tokenId);

        if ($token && Carbon::parse($token->created_at)->addMinutes(15)->isPast()) {
            $token->revoke(); // Expire token
            return response()->json(['error' => 'Session expired, please log in again'], 401);
        }

        return $next($request);
    }
}
