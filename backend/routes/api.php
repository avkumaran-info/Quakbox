<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\VideoCategoryController;

//facebook
use Laravel\Socialite\Facades\Socialite;

//video Module
use App\Http\Controllers\VideoController;
use App\Http\Controllers\VideoInteractionController;
use App\Http\Controllers\VideoSubscriptionController;
use App\Http\Controllers\VideoCommentController;
use FFMpeg\Media\Video;

// use App\Http\Controllers\VideoChannelController;

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
// Route to handle the Facebook Login token
Route::post('/auth/facebook', [AuthController::class, 'handleFacebookAccessToken']);

Route::middleware('auth:api')->get('user', [AuthController::class, 'user']);

Route::get('get_geo_country/{cc?}', [CountryController::class, 'getGeoCountry']);
Route::middleware('auth:api')->get('get_country_comments/{cc}', [CountryController::class, 'getCountryComments']);
Route::middleware('auth:api')->get('get_favourite_country', [CountryController::class, 'favouriteCountryByMemberId']);
Route::middleware('auth:api')->post('set_favourite_country', [CountryController::class, 'storeFavouriteCountry']);
Route::middleware('auth:api')->post('put_favourite_country', [CountryController::class, 'updateFavouriteCountry']);
Route::middleware('auth:api')->post('del_favourite_country', [CountryController::class, 'deleteFavouriteCountry']);
Route::middleware('auth:api')->post('set_country_likes', [CountryController::class, 'storeCountryLikes']);
Route::middleware('auth:api')->post('set_country_comments', [CountryController::class, 'storeCountryComments']);
Route::middleware('auth:api')->post('set_country_shares', [CountryController::class, 'storeCountryShares']);

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
    $path = storage_path('app/public/uploads/posts/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});
Route::get('images/flags/{filename}', function ($filename) {
    $path = storage_path('app/public/flags/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});

// Video Management
Route::middleware('auth:api')->prefix('videos')->group(function () {
    Route::post('upload', [VideoController::class, 'videoUpload']);
    Route::get('qlist/{category_id?}', [VideoController::class, 'index']);
    Route::get('{id}/show', [VideoController::class, 'show']);
    Route::post('{id}/delete', [VideoController::class, 'delete']);
    Route::get('search/{query?}', [VideoController::class, 'search']);   
});

// Video Interactions Management
Route::middleware('auth:api')->group(function () {
    Route::post('/videos/{videoId}/like', [VideoInteractionController::class, 'like']);
    Route::post('/videos/{videoId}/dislike', [VideoInteractionController::class, 'dislike']);
    Route::post('/videos/{videoId}/view', [VideoInteractionController::class, 'view']); // Can be accessed anonymously
    Route::get('/videos/{videoId}/stats', [VideoInteractionController::class, 'stats']);
    Route::post('/videos/{videoId}/removeinteraction', [VideoInteractionController::class, 'removeInteraction']);

});

// Video Subscriptions Management
Route::middleware('auth:api')->prefix('videos')->group(function () {
    Route::post('subscribe/{creator_id}', [VideoSubscriptionController::class, 'subscribe']);
    Route::delete('unsubscribe/{creator_id}', [VideoSubscriptionController::class, 'unsubscribe']);
    Route::get('mysubscriptions', [VideoSubscriptionController::class, 'listsubscriptions']);
    Route::get('browsestations', [VideoSubscriptionController::class, 'listbrowsestations']);
    Route::get('subscribers/{creator_id}', [VideoSubscriptionController::class, 'getSubscribers']);
});

// Video Comments Management
Route::middleware('auth:api')->group(function () {
    // Fetch comments for a specific video
    Route::get('/videos/{videoId}/comments', [VideoCommentController::class, 'index']);
    // Add a comment to a video
    Route::post('/videos/{videoId}/comments', [VideoCommentController::class, 'store']);
    // Update a comment
    Route::post('/videos/comments/{id}', [VideoCommentController::class, 'update']);
    // Delete a comment
    Route::delete('/videos/comments/{id}', [VideoCommentController::class, 'destroy']);
});

// // Video Channel Management
// Route::middleware('auth:api')->prefix('channel')->group(function () {
//     Route::post('create', [VideoChannelController::class, 'create']);
//     Route::get('{id}', [VideoChannelController::class, 'show']);
//     Route::put('{id}', [VideoChannelController::class, 'update']);
//     Route::delete('{id}', [VideoChannelController::class, 'delete']);
//     Route::get('{id}/videos', [VideoChannelController::class, 'getVideos']);
//     Route::post('{id}/add-video/{videoId}', [VideoChannelController::class, 'addVideo']);
//     Route::delete('{id}/remove-video/{videoId}', [VideoChannelController::class, 'removeVideo']);
// });

Route::get('images/uploads/profile/image/{filename}', function ($filename) {
    $path = storage_path('app/public/uploads/profile/image/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});

Route::get('images/uploads/thumbnails/temp/{filename}', function ($filename) {
    $path = storage_path('app/public/uploads/thumbnails/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});

Route::get('images/uploads/thumbnails/{filename}', function ($filename) {
    $path = storage_path('app/public/uploads/thumbnails/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});

Route::get('images/uploads/videos/{filename}', function ($filename) {
    $path = storage_path('app/public/uploads/videos/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});

// For Temp video file
Route::get('images/uploads/videos/temp/{filename}', function ($filename) {
    $path = storage_path('app/public/uploads/videos/temp/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});
// To display permanent video file

Route::get('images/uploads/videos/permanent/{filename}', function ($filename) {
    if (!Storage::disk('public')->exists("uploads/videos/permanent/$filename")) {
        abort(404);
    }
    return response()->file(Storage::disk('public')->path("uploads/videos/permanent/$filename"));
});

Route::post('/send-otp-mobile', [AuthController::class, 'sendOtpMob']);
Route::post('/verify-otp-mobile', [AuthController::class, 'verifyOtpMob']);
Route::post('/send-otp-mail', [AuthController::class, 'sendOtpMail']);
Route::post('/verify-otp-mail', [AuthController::class, 'verifyOtpMail']);
