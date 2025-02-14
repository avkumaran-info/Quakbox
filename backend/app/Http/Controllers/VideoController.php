<?php

namespace App\Http\Controllers;

ini_set('memory_limit', '2G');

use Illuminate\Http\Request;
use App\Models\M_Videos;
use App\Models\M_Video_Interactions;
use App\Models\M_Video_Subscription;
use FFMpeg\FFMpeg;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use FFMpeg\Coordinate\TimeCode;
use FFMpeg\FFProbe;

class VideoController extends Controller
{   
    public function videoUpload(Request $request)
    {
        $userId = $request->user()->id;
        $videoType = $request->video_type;
        if ($request->video_type == 1) {
            // Step 1: Upload video temporarily and generate thumbnails
            if ($request->hasFile('video_file') && filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN)) {
                $validator = Validator::make($request->all(), [
                    'video_file' => 'required',
                    'video_file.*' => 'file|mimes:mp4,mp3,mov,avi,mkv,jpeg,png,jpg,gif',
                ]);
            
                if ($validator->fails()) {
                    return response()->json([
                        'result' => false,
                        'message' => 'Validation failed',
                        'errors' => $validator->errors(),
                    ], 422);
                }
                

                $file = $request->file('video_file');

                // ✅ Determine the upload path
                $tempFolder = 'uploads/videos/temp';
                // Ensure temp folder exists
                if (!file_exists(storage_path($tempFolder))) {
                    mkdir(storage_path($tempFolder), 0775, true);
                }
                $uniqueFileName = uniqid() . '.' . $file->getClientOriginalExtension();
                $mediaPath = $file->storeAs($tempFolder, $uniqueFileName, 'public');
                $videoPath = Storage::disk('public')->path($mediaPath);
                $singleFilePath = env('APP_URL') . '/api/images/' . $mediaPath;
                $thumbnails = [];
                // ✅ Generate video thumbnail
                $videoThumbnails = $this->generateThumbnails($videoPath, $uniqueFileName);
                if (is_array($videoThumbnails)) {
                    $thumbnails = array_merge($thumbnails, $videoThumbnails);
                } else {
                    $thumbnails[] = $videoThumbnails;
                }

                return response()->json([
                    'result' => true,
                    'message' => 'File uploaded successfully',
                    'file_path' => $singleFilePath,
                    'video_type' => $request->video_type,
                    'thumbnails' => $thumbnails,
                ], 201);
            }

            // Step 2: Process permanent storage for video and photos
            if ($request->has('file_path') && $request->has('title') && !filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN)) {

                // Check if thumbnail is provided
                $defaultThumbnailPath = $request->defaultthumbnail;
                if (!$defaultThumbnailPath) {
                    return response()->json([
                        'result' => false,
                        'message' => 'Thumbnail is required.',
                    ], 400);
                }
                $filePath = $request->file_path;
                $thumbnailPath = $request->defaultthumbnail;
                // temp storage path
                $tempFolder = 'uploads/videos/temp/';
                $tempThumbnailFolder = 'uploads/videos/temp/thumbnails/';
                // Define permanent storage paths
                $permanentVideoFolder = 'uploads/videos/permanent/';
                $permanentThumbnailFolder = 'uploads/videos/permanent/thumbnails/';
                // Extract file names from URLs
                $videoFileName = basename($filePath);
                $thumbnailFileName = basename($thumbnailPath);
                // Move the video file
                if (Storage::disk('public')->exists(str_replace(env('APP_URL') . '/api/images/', '', $filePath))) {
                    Storage::disk('public')->move(
                        str_replace(env('APP_URL') . '/api/images/', '', $filePath),
                        $permanentVideoFolder . $videoFileName
                    );
                    $filePath = env('APP_URL') . '/api/images/' . $permanentVideoFolder . $videoFileName;
                }
                // Move the thumbnail file
                if (Storage::disk('public')->exists(str_replace(env('APP_URL') . '/api/images/', '', $thumbnailPath))) {
                    Storage::disk('public')->move(
                        str_replace(env('APP_URL') . '/api/images/', '', $thumbnailPath),
                        $permanentThumbnailFolder . $thumbnailFileName
                    );
                    $thumbnailPath = env('APP_URL') . '/api/images/' . $permanentThumbnailFolder . $thumbnailFileName;
                }
                // ✅ **Remove all other files in the temp folder**
                $allTempFiles = Storage::disk('public')->files($tempFolder);
                foreach ($allTempFiles as $tempFile) {
                    if (basename($tempFile) !== $videoFileName) {
                        Storage::disk('public')->delete($tempFile);
                    }
                }
                $allTempThumbnails = Storage::disk('public')->files($tempThumbnailFolder);
                foreach ($allTempThumbnails as $tempThumbnail) {
                    if (basename($tempThumbnail) !== $thumbnailFileName) {
                        Storage::disk('public')->delete($tempThumbnail);
                    }
                }

                // ✅ Convert tags to array
                $tagsArray = array_map('trim', explode(',', $request->tags ?? ''));

                try {
                    // ✅ Save to Database
                    $video = M_Videos::create([
                        'user_id' => $userId,
                        'title' => $request->title,
                        'description' => $request->description,
                        'file_path' => $filePath,
                        'category_id' => (int) $request->category_id,
                        'type' => (int) $request->type,
                        'title_size' => $request->title_size,
                        'title_colour' => $request->title_colour,
                        'defaultthumbnail' => $thumbnailPath,
                        'country_code' => (int) $request->country_code,
                        'video_type' => $videoType,
                        'tags' => json_encode($tagsArray),
                        'temp_upload' => false,
                    ]);

                    Log::info('Video/photo metadata saved', ['video_id' => $video->id]);

                    return response()->json([
                        'result' => true,
                        'message' => 'File(s) uploaded successfully',
                        'video_id' => $video->id, // ✅ Return video_id
                    ], 201);
                } catch (\Exception $e) {
                    Log::error('Database Error: ' . $e->getMessage());
                    return response()->json([
                        'result' => false,
                        'message' => 'Database error: ' . $e->getMessage(),
                    ], 500);
                }
            }

            // If request is invalid
            return response()->json([
                'result' => false,
                'message' => 'Invalid request',
            ], 422);
        }
        if ($request->video_type == 3) {
            if ($request->hasFile('video_file') && filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN)) {
                $validator = Validator::make($request->all(), [
                                'video_file' => 'required|array',
                                'video_file.*' => 'file|mimes:jpeg,png,jpg,gif',
                            ]);
            
                if ($validator->fails()) {
                    return response()->json([
                        'result' => false,
                        'message' => 'Validation failed',
                        'errors' => $validator->errors(),
                    ], 422);
                }

                $uploadedImages = [];
                $uploadedThumbnailImages = [];
                // ✅ Determine the upload path
                $tempFolder = 'uploads/videos/temp';
                $tempThumbnailFolder = 'uploads/videos/temp/thumbnails';
                // Ensure temp folder exists
                if (!file_exists(storage_path($tempFolder))) {
                    mkdir(storage_path($tempFolder), 0775, true);
                }
                $imageUniqueName = uniqid();
                $i = 1;
                $files = is_array($request->file('video_file')) ? $request->file('video_file') : [$request->file('video_file')];
                foreach ($files as $image) {
                    // Generate unique file name
                    $fileName =  $imageUniqueName.'_'.$i. '.' . $image->getClientOriginalExtension();

                    // Store image in the public disk
                    $filePath = $image->storeAs($tempFolder, $fileName, 'public');
                    $filePathThumbnail = $image->storeAs($tempThumbnailFolder, $fileName, 'public');

                    // Get the full URL
                    $uploadedImages[] = env('APP_URL') . '/api/images/' . $filePath;
                    $uploadedThumbnailImages[] = env('APP_URL') . '/api/images/' . $filePathThumbnail;
                    $i++;
                }

                return response()->json([
                    'result' => true,
                    'message' => 'File uploaded successfully',
                    'file_path' => $uploadedImages,
                    'video_type' => $request->video_type,
                    'thumbnails' => $uploadedThumbnailImages,
                ], 201);
            }
        }





        // Audio Format File Upload
        if ($request->video_type == 2) {
            if ($request->hasFile('video_file') && filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN)) {
                
                $validator = Validator::make($request->all(), [
                                'video_file' => 'required|file|mimes:mp3,wav,aac,ogg',
                            ]);
            
                if ($validator->fails()) {
                    return response()->json([
                        'result' => false,
                        'message' => 'Validation failed',
                        'errors' => $validator->errors(),
                    ], 422);
                }

                $file = $request->file('video_file');

                // ✅ Determine the upload path
                $tempFolder = 'uploads/videos/temp';
                // Ensure temp folder exists
                if (!file_exists(storage_path($tempFolder))) {
                    mkdir(storage_path($tempFolder), 0775, true);
                }
                $uniqueAudioName = uniqid();
                $uniqueFileName = $uniqueAudioName . '.' . $file->getClientOriginalExtension();
                $mediaPath = $file->storeAs($tempFolder, $uniqueFileName, 'public');
                $videoPath = Storage::disk('public')->path($mediaPath);
                $audioFilePath = env('APP_URL') . '/api/images/' . $mediaPath;
                

                // ✅ Predefined thumbnail
                $defaultThumbnailPath = 'uploads/videos/temp/thumbnails/audio/default-audio-thumbnail.png';
                $newThumbnailName = $uniqueAudioName . '.png';
                $newThumbnailPath = 'uploads/videos/temp/thumbnails/' . $newThumbnailName;

                // ✅ Copy the default thumbnail and rename it
                Storage::disk('public')->copy($defaultThumbnailPath, $newThumbnailPath);

                // ✅ Get the new thumbnail URL
                $defaultThumbnail = env('APP_URL') . '/api/images/' . $newThumbnailPath;

                $thumbnails[] = $defaultThumbnail;

                return response()->json([
                    'result' => true,
                    'message' => 'File uploaded successfully',
                    'file_path' => $audioFilePath,
                    'video_type' => $request->video_type,
                    'thumbnails' => $thumbnails,
                ], 201);
            }
            // Step 2: Process permanent storage for video and photos
            if ($request->has('file_path') && $request->has('title') && !filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN)) {

                // Check if thumbnail is provided
                $defaultThumbnailPath = $request->defaultthumbnail;
                if (!$defaultThumbnailPath) {
                    return response()->json([
                        'result' => false,
                        'message' => 'Thumbnail is required.',
                    ], 400);
                }
                $filePath = $request->file_path;
                $thumbnailPath = $request->defaultthumbnail;
                // temp storage path
                $tempFolder = 'uploads/videos/temp/';
                $tempThumbnailFolder = 'uploads/videos/temp/thumbnails/';
                // Define permanent storage paths
                $permanentVideoFolder = 'uploads/videos/permanent/';
                $permanentThumbnailFolder = 'uploads/videos/permanent/thumbnails/';
                // Extract file names from URLs
                $videoFileName = basename($filePath);
                $thumbnailFileName = basename($thumbnailPath);
                // Move the video file
                if (Storage::disk('public')->exists(str_replace(env('APP_URL') . '/api/images/', '', $filePath))) {
                    Storage::disk('public')->move(
                        str_replace(env('APP_URL') . '/api/images/', '', $filePath),
                        $permanentVideoFolder . $videoFileName
                    );
                    $filePath = env('APP_URL') . '/api/images/' . $permanentVideoFolder . $videoFileName;
                }
                // Move the thumbnail file
                if (Storage::disk('public')->exists(str_replace(env('APP_URL') . '/api/images/', '', $thumbnailPath))) {
                    Storage::disk('public')->move(
                        str_replace(env('APP_URL') . '/api/images/', '', $thumbnailPath),
                        $permanentThumbnailFolder . $thumbnailFileName
                    );
                    $thumbnailPath = env('APP_URL') . '/api/images/' . $permanentThumbnailFolder . $thumbnailFileName;
                }
                // ✅ **Remove all other files in the temp folder**
                $allTempFiles = Storage::disk('public')->files($tempFolder);
                foreach ($allTempFiles as $tempFile) {
                    if (basename($tempFile) !== $videoFileName) {
                        Storage::disk('public')->delete($tempFile);
                    }
                }
                $allTempThumbnails = Storage::disk('public')->files($tempThumbnailFolder);
                foreach ($allTempThumbnails as $tempThumbnail) {
                    if (basename($tempThumbnail) !== $thumbnailFileName) {
                        Storage::disk('public')->delete($tempThumbnail);
                    }
                }

                // ✅ Convert tags to array
                $tagsArray = array_map('trim', explode(',', $request->tags ?? ''));

                try {
                    // ✅ Save to Database
                    $video = M_Videos::create([
                        'user_id' => $userId,
                        'title' => $request->title,
                        'description' => $request->description,
                        'file_path' => $filePath,
                        'category_id' => (int) $request->category_id,
                        'type' => (int) $request->type,
                        'title_size' => $request->title_size,
                        'title_colour' => $request->title_colour,
                        'defaultthumbnail' => $thumbnailPath,
                        'country_code' => (int) $request->country_code,
                        'video_type' => $videoType,
                        'tags' => json_encode($tagsArray),
                        'temp_upload' => false,
                    ]);

                    Log::info('Video/photo metadata saved', ['video_id' => $video->id]);

                    return response()->json([
                        'result' => true,
                        'message' => 'File(s) uploaded successfully',
                        'video_id' => $video->id, // ✅ Return video_id
                    ], 201);
                } catch (\Exception $e) {
                    Log::error('Database Error: ' . $e->getMessage());
                    return response()->json([
                        'result' => false,
                        'message' => 'Database error: ' . $e->getMessage(),
                    ], 500);
                }
            }
        }

        // If request is invalid
        return response()->json([
            'result' => false,
            'message' => 'Invalid request',
        ], 422);
    }

    public function generateThumbnails($filePath, $uniqueFileName) 
    {
        try {
            $ffmpeg = FFMpeg::create();
            $video = $ffmpeg->open($filePath);
            $thumbnails = [];
            $timestamps = [1, 5, 10, 15]; // Capture at 1s, 5s, 10s, 15s

            // Define the storage path
            $thumbnailFolder = 'uploads/videos/temp/thumbnails/';
            Storage::disk('public')->makeDirectory($thumbnailFolder); // Ensure folder exists

            $duration = $ffprobe->format($filePath)->get('duration');
            for ($i = 1; $i <= 4; $i++) {
                $timestamp = round(($i * $duration) / 5); // Capture at different positions
                $thumbnailFileName = pathinfo($uniqueFileName, PATHINFO_FILENAME) . "-$timestamp.jpg";
                $thumbnailPath = $thumbnailFolder . $thumbnailFileName;
                $media->frame(TimeCode::fromSeconds($timestamp))
                    ->save(Storage::disk('public')->path($thumbnailPath));

                $thumbnails[] = env('APP_URL') . '/api/images/' . $thumbnailPath;
            }
            return $thumbnails;
        } catch (\Exception $e) {
            Log::error('Thumbnail generation failed: ' . $e->getMessage());
            return [];
        }
    }
    
    public function index(Request $request, $category_id = null)
    {
        // Build the query
        $query = DB::table('m_videos')
        ->join('users', 'm_videos.user_id', '=', 'users.id')
        ->join('m_videocategory', 'm_videos.category_id', '=', 'm_videocategory.category_id')
        ->select('m_videos.*', 'm_videocategory.category_name as category_name', 
                        'users.username as username', 'users.profile_image as profile_image');
    
        // Apply category filter if category_id is provided
        if (!is_null($category_id)) {
            $query->where('m_videocategory.category_id', $category_id);
        }
        // Public videos only
        $query->where('m_videos.type', '=', 'Public');
    
        // Fetch videos
        $videos = $query->get();
        // Check if videos exist
        if ($videos->isEmpty()) {
            return response()->json([
                'result' => false,
                'message' => 'No videos found',
            ], 404);
        }
    
        // Format video data
        $formattedVideos = $videos->map(function ($video) {
            $videoInteraction = M_Videos::withCount(['likes', 'dislikes', 'views'])->findOrFail($video->id);
            return [
                'video_id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'file_path' => $video->file_path ? url('/api/images/' . $video->file_path) : null,
                'likes' => $videoInteraction->likes_count,
                'dislikes' => $videoInteraction->dislikes_count,
                'views' => $videoInteraction->views_count,
                'user_id' => $video->user_id,
                'user_name' => $video->username,
                'user_profile_image' => env('APP_URL') . '/api/images/' . $video->profile_image,
                'type' => $video->type,
                'category_id' => $video->category_id,
                'category_name' => $video->category_name,
                'title_size' => $video->title_size,
                'title_colour' => $video->title_colour,
                'defaultthumbnail' => $video->defaultthumbnail,
                'country_code' => $video->country_code,
                'tags' => is_string($video->tags) ? json_decode($video->tags, true) ?? [] : $video->tags,
                'video_type' => $video->video_type, // Added this
                'uploaded_datetime' => optional($video->updated_at)->toDateTimeString(),
            ];
        });
    
        // Return response
        return response()->json([
            'result' => true,
            'message' => 'Videos fetched successfully',
            'data' => $formattedVideos,
        ], 200);
    }    

    public function show($id)
    {
        // Find the video by its ID or fail if not found
        $video = M_Videos::find($id);
    
        if (!$video) {
            return response()->json([
                'result' => false,
                'message' => 'Video not found'
            ], 404); // 404 Not Found
        }
        //
        $subscribers = M_Video_Subscription::where('creator_id', $video->user_id)
                                ->get(['subscriber_id']);
        $subscribersCnt = $subscribers->count();
        //
        $videoInteraction = M_Videos::withCount(['likes', 'dislikes', 'views'])->findOrFail($video->id);
        $likedUsers = M_Video_Interactions::where('video_id', $video->id)->where('type', 'like')->get(['user_id as video_liked_user_id']);
        // Return the video details with proper URLs
        return response()->json([
            'result' => true,
            'message' => 'Video fetched successfully',
            'data' => [
                'video_id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'file_path' => env('APP_URL') . '/api/images/' . $video->file_path, // Full URL for the video file
                'user_id' => $video->user_id,
                'user_name' => $video->username,
                'user_profile_image' => env('APP_URL') . '/api/images/' . $video->profile_image,
                'subscribers_user_id' => $subscribers,
                'subscribers_cnt' => $subscribersCnt,
                'likes_count' => $videoInteraction->likes_count,
                'liked_user_id' => $likedUsers,
                'category_id' => $video->category_id,
                'type' => $video->type,
                'title_size' => $video->title_size,
                'title_colour' => $video->title_colour,
                'defaultthumbnail' => $video->defaultthumbnail 
                    ? env('APP_URL') . '/api/images/' . $video->defaultthumbnail // Full URL for the thumbnail
                    : null,
                'country_code' => $video->country_code,
                'tags' => is_string($video->tags) ? json_decode($video->tags, true) : $video->tags,
                'video_type' => $video->video_type, // Added this
                'created_at' => $video->created_at,
                'updated_at' => $video->updated_at,
            ]
        ]);
    }
    
    
    public function delete($id)
    {
        // Find the video by ID or return a 404 if not found
        $video = M_Videos::find($id);
    
        if (!$video) {
            return response()->json([
                'result' => false,
                'message' => 'Video not found'
            ], 404); // 404 Not Found
        }
    
        // Delete the video
        $video->delete();
    
        return response()->json([
            'result' => true,
            'message' => 'Video deleted successfully',
            'video_id' =>$id
        ]);
    }

    public function search(Request $request, $searchString)
    {
        // Validate the search query input
        if (empty($searchString)) {
            return response()->json([
                'result' => false,
                'message' => 'Search query cannot be empty'
            ], 400); // 400 Bad Request
        }
        
        // Build the query
        $query = DB::table('m_videos')
        ->join('users', 'm_videos.user_id', '=', 'users.id')
        ->join('m_videocategory', 'm_videos.category_id', '=', 'm_videocategory.category_id')
        ->select('m_videos.*', 'm_videocategory.category_name as category_name', 
                        'users.username as username', 'users.profile_image as profile_image');
    
        // Public videos only
        $query->where('m_videos.type', '=', 'Public')
                ->whereRaw('LOWER(m_videos.title) LIKE ?', ['%' . strtolower($searchString) . '%'])
                ->orWhereRaw('LOWER(m_videos.description) LIKE ?', ['%' . strtolower($searchString) . '%']);
    
        // Fetch videos
        $videos = $query->get();
        // Check if videos exist
        if ($videos->isEmpty()) {
            return response()->json([
                'result' => false,
                'message' => 'No videos found',
            ], 404);
        }
    
        // Format video data
        $formattedVideos = $videos->map(function ($video) {
            $videoInteraction = M_Videos::withCount(['likes', 'dislikes', 'views'])->findOrFail($video->id);
            return [
                'video_id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'file_path' => $video->file_path ? url('/api/images/' . $video->file_path) : null,
                'likes' => $videoInteraction->likes_count,
                'dislikes' => $videoInteraction->dislikes_count,
                'views' => $videoInteraction->views_count,
                'user_id' => $video->user_id,
                'user_name' => $video->username,
                'user_profile_image' => env('APP_URL') . '/api/images/' . $video->profile_image,
                'type' => $video->type,
                'category_id' => $video->category_id,
                'category_name' => $video->category_name,
                'title_size' => $video->title_size,
                'title_colour' => $video->title_colour,
                'defaultthumbnail' => $video->defaultthumbnail,
                'country_code' => $video->country_code,
                'tags' => is_string($video->tags) ? json_decode($video->tags, true) ?? [] : $video->tags,
                'video_type' => $video->video_type, // Added this
                'uploaded_datetime' => optional($video->updated_at)->toDateTimeString(),
            ];
        });
    
        // Return response
        return response()->json([
            'result' => true,
            'message' => 'Videos fetched successfully',
            'data' => $formattedVideos,
        ], 200);

    }
    
    public function update(Request $request, $id)
    {
        $video = M_Videos::findOrFail($id);
        $video->update($request->only('title', 'description'));
        return response()->json($video);
    }

    public function destroy($id)
    {
        $video = M_Videos::findOrFail($id);
        Storage::disk('public')->delete($video->file_path);
        $video->delete();

        return response()->json(['message' => 'Video deleted successfully.']);
    }

}
