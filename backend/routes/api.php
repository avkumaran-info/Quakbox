<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\PostController;

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

Route::middleware('auth:api')->get('get_favourite_country', [CountryController::class, 'favouriteCountryByMemberId']);
Route::middleware('auth:api')->post('set_favourite_country', [CountryController::class, 'storeFavouriteCountry']);
Route::middleware('auth:api')->post('put_favourite_country', [CountryController::class, 'updateFavouriteCountry']);
Route::middleware('auth:api')->post('del_favourite_country', [CountryController::class, 'deleteFavouriteCountry']);


Route::middleware('auth:api')->group(function () {
    Route::post('set_posts', [PostController::class, 'postStore']); // Create post with media
    Route::put('put_posts/{id}', [PostController::class, 'postUpdate']); // Update post
    Route::delete('del_posts/{id}', [PostController::class, 'postDestroy']); // Delete post
    Route::get('get_posts/{cc}', [PostController::class, 'getAllPosts']); // Get all posts

    Route::post('set_posts_like/{id}/like', [PostController::class, 'postLike']); // Like/Dislike post
    Route::post('set_posts_comment/{id}/comment', [PostController::class, 'postComment']); // Comment on post
    Route::post('set_posts_share/{id}/share', [PostController::class, 'postShare']); // Share post
});

Route::get('images/uploads/posts/{filename}', function ($filename) {
    $path = storage_path('app/public/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});