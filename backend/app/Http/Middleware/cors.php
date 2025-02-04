<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        return $next($request)
            // Allow any origin (CORS)
            ->header('Access-Control-Allow-Origin', '*')
            // Specify allowed HTTP methods
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            // Specify allowed headers
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            // Enable credentials (optional)
            ->header('Access-Control-Allow-Credentials', 'true');
    }
}
