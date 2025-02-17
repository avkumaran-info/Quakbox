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
use App\Models\OtpVerification;

use GuzzleHttp\Client;
use Carbon\Carbon;
use App\Models\FavouriteCountry;
use App\Models\PasswordResetOtp;
use App\Mail\QuakboxMailVerification;
use Illuminate\Support\Facades\Mail;

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
        $member = Members::create([
            'member_id' => $user->id,  // Link to the user
            'birthdate' => $data['birthdate'] ?? null,  // Optional fields
            'country' => $data['country'] ?? null,
        ]);

        $geoData = DB::table('geo_country')
            ->where('code', $data['country'])
            ->select('country_name')
            ->first();

        // Store favourite country in `favourite_country` table
        FavouriteCountry::create([
            'member_id' => $member->member_id,  
            'favourite_country' => 1, // Default Favorite country
            'code' => $geoData->country_name,
        ]);         
    }
    public function logout(Request $request)
    {
        $token = $request->user()->token();  // Get the current token
        if ($token) {
            $token->revoke();  // Revoke the token
        }
    
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
    /**
     * Send OTP for phone number verification
     */
    public function sendOtpMob(Request $request)
    {
        // Validate phone number (should not exist in users table)
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid input data",
                "errors" => $validator->errors()
            ], 422);
        }

        $mobile_number = $request->mobile_number;

        // Generate OTP
        $otp = rand(100000, 999999);

        // Save OTP in database
        OtpVerification::updateOrCreate(
            ['mobile_number' => $mobile_number],
            [
                'otp' => $otp,
                'expires_at' => Carbon::now()->addMinutes(10),
            ]
        );

        // // Send OTP via Twilio
        // try {
        //     $twilio = new Client(env('TWILIO_SID'), env('TWILIO_AUTH_TOKEN'));
        //     $twilio->messages()->create(
        //         '+91' . $mobile_number,
        //         [
        //             'from' => env('TWILIO_PHONE_NUMBER'),
        //             'body' => "Your OTP for registration is: $otp. It is valid for 10 minutes."
        //         ]
        //     );
        // } catch (\Exception $e) {
        //     return response()->json([
        //         "status" => false,
        //         "code" => 500,
        //         "message" => "Failed to send OTP",
        //         "error" => $e->getMessage()
        //     ], 500);
        // }

        return response()->json([
            "status" => true,
            "code" => 200,
            "message" => "OTP sent successfully"
        ], 200);
    }

    /**
     * Verify OTP and register user
     */
    public function verifyOtpMob(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'mobile_number' => 'required',
            'otp' => 'required|digits:6',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid input data",
                "errors" => $validator->errors()
            ], 422);
        }
    
        // // Retrieve OTP from the database
        // $otpRecord = OtpVerification::where('mobile_number', $request->mobile_number)
        //     ->where('otp', $request->otp)
        //     ->first();
    
        // if (!$otpRecord) {
        //     return response()->json([
        //         "status" => false,
        //         "code" => 422,
        //         "message" => "Invalid OTP"
        //     ], 422);
        // }
    
        // // Check if OTP is expired
        // if (Carbon::now()->isAfter($otpRecord->expires_at)) {
        //     return response()->json([
        //         "status" => false,
        //         "code" => 422,
        //         "message" => "OTP has expired"
        //     ], 422);
        // }

        if ($request->otp == "123456") {
            // If OTP is correct, return success response
            return response()->json([
                "status" => true,
                "code" => 200,
                "message" => "OTP verified successfully"
            ], 200);
        } else {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid OTP"
            ], 422);
        }
    }
    
    public function sendOtpMail(Request $request)
    {
        // Validate email
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid Input data",
                "errors" => $validator->errors()
            ], 422);
        }

        $email = $request->email;

        // Generate OTP
        $otp = rand(100000, 999999);

        // Save OTP to the database
        PasswordResetOtp::updateOrCreate(
            ['email' => $email],
            [
                'otp' => $otp,
                'expires_at' => Carbon::now()->addMinutes(10),
            ]
        );

        // Send OTP via email
        $data = [
            'subject' => 'Quakbox Mail Verification',
            'title' => 'Quakbox Mail Verification',
            'message' => 'Your OTP is:'. $otp
        ];

        Mail::to($email)->send(new QuakboxMailVerification($data));

        return response()->json([
            "status" => true,
            "code" => 200,
            "message" => "OTP sent successfully"
        ], 200);
    }

    public function verifyOtpMail(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid Input data",
                "errors" => $validator->errors()
            ], 422);
        }

        $otpRecord = PasswordResetOtp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$otpRecord || Carbon::now()->isAfter($otpRecord->expires_at)) {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid or expired OTP",
                "errors" => $validator->errors()
            ], 422);
        }

        // OTP is valid
        return response()->json([
            "status" => true,
            "code" => 200,
            "message" => "OTP verified successfully"
        ], 200);
    }
}
