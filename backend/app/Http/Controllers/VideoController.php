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
        Log::info('Video upload request received', ['request' => $request->all()]);
    
        // Step 1: Upload video temporarily and generate thumbnails
        if ($request->hasFile('video_file') && filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN)) {
            $validator = Validator::make($request->all(), [
                'video_file' => 'required|file|mimes:mp4,mp3,mov,avi,mkv,jpeg,png,jpg,gif',
            ]);
        
            if ($validator->fails()) {
                return response()->json([
                    'result' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }
        
            $file = $request->file('video_file');
            $userId = $request->user()->id;
            $tempFolder = 'uploads/videos/temp';
            $uniqueFileName = uniqid() . '.' . $file->getClientOriginalExtension();
            $mediaPath = $file->storeAs($tempFolder, $uniqueFileName, 'public');
            $videoPath = Storage::disk('public')->path($mediaPath);
            $filePath = env('APP_URL') . '/api/images/' . $mediaPath;
        
            // **Detect the file type and assign numerical values**
            $mimeType = $file->getMimeType();
            if (str_starts_with($mimeType, 'video/')) {
                $fileType = 1; // Video
            } elseif (str_starts_with($mimeType, 'audio/')) {
                $fileType = 2; // Audio
            } elseif (str_starts_with($mimeType, 'image/')) {
                $fileType = 3; // Photo
            } else {
                $fileType = 4; // Webcam (assuming default unknown type as webcam)
            }
        
            // Generate thumbnails
            $thumbnails = $this->generateThumbnails($videoPath, $uniqueFileName);
        
            Log::info('Video uploaded to temporary storage', ['file_path' => $filePath]);
            Log::info('Generated Thumbnails', ['thumbnails' => $thumbnails]);
        
            return response()->json([
                'result' => true,
                'message' => 'File uploaded successfully',
                'file_path' => $filePath,
                'video_type' => $fileType, // ✅ Assign numerical file type
                'thumbnails' => $thumbnails,
            ], 201);
        }        
           
        // Step 2: Process permanent storage for video
        if ($request->has('file_path') && $request->has('title') && !filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN)) {
            Log::info('Processing permanent storage for video', ['temp_upload' => $request->temp_upload]);
        
            $filePath = $request->file_path;
            $userId = $request->user()->id;
            $permanentFolder = 'uploads/videos/permanent';
            $tempFolder = 'uploads/videos/temp';
        
            // Extract relative file path
            $relativeFilePath = str_replace(env('APP_URL') . '/api/images/', '', $filePath);
        
            // Check if file exists in temp storage
            if (!Storage::disk('public')->exists($relativeFilePath)) {
                return response()->json([
                    'result' => false,
                    'message' => 'Video file not found in temporary storage',
                ], 404);
            }
        
            // Ensure directories exist
            if (!Storage::disk('public')->exists($tempFolder)) {
                Storage::disk('public')->makeDirectory($tempFolder);
            }
            if (!Storage::disk('public')->exists($permanentFolder)) {
                Storage::disk('public')->makeDirectory($permanentFolder);
            }
        
            // Move file to permanent storage
            $fileName = basename($relativeFilePath);
            $newFilePath = $permanentFolder . '/' . $fileName;
            Storage::disk('public')->move($relativeFilePath, $newFilePath);
        
            // Delete the file from temp storage after moving
            Storage::disk('public')->delete($relativeFilePath);
        
            // **Detect file type and assign `video_type`**
            $extension = pathinfo($fileName, PATHINFO_EXTENSION);
            if (in_array($extension, ['mp4', 'mkv', 'avi', 'mov'])) {
                $videoType = 1; // Video
            } elseif (in_array($extension, ['mp3', 'wav', 'm4a'])) {
                $videoType = 2; // Audio
            } elseif (in_array($extension, ['jpeg', 'png', 'jpg', 'gif'])) {
                $videoType = 3; // Photo
            } else {
                $videoType = 4; // Webcam (Default)
            }
        
            // Check if thumbnail is provided
            $defaultThumbnailPath = $request->defaultthumbnail ?? null;
            if ($request->hasFile('defaultthumbnail')) {
                $thumbnail = $request->file('defaultthumbnail');
                $thumbnailName = time() . '_' . uniqid() . '.' . $thumbnail->getClientOriginalExtension();
                $thumbnailPath = 'uploads/videos/thumbnails/' . $thumbnailName;
            
                // Move the thumbnail to the correct storage
                $thumbnail->move(public_path('uploads/videos/thumbnails/'), $thumbnailName);
            
                // Generate the correct URL
                $defaultThumbnailPath = env('APP_URL') . '/' . $thumbnailPath;
            } elseif ($request->defaultthumbnail && filter_var($request->defaultthumbnail, FILTER_VALIDATE_URL)) {
                // If the thumbnail is already a valid URL, use it directly
                $defaultThumbnailPath = $request->defaultthumbnail;
            } else {
                return response()->json([
                    'result' => false,
                    'message' => 'Valid thumbnail is required.',
                ], 400);
            }
        
            // Convert tags to array
            $tagsArray = array_map('trim', explode(',', $request->tags ?? ''));
        
            try {
                $video = M_Videos::create([
                    'user_id' => $userId,
                    'title' => $request->title,
                    'description' => $request->description,
                    'file_path' => $newFilePath,
                    'category_id' => $request->category_id,
                    'type' => $request->type,
                    'title_size' => $request->title_size,
                    'title_colour' => $request->title_colour,
                    'defaultthumbnail' => $defaultThumbnailPath,
                    'country_code' => $request->country_code,
                    'video_type' => $videoType, // ✅ Save `video_type`
                    'tags' => json_encode($tagsArray),
                    'temp_upload' => false,
                ]);
        
                Log::info('Video metadata saved', ['video_id' => $video->id]);
        
                return response()->json([
                    'result' => true,
                    'message' => 'Video uploaded successfully',
                    'video_id' => $video->id,
                ], 201);
            } catch (\Exception $e) {
                Log::error('Database Error: ' . $e->getMessage());
                return response()->json([
                    'result' => false,
                    'message' => 'Database error: ' . $e->getMessage(),
                ], 500);
            }
        }        
        
        return response()->json([
            'result' => false,
            'message' => 'Invalid request',
        ], 422);
    }
       
    public function generateThumbnails($filePath, $uniqueFileName)
    {
        try {
            // Initialize FFMpeg and FFProbe
            $ffmpeg = FFMpeg::create();
            $ffprobe = FFProbe::create();
    
            // Check the file type
            $extension = pathinfo($filePath, PATHINFO_EXTENSION);
            $thumbnailFolder = 'uploads/thumbnails';
    
            if (!Storage::disk('public')->exists($thumbnailFolder)) {
                Storage::disk('public')->makeDirectory($thumbnailFolder);
            }
    
            $thumbnails = [];
    
            if (in_array($extension, ['mp4', 'avi', 'mov', 'mkv'])) {
                // 📌 Generate 4 thumbnails for videos
                $media = $ffmpeg->open($filePath);
                $videoStreams = $ffprobe->streams($filePath)->videos();
                $isVideo = $videoStreams->count() > 0;
    
                if ($isVideo) {
                    $duration = $ffprobe->format($filePath)->get('duration');
    
                    for ($i = 1; $i <= 4; $i++) {
                        $timestamp = round(($i * $duration) / 5); // Capture at different positions
                        $thumbnailFileName = $uniqueFileName . "-video-$i.jpg";
                        $thumbnailPath = $thumbnailFolder . '/' . $thumbnailFileName;
    
                        $media->frame(TimeCode::fromSeconds($timestamp))
                            ->save(Storage::disk('public')->path($thumbnailPath));
    
                        $thumbnails[] = env('APP_URL') . '/api/images/' . $thumbnailPath;
                    }
                }
            } elseif (in_array($extension, ['mp3', 'wav', 'ogg'])) {
                // 📌 Use default audio thumbnail but rename it
                $defaultAudioThumbnail = public_path('/img/Audioicon.jpeg');
                $thumbnailFileName = $uniqueFileName . '-audio.jpg';
                $thumbnailPath = $thumbnailFolder . '/' . $thumbnailFileName;
    
                if (file_exists($defaultAudioThumbnail)) {
                    Storage::disk('public')->put($thumbnailPath, file_get_contents($defaultAudioThumbnail));
                    $thumbnails[] = env('APP_URL') . '/api/images/' . $thumbnailPath;
                } else {
                    Log::error('Default audio thumbnail not found: ' . $defaultAudioThumbnail);
                    return ['error' => 'Default audio thumbnail not found'];
                }
            } elseif (in_array($extension, ['png', 'jpg', 'jpeg', 'gif'])) {
                // 📌 Directly use the image as a thumbnail
                $thumbnailFileName = $uniqueFileName . '-photo.jpg';
                $thumbnailPath = $thumbnailFolder . '/' . $thumbnailFileName;
    
                Storage::disk('public')->put($thumbnailPath, file_get_contents($filePath));
                $thumbnails[] = env('APP_URL') . '/api/images/' . $thumbnailPath;
            } else {
                Log::error('Unsupported file format: ' . $extension);
                return ['error' => 'Unsupported file format'];
            }
    
            return $thumbnails;
        } catch (\Exception $e) {
            Log::error('Thumbnail generation failed: ' . $e->getMessage());
            return ['error' => $e->getMessage()];
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
        $videos = $query->latest()->get();
        // Check if videos exist
        if ($videos->isEmpty()) {
            return response()->json([
                'result' => false,
                'message' => 'No videos foundssss',
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
                'uploaded_datetime' => $video->updated_at,
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
        $video = M_Videos::join('users', 'm_videos.user_id', '=', 'users.id')
                        ->select('m_videos.*', 'users.username as username', 'users.profile_image as profile_image')
                        ->where('m_videos.id', '=', $id)
                        ->where('m_videos.type', '=', 'Public')
                        ->first();
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
                'uploaded_datetime' => $video->updated_at,
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
