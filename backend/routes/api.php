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
use FFMpeg\Media\Video;

// use App\Http\Controllers\VideoCommentController;
// use App\Http\Controllers\VideoChannelController;
// use App\Http\Controllers\VideoInteractionController;
// use App\Http\Controllers\VideoSubscriptionController;

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

Route::get('get_geo_country', [CountryController::class, 'getGeoCountry']);
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
    Route::get('/', [VideoController::class, 'index']);
    Route::get('categories/{id}', [VideoController::class, 'index']);
    Route::get('categories/', [VideoController::class, 'index']);
    Route::get('{id}', [VideoController::class, 'show']);
    Route::delete('{id}', [VideoController::class, 'delete']);
    Route::get('search/{query}', [VideoController::class, 'search']);   
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

// // Video Comments Management
// Route::middleware('auth:api')->group(function () {
//     // Fetch comments for a specific video
//     Route::get('/videos/{videoId}/comments', [VideoCommentController::class, 'index']);
//     // Add a comment to a video
//     Route::post('/videos/{videoId}/comments', [VideoCommentController::class, 'store']);
//     // Update a comment
//     Route::put('/comments/{id}', [VideoCommentController::class, 'update']);
//     // Delete a comment
//     Route::delete('/comments/{id}', [VideoCommentController::class, 'destroy']);
// });

// // Video Interactions Management
// Route::middleware('auth:api')->group(function () {
//     Route::post('/videos/{videoId}/like', [VideoInteractionController::class, 'like']);
//     Route::post('/videos/{videoId}/dislike', [VideoInteractionController::class, 'dislike']);
//     Route::post('/videos/{videoId}/view', [VideoInteractionController::class, 'view']); // Can be accessed anonymously
//     Route::get('/videos/{videoId}/stats', [VideoInteractionController::class, 'stats']);
// });

// // Video Subscriptions Management
// Route::middleware('auth:api')->group(function () {
//     // Subscribe to a channel
//     Route::post('/channels/{channelId}/subscribe', [VideoSubscriptionController::class, 'subscribe']);
//     // Unsubscribe from a channel
//     Route::delete('/channels/{channelId}/unsubscribe', [VideoSubscriptionController::class, 'unsubscribe']);
//     // Get subscriptions of the authenticated user
//     Route::get('/subscriptions', [VideoSubscriptionController::class, 'mySubscriptions']);
//     // Get subscribers of a specific channel
//     Route::get('/channels/{channelId}/subscribers', [VideoSubscriptionController::class, 'channelSubscribers']);
// });

// // Video Analytics Management

// // Video Moderation Management

