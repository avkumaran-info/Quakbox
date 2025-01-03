<?php

namespace App\Http\Controllers;
\Log::info(memory_get_usage());
ini_set('memory_limit', '2G');
use App\Models\User;
use App\Models\members;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered;

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
            $members = Members::where('member_id', $user["id"])->get();
            $token = $user->createToken('Quakbox')->accessToken;

            if ($request->route()->middleware() && in_array('api', $request->route()->middleware())) {
                return response()->json([
                    'result' => true,
                    'message' => 'Login successful',
                    'token' => $token,
                    'user' => $user,
                    'members' => $members,

                ]);
            }

            return redirect()->route('home');
        }

        // If authentication fails, throw an error
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    public function register(Request $request)
    {

        // Validate input
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
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
            'name' => $data['name'],
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

        return response()->json(['message' => 'Logged out successfully']);
    }
    public function showLoginForm(Request $request)
    {
	   return true;
    }
}
