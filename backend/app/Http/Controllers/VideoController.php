<?php

namespace App\Http\Controllers;

ini_set('memory_limit', '2G');
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\M_Videos;
use FFMpeg\FFMpeg;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use FFMpeg\Coordinate\TimeCode;

class VideoController extends Controller
{
    public function videoUpload(Request $request)
    {
        Log::info('Video upload request received', ['request' => $request->all()]);
    
        // Step 1: Upload video temporarily and generate thumbnails
        if ($request->hasFile('video_file') && filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN)) {
            $validator = Validator::make($request->all(), [
                'video_file' => 'required|file|mimes:mp4,mov',
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
    
            // Generate thumbnails and save them in the correct path
            $thumbnails = $this->generateThumbnails($videoPath, $uniqueFileName);
    
            Log::info('Video uploaded to temporary storage', ['file_path' => $filePath]);
            Log::info('Generated Thumbnails', ['thumbnails' => $thumbnails]);
    
            return response()->json([
                'result' => true,
                'message' => 'Video uploaded successfully',
                'file_path' => $filePath,
                'thumbnails' => $thumbnails,
            ], 201);
        }
    
        // Step 2: Move video to permanent storage
        if ($request->has('file_path') && $request->has('title') && filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN) === false) {
            Log::info('Processing permanent storage for video', ['temp_upload' => $request->temp_upload]);
    
            $filePath = $request->file_path;
            $userId = $request->user()->id;
            $permanentFolder = 'uploads/videos/permanent';
    
            if (!Storage::disk('public')->exists($filePath)) {
                return response()->json([
                    'result' => false,
                    'message' => 'Video file not found in temporary storage',
                ], 404);
            }
    
            if (!Storage::disk('public')->exists($permanentFolder)) {
                Storage::disk('public')->makeDirectory($permanentFolder);
            }
    
            $fileName = basename($filePath);
            $newFilePath = $permanentFolder . '/' . $fileName;
            Storage::disk('public')->move($filePath, $newFilePath);
            Storage::disk('public')->deleteDirectory('uploads/videos/temp');
    
            $defaultThumbnailPath = $request->has('defaultthumbnail') ? $request->defaultthumbnail : null;
            if (!$defaultThumbnailPath) {
                return response()->json([
                    'result' => false,
                    'message' => 'Thumbnail is required.',
                ], 400);
            }
    
            $tags = is_array($request->tags) ? implode(',', $request->tags) : $request->tags;
            $tagsArray = array_map('trim', explode(',', $tags));
    
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
    
    private function generateThumbnails($filePath, $uniqueFileName)
    {
        try {
            $ffmpeg = FFMpeg::create();
            $video = $ffmpeg->open($filePath);
            $thumbnails = [];
            $timestamps = [1, 5, 10, 15]; // Define timestamps for multiple thumbnails
            $thumbnailFolder = 'uploads/thumbnails';  // Store thumbnails in a folder
    
    
            // Ensure thumbnail folder exists
            if (!file_exists(storage_path($thumbnailFolder))) {
                mkdir(storage_path($thumbnailFolder), 0775, true);
            }
    
            // Generate thumbnails for the defined timestamps
            foreach ($timestamps as $timestamp) {
                // Use a unique filename format for the thumbnail
                $thumbnailFileName = $uniqueFileName . '-' . $timestamp . '.jpg'; // Example: 'uniqueFileName-5.jpg'
                $thumbnailPath = $thumbnailFolder . '/' . $thumbnailFileName;
    
                // Generate the thumbnail at the specified timestamp and save it
                $video->frame(TimeCode::fromSeconds($timestamp))
                    ->save(storage_path($thumbnailPath));
    
                // Save the relative path of the generated thumbnail (this will match the format you want)
                $thumbnails[] =  env('APP_URL') . '/api/images/' . $thumbnailPath;
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
        $query = M_Videos::with('category');
    
        // Apply category filter if category_id is provided
        if (!is_null($category_id)) {
            $query->where('category_id', $category_id);
        }
    
        // Fetch videos
        $videos = $query->get();
    
        // Check if videos exist
        if ($videos->isEmpty()) {
            return response()->json([
                'result' => false,
                'message' => 'No videos found' . ($category_id ? ' for this category' : ''),
            ], 404);
        }
    
        // Format video data
        $formattedVideos = $videos->map(function ($video) {
            return [
                'video_id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'file_path' => $video->file_path ? env('APP_URL') . '/api/images/' . $video->file_path : null, // Full URL for the video file
                'user_id' => $video->user_id,
                'category' => $video->category ? [
                    'id' => $video->category->id, // Assuming `id` is the correct column name
                    'name' => $video->category->name, // Assuming `name` is the correct column name
                ] : null,
                'type' => $video->type,
                'title_size' => $video->title_size,
                'title_colour' => $video->title_colour,
                'defaultthumbnail' => $video->defaultthumbnail ? env('APP_URL') . '/api/images/' . $video->defaultthumbnail : null, // Full URL for the thumbnail
                'country_code' => $video->country_code,
                'tags' => is_string($video->tags) ? json_decode($video->tags, true) : $video->tags,
                'created_at' => $video->created_at->toDateTimeString(),
                'updated_at' => $video->updated_at->toDateTimeString(),
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
                'category_id' => $video->category_id,
                'type' => $video->type,
                'title_size' => $video->title_size,
                'title_colour' => $video->title_colour,
                'defaultthumbnail' => $video->defaultthumbnail 
                    ? env('APP_URL') . '/api/images/' . $video->defaultthumbnail // Full URL for the thumbnail
                    : null,
                'country_code' => $video->country_code,
                'tags' => is_string($video->tags) ? json_decode($video->tags, true) : $video->tags,
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

    public function search(Request $request, $query)
    {
        // Validate the search query input
        if (empty($query)) {
            return response()->json([
                'result' => false,
                'message' => 'Search query cannot be empty'
            ], 400); // 400 Bad Request
        }
    
        // Search the videos by title or description (case insensitive)
        $videos = M_Videos::whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($query) . '%'])
                          ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($query) . '%'])
                          ->get();
    
        // If no videos are found, return a 404 response
        if ($videos->isEmpty()) {
            return response()->json([
                'result' => false,
                'message' => 'No videos found matching the search criteria'
            ], 404); // 404 Not Found
        }
    
        // Return the found videos
        return response()->json([
            'result' => true,
            'message' => 'Videos fetched successfully',
            'query' => $query, // Showing the search query
            'videos_count' => $videos->count(), // Showing the count of videos found
            'data' => $videos->map(function ($video) {
                return [
                    'video_id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'file_path' => url('storage/' . $video->file_path), // Full URL for file_path
                    'user_id' => $video->user_id,
                    'category_id' => $video->category_name,
                    'type' => $video->type,
                    'title_size' => $video->title_size,
                    'title_colour' => $video->title_colour,
                    'defaultthumbnail' => $video->defaultthumbnail ? url('storage/' . $video->defaultthumbnail) : null,
                    'country_code' => $video->country_code,
                    'created_at' => $video->created_at,
                    'updated_at' => $video->updated_at,
                ];
            })
        ]);
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
