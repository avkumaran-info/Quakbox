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
               // Step 1: Upload video temporarily and generate thumbnails if temp_upload is true
        if ($request->hasFile('video_file') && filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN)) {
            // Validate the video file
            $validator = Validator::make($request->all(), [
                'video_file' => 'required|file|mimes:mp4,mov|max:20480', // Max 20MB
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'result' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Handle video file upload
            $file = $request->file('video_file');
            $userId = $request->user()->id;
            $tempFolder = 'uploads/videos/' . $userId . '/temp';
            $mediaPath = $file->store($tempFolder, 'public');

            // Generate thumbnails (for internal use, not saving all to DB)
            $filePath = storage_path('app/public/' . $mediaPath);
            $thumbnails = $this->generateThumbnails($filePath);

            // Return response with video and thumbnail info (correct URL format)
            return response()->json([
                'result' => true,
                'message' => 'Video uploaded successfully',
                'file_path' => url('storage/' . $mediaPath), // Use the full URL
                'thumbnails' => array_map(function ($thumbnail) {
                    return ($thumbnail); // Use the full URL for each thumbnail
                }, $thumbnails),
            ], 201);
        }

        // Log the incoming request data for debugging
        Log::info('Video upload request received', ['request' => $request->all()]);

        // Step 2: Move video to permanent storage and store metadata if temp_upload is false
        if ($request->has('file_path') && $request->has('title') && $request->has('description') && filter_var($request->temp_upload, FILTER_VALIDATE_BOOLEAN) === false) {

            // Log the validation of temp_upload value
            Log::info('temp_upload value: ', ['temp_upload' => $request->temp_upload]);
        
            // Get the full URL file path and extract the relative path
            $filePath = $request->file_path;
            $relativeFilePath = str_replace(url('storage'), '', $filePath); // Remove the base URL
            Log::info('Relative File Path: ' . $relativeFilePath);
        
            // Validate that the video exists in temporary storage
            $userId = $request->user()->id;
            $permanentFolder = 'uploads/videos/' . $userId . '/permanent';
        
            // Ensure the video exists
            Log::info('Checking file existence at: ' . $relativeFilePath);
            if (!Storage::disk('public')->exists($relativeFilePath)) {
                return response()->json([
                    'result' => false,
                    'message' => 'Video file not found in temporary storage',
                ], 404);
            }
        
            // Create the permanent folder if it doesn't exist
            Log::info('Creating permanent folder: ' . $permanentFolder);
            if (!Storage::disk('public')->exists($permanentFolder)) {
                Storage::disk('public')->makeDirectory($permanentFolder);
            }
        
            // Move video from temporary to permanent storage
            $fileName = basename($relativeFilePath);
            $newFilePath = $permanentFolder . '/' . $fileName;
            Log::info('Old File Path: ' . $relativeFilePath);
            Log::info('New File Path: ' . $newFilePath);
            Storage::disk('public')->move($relativeFilePath, $newFilePath);
        
            // Delete temporary folder and its contents
            $tempFolder = 'uploads/videos/' . $userId . '/temp';
            Log::info('Deleting temp folder: ' . $tempFolder);
            Storage::disk('public')->deleteDirectory($tempFolder);
        
            // Handle the default thumbnail upload or use generated one
            $defaultThumbnailPath = null;
        
            // Check if thumbnail path is provided
            if ($request->has('defaultthumbnail')) {
                // If default thumbnail is passed as a full URL, extract relative path
                if (filter_var($request->defaultthumbnail, FILTER_VALIDATE_URL)) {
                    $defaultThumbnailPath = str_replace(url('storage'), '', $request->defaultthumbnail); // Extract relative path from URL
                } else {
                    $defaultThumbnailPath = $request->defaultthumbnail; // Assuming it's a relative path
                }
                Log::info('Default Thumbnail Path: ' . $defaultThumbnailPath);
            } else {
                return response()->json([
                    'result' => false,
                    'message' => 'Thumbnail is required.',
                ], 400);
            }
        
            // Log the video metadata before saving
            Log::info('Video Metadata:', [
                'user_id' => $userId,
                'title' => $request->title,
                'description' => $request->description,
                'file_path' => url('storage/',$newFilePath),
                'category_id' => $request->category_id,
                'type' => $request->type,
                'title_size' => $request->title_size,
                'title_colour' => $request->title_colour,
                'defaultthumbnail' => url('storage/', $defaultThumbnailPath),
                'country_code' => $request->country_code,
                'tags' => $request->tags,
                'temp_upload' => false,
            ]);
        
            try {
                // Save the video metadata
                $video = M_Videos::create([
                    'user_id' => $userId,
                    'title' => $request->title,
                    'description' => $request->description,
                    'file_path' => url('storage/',$newFilePath), // Store the relative URL path in DB
                    'category_id' => $request->category_id,
                    'type' => $request->type,
                    'title_size' => $request->title_size,
                    'title_colour' => $request->title_colour,
                    'defaultthumbnail' =>url('storage/', $defaultThumbnailPath), // Store the relative URL path in DB
                    'country_code' => $request->country_code,
                    'tags' => $request->tags,
                    'temp_upload' => false, // Mark as permanent upload
                ]);
        
                // Log the successful video save
                Log::info('Video metadata saved: ' . $video->id);
        
                // Return successful response
                return response()->json([
                    'result' => true,
                    'message' => 'Video uploaded successfully',
                    'video_id' => $video->id,
                ], 201);
            } catch (\Exception $e) {
                // Log any database or other errors
                Log::error('Database Error: ' . $e->getMessage());
                return response()->json([
                    'result' => false,
                    'message' => 'Database error: ' . $e->getMessage(),
                ], 500);
            }
        }
        
        // If neither condition is met, return invalid request error
        return response()->json([
            'result' => false,
            'message' => 'Invalid request',
        ], 422);
    }

    private function generateThumbnails($filePath)
    {
        try {
            $ffmpeg = FFMpeg::create();
            $video = $ffmpeg->open($filePath);

            $thumbnails = [];
            $timestamps = [1, 5, 10, 15]; // Generate thumbnails at 1, 5, 10, and 15 seconds

            // Check if the thumbnail folder exists
            $thumbnailFolder = storage_path('app/public/uploads/thumbnails');
            if (!file_exists($thumbnailFolder)) {
                mkdir($thumbnailFolder, 0775, true);
            }

            foreach ($timestamps as $timestamp) {
                $thumbnailPath = 'uploads/thumbnails/' . basename($filePath) . '-' . $timestamp . '.jpg';
                $video->frame(TimeCode::fromSeconds($timestamp))
                      ->save(public_path('storage/' . $thumbnailPath));

                // Add the full URL to the array
                // $thumbnails[] = url('storage/' . $thumbnailPath); // Ensure this is the correct URL format
                $thumbnails[] = env('APP_URL') . '/api/images/' . $thumbnailPath; // Ensure this is the correct URL format
                
            }

            return $thumbnails;
        } catch (\Exception $e) {
            // Log the error
            Log::error('Thumbnail generation failed: ' . $e->getMessage());

            // Return empty array or an error response as needed
            return [];
        }
    }
    
    public function index(Request $request, $category_id = null)
    {
        // Query the videos
        $query = M_Videos::query();
    
        // Apply category filter if category_id is provided
        if ($category_id) {
            $query->where('category_id', $category_id);
        }
    
        // Fetch videos with category relationship
        $videos = $query->with('category')->get();
    
        // If no videos found
        if ($videos->isEmpty()) {
            return response()->json([
                'result' => false,
                'message' => 'No videos found' . ($category_id ? ' for this category' : ''),
            ], 404);
        }
    
        // Return formatted video data
        return response()->json([
            'result' => true,
            'message' => 'Videos fetched successfully',
            'data' => $videos->map(function ($video) {
                return [
                    'video_id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'file_path' => url('storage/' . $video->file_path),
                    'user_id' => $video->user_id,
                    'category' => $video->category ? [
                        'id' => $video->category->category_id,
                        'name' => $video->category->category_name, // Ensure correct column name
                    ] : null,
                    'type' => $video->type,
                    'title_size' => $video->title_size,
                    'title_colour' => $video->title_colour,
                    'defaultthumbnail' => $video->defaultthumbnail ? url('storage/' . $video->defaultthumbnail) : null,
                    'country_code' => $video->country_code,
                    'created_at' => $video->created_at,
                    'updated_at' => $video->updated_at,
                ];
            }),
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
    
        // Return the video details with proper paths
        return response()->json([
            'result' => true,
            'message' => 'Video fetched successfully',
            'data' => [
                'video_id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'file_path' => url('storage/' . $video->file_path), // Fixed File Path
                'user_id' => $video->user_id,
                'category_id' => $video->category_id,
                'type' => $video->type,
                'title_size' => $video->title_size,
                'title_colour' => $video->title_colour,
                'defaultthumbnail' => $video->defaultthumbnail ? url('storage/' . $video->defaultthumbnail) : null,
                'country_code' => $video->country_code,
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
                    'category_id' => $video->category_id,
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
        $video = M_video::findOrFail($id);
        $video->update($request->only('title', 'description'));
        return response()->json($video);
    }

    public function destroy($id)
    {
        $video = M_video::findOrFail($id);
        Storage::disk('public')->delete($video->file_path);
        $video->delete();

        return response()->json(['message' => 'Video deleted successfully.']);
    }

}
