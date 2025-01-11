<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function unauthenticated($request, AuthenticationException $exception)
    {
        if ($exception->getMessage() == 'Unauthenticated.') {
            // Check for expired token
            if (str_contains($exception->getMessage(), 'expired')) {
                return response()->json(['error' => 'Token has expired. Please log in again.'], 401);
            }

            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
    }
}
