<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;

//facebook
use Laravel\Socialite\Facades\Socialite;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::middleware('auth:api')->post('logout', [AuthController::class, 'logout']);

Route::post('forgot-password/send-otp', [ForgotPasswordController::class, 'sendOtp']);
Route::post('forgot-password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);
Route::post('forgot-password/reset', [ForgotPasswordController::class, 'resetPassword']);

// Route to handle the Google login token
Route::post('auth/google', [AuthController::class, 'loginWithGoogle']);

Route::get('/auth/facebook', function () {
    return Socialite::driver('facebook')->redirect();
})->name('facebook.login');

Route::get('/auth/facebook/callback', function () {
    $facebookUser = Socialite::driver('facebook')->user();

    // Handle the user data 
    // 'avatar' => $facebookUser->avatar,
    $user = \App\Models\User::updateOrCreate(
        ['facebook_id' => $facebookUser->id],
        [
            'name' => $facebookUser->name,
            'email' => $facebookUser->email,
            'password' => bcrypt(\Illuminate\Support\Str::random(16)),
        ]
    );

    // Log in the user
    Auth::login($user);

    return redirect('/dashboard'); // Redirect to the desired page
});

Route::middleware('auth:api')->get('user', [AuthController::class, 'user']);