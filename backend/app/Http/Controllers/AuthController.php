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
use App\Models\GeoCountry;

use GuzzleHttp\Client;

class AuthController extends Controller
{
    public function handleFacebookAccessToken(Request $request)
    {
        $accessToken = $request->input('accessToken');

        // Validate the token with Facebook
        $facebookResponse = Http::get("https://graph.facebook.com/me", [
            'fields' => 'id,name,email',
            'access_token' => $accessToken,
        ]);

        if ($facebookResponse->failed()) {
            return response()->json([
                'result' => false,
                'message' => 'Login Unsuccessful'
            ], 400);
        }

        $facebookUser = $facebookResponse->json();

        // Find or create a user in the database
        $user = User::firstOrCreate(
            ['email' => $facebookUser['email']],
            [
                'username' => $facebookUser['name'],
                'facebook_id' => $facebookUser['id'],
            ]
        );

        // Generate an API token using Passport or Sanctum
        $authToken = $user->createToken('AuthToken')->accessToken;

        // Return the user data and token
        return response()->json([
            'result' => true,
            'message' => 'Login successful',
            'token' => $authToken
        ], 200);
    }

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
                'result' => true,
                'message' => 'Login successful',
                'token' => $authToken
            ], 200);
            
        } else {
            // If the response is not successful
            return response()->json([
                'result' => false,
                'message' => 'Login Unsuccessful'
            ], 400);
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
            'mobile_number' => ['required'],
            'profile_image' => ['required'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $mediaPath = "";
        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $mediaPath = $file->store('uploads/profile/image', 'public');
        }
        event(new Registered($user = $this->create($request->all(), $mediaPath)));
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
    protected function create(array $data, string $mediaPath)
    {
        // Create the user in the 'users' table
        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'mobile_number' => $data['mobile_number'],
            'profile_image' => $mediaPath,
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
            ->leftJoin('geo_country', 'members.country', '=', 'geo_country.code')
            ->where('member_id', $userId)
            ->select('members.*', 'geo_country.country_name')
            ->first();

        return response()->json([
            'result' => true,
            'message' => 'User Details',
            'users' => $request->user(),
            'profile_image_url' => $this->getProfileImage( $request->user() ),
            'user_details' => $memberData
        ]);
    }
    private function getProfileImage($user)
    {
        if ($user) {
            return env('APP_URL') . '/api/images/' . $user->profile_image;
        }

        return "";
    }
}
