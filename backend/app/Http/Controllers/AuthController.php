<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {

        // Validate the incoming request
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Check if the credentials are correct
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            // Generate and return the access token
            $user = Auth::user();
            $token = $user->createToken('Quakbox')->accessToken;

            if ($request->route()->middleware() && in_array('api', $request->route()->middleware())) {
                return response()->json([
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => $user
                ]);
            }

            return redirect()->route('home');
        }

        // If authentication fails, throw an error
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
    public function showLoginForm(Request $request)
    {
	   return true;
    }
}
