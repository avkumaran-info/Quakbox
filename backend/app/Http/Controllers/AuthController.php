<?php

namespace App\Http\Controllers;

\Log::info(memory_get_usage());
ini_set('memory_limit', '2G');

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\DB;

use App\Models\User;
use App\Models\Members;

use GuzzleHttp\Client;

class AuthController extends Controller
{
    // Handle Google login using the token passed from frontend
    public function loginWithGoogle(Request $request)
    {
        $token = $request->input('token');

        // Call the tokeninfo endpoint to verify the token
        $response = Http::get('https://www.googleapis.com/oauth2/v3/tokeninfo', [
            'id_token' => $token,
        ]);

        if ($response->successful()) {
            // Token is valid, parse user info
            $googleUser = $response->json();
            $user = User::where('email', $googleUser['email'])->first();

            if (!$user) {
                // Create a new user if they don't exist
                $authUser = User::create([
                    'username' => $googleUser['name'],
                    'email' => $googleUser['email'],
                    'email_verified_at' => TRUE,
                    'google_login' => TRUE,
                ]);
            }

            // Generate an API token using Passport or Sanctum
            $authToken = $user->createToken('AuthToken')->accessToken;

            // Return the user data and token
            return response()->json([
                'token' => $authToken
            ]);
            
        } else {
            // If the response is not successful
            return response()->json(['error' => 'Invalid Token'], 400);
        }
    }
    public function login(Request $request)
    {

        // Validate the incoming request
        $request->validate([
            'email' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    // Check if the value is a valid email
                    if (filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        return true; // No need for further checks if it's a valid email.
                    }

                    // Check if the value is a valid username
                    if (!preg_match('/^[a-zA-Z0-9_-]{3,20}$/', $value)) {
                        return $fail('The ' . $attribute . ' must be a valid email or username.');
                    }
                }
            ],
            'password' => 'required|string',
        ]);

        // Login with email or username
        $mailCredentials = $request->only('email', 'password');
        $nameCredentials = $request->only('username', 'password');

        if (Auth::attempt($mailCredentials) || Auth::attempt($nameCredentials)) {
            $user = Auth::user();
            $members = Members::where('member_id', $user["id"])->get();
            $token = $user->createToken('AuthToken')->accessToken;

            if ($request->route()->middleware() && in_array('api', $request->route()->middleware())) {
                return response()->json([
                    'result' => true,
                    'message' => 'Login successful',
                    'token' => $token
                ], 200);
            }

            return redirect()->route('home');
        }

        return response()->json([
            'result' => false,
            'message' => 'Login Unsuccessful'
        ], 200);
    }

    public function register(Request $request)
    {

        // Validate input
        $validator = Validator::make($request->all(), [
            'username' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'birthdate' => ['nullable', 'string', 'max:15'],
            'country' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        event(new Registered($user = $this->create($request->all())));
        return response()->json([
            'result' => true
        ], 200);
    }
    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        // Create the user in the 'users' table
        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Create the profile in the 'profiles' table
        Members::create([
            'member_id' => $user->id,  // Link to the user
            'birthdate' => $data['birthdate'] ?? null,  // Optional fields
            'country' => $data['country'] ?? null,
        ]);

        return $user;
    }
    public function logout(Request $request)
    {
        $request->user()->token()->delete();

        return response()->json([
            'result' => true,
            'message' => 'Logged out successfully'
        ]);
    }
    public function showLoginForm(Request $request)
    {
	   return true;
    }
    public function user(Request $request)
    {

        $userId = $request->user()->id;

        $memberData = DB::table('members')
            ->where('member_id', $userId)
            ->first();

        return response()->json([
            'result' => true,
            'message' => 'User Details',
            'users' => $request->user(),
            'user_details' => $memberData
        ]);
    }
}
