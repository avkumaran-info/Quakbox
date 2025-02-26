<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
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
use App\Http\Controllers\StreamController;
use App\Http\Controllers\FileUploadController;

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

Route::get('/stream-key', [StreamController::class, 'getStreamKey']);
Route::post('/generate-stream-key', [StreamController::class, 'generateStreamKey']);
Route::post('/upload-chunk-live', [FileUploadController::class, 'uploadChunkLive']);

Route::get('/stream-video/{stream_key}', function ($stream_key) {
    $hls_url = "http://develop.quakbox.com:8080/hls/{$stream_key}.m3u8";
    
    return response()->json([
        'stream_url' => $hls_url,
    ]);
});



//Route::post('/upload-chunked', [StreamController::class, 'uploadChunk']);
//Route::get('/watch-stream/{streamKey}', [StreamController::class, 'watchStream']);

//Route::post('/start-stream', [StreamController::class, 'startStream']);
//Route::post('/upload-chunked', [StreamController::class, 'uploadChunked']);
//Route::get('/watch/{streamKey}', [StreamController::class, 'watchStreamed']);
//Route::get('/phpinformation', [StreamController::class, 'phpinformation']);

//Route::post('/generate-stream-key', [StreamController::class, 'generateStreamKey']);
//Route::get('/get-stream-key', [StreamController::class, 'startStream']);



//Live streaming 
//Route::post('/start-stream', [LiveStreamController::class, 'startStream']);
//Route::post('/generate-hls', [LiveStreamController::class, 'generateHLS']);
//Route::post('/upload-chunk', [LiveStreamController::class, 'uploadChunk']);

Route::get('images/hls/{streamKey}/{segment}', function ($streamKey, $segment) {
    $filePath = "hls/{$streamKey}/{$segment}";

    if (!Storage::disk('public')->exists($filePath)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    $mimeType = str_ends_with($segment, '.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t';

    return Response::make(Storage::disk('public')->get($filePath), 200, [
        'Content-Type' => $mimeType,
    ]);
});

Route::post('login', [AuthController::class, 'login']);

Route::post('register', [AuthController::class, 'register']);
// Route::middleware(['auth:api'])->get('user', [AuthController::class, 'user']);

Route::middleware(['auth:api', 'token.expiry'])->post('logout', [AuthController::class, 'logout']);

Route::middleware(['auth:api', 'token.expiry'])->get('user', function (Request $request) {
    return response()->json($request->user());
});    

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
    Route::get('get_posts/{cc?}', [PostController::class, 'getAllPosts']); // Get all posts
    Route::post('set_posts_like/{id}/like', [PostController::class, 'postLike']); // Like/Dislike post
    Route::post('set_posts_like/{id}/dislike', [PostController::class, 'postDislike']);
    Route::get('get_posts_comment/{id}/comment', [PostController::class, 'getComment']);
    Route::post('set_posts_comment/{id}/comment', [PostController::class, 'postComment']); // Comment on post
    Route::put('put_comment/{id}', [PostController::class, 'commentUpdate']);
    Route::post('set_posts_share/{id}/share', [PostController::class, 'postShare']); // Share post
    // Route to delete a comment
    Route::delete('del_posts/{postId}/comments/{commentId}', [PostController::class, 'commentDestroy']); // Delete comment
    Route::get('posts/{id}/liked-users', [PostController::class, 'getLikedUsers']);
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
Route::get('get-upload-key', [VideoController::class, 'videoUploadKey']);
Route::middleware('auth:api')->prefix('videos')->group(function () {
    Route::post('upload', [VideoController::class, 'videoUpload']);
    Route::get('qlist/{category_id?}', [VideoController::class, 'index']);
    Route::get('{id}/show', [VideoController::class, 'show']);
    Route::post('{id}/delete', [VideoController::class, 'delete']);
    Route::get('search/{query?}', [VideoController::class, 'search']);   
    Route::get('my-videos', [VideoController::class, 'userVideos']); // ✅ New route
});

// Large File Upload
Route::post('upload-video-chunk', [FileUploadController::class, 'uploadChunk']);
Route::post('merge-video-chunks', [FileUploadController::class, 'mergeChunks']);

// popular videos
Route::middleware('auth:api')->prefix('dashboard')->group(function () {
    Route::get('popular', [VideoController::class, 'showHighViewVideos']);
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

Route::get('images/uploads/videos/temp/thumbnails/{filename}', function ($filename) {
    $path = storage_path('app/public/uploads/videos/temp/thumbnails/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }
    return response()->file($path);
});

Route::get('images/uploads/videos/permanent/thumbnails/{filename}', function ($filename) {
    $path = storage_path('app/public/uploads/videos/permanent/thumbnails/' . $filename);
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
    $path = storage_path('app/public/uploads/videos/permanent/' . $filename);
    if (!file_exists($path)) {
        abort(404);
    }

    $fileSize = filesize($path);
    $handle = fopen($path, 'rb');

    $start = 0;
    $end = $fileSize - 1;
    $length = $fileSize;

    // Handle range requests for seeking
    if ($request->hasHeader('Range')) {
        preg_match('/bytes=(\d*)-(\d*)/', $request->header('Range'), $matches);
        $start = isset($matches[1]) && $matches[1] !== '' ? intval($matches[1]) : 0;
        $end = isset($matches[2]) && $matches[2] !== '' ? intval($matches[2]) : $end;
        $length = ($end - $start) + 1;

        header('HTTP/1.1 206 Partial Content');
    } else {
        header('HTTP/1.1 200 OK');
    }

    // Set headers
    header("Content-Type: video/mp4");
    header("Accept-Ranges: bytes");
    header("Content-Length: " . $length);
    header("Content-Range: bytes $start-$end/$fileSize");

    fseek($handle, $start);
    $bufferSize = 1024 * 1024; // 1MB chunks
    $bytesSent = 0;

    while (!feof($handle) && $bytesSent < $length) {
        $remaining = $length - $bytesSent;
        $readLength = ($remaining > $bufferSize) ? $bufferSize : $remaining;
        echo fread($handle, $readLength);
        $bytesSent += $readLength;
        flush(); // Send data in chunks
    }

    fclose($handle);
    exit;
});
//
Route::get('images/uploads/videos/permanent/{folder}/{file}', function (Request $request, $folder, $file) {
    $path = storage_path("app/public/uploads/videos/permanent/{$folder}/{$file}");

    if (!file_exists($path)) {
        return response()->json(['error' => 'File not found'], 404);
    }

    // Set correct MIME type
    $mimeType = match (pathinfo($path, PATHINFO_EXTENSION)) {
        'm3u8' => 'application/vnd.apple.mpegurl',
        'ts'   => 'video/mp2t',
        default => mime_content_type($path),
    };

    // Stream the file with proper headers
    return response()->stream(function () use ($path) {
        readfile($path);
    }, 200, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'no-cache',
        'Access-Control-Allow-Origin' => '*',
        'Accept-Ranges' => 'bytes',
    ]);
});



//Route::get('images/uploads/videos/permanent/{streamKey}/{segment}', function ($streamKey, $segment) {
//    $filePath = "uploads/videos/permanent/{$streamKey}/{$segment}";

//    if (!Storage::disk('public')->exists($filePath)) {
//        return response()->json(['error' => 'File not found'], 404);
//    }

//    $mimeType = str_ends_with($segment, '.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/mp2t';

//    return Response::make(Storage::disk('public')->get($filePath), 200, [
//        'Content-Type' => $mimeType,
//    ]);
//});


Route::post('/send-otp-mobile', [AuthController::class, 'sendOtpMob']);
Route::post('/verify-otp-mobile', [AuthController::class, 'verifyOtpMob']);
Route::post('/send-otp-mail', [AuthController::class, 'sendOtpMail']);
Route::post('/verify-otp-mail', [AuthController::class, 'verifyOtpMail']);
