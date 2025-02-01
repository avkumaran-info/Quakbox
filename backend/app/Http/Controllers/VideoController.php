<?php

namespace App\Http\Controllers;

ini_set('memory_limit', '2G');
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\M_Videos;
use FFMpeg\FFMpeg;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use FFMpeg\Coordinate\TimeCode;

class VideoController extends Controller
{
    public function videoUpload(Request $request)
    {
        // Step 1: Upload video temporarily and generate thumbnails
        if ($request->hasFile('video_file') && $request->temp_upload == true) {
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
    
            // Return response with video and thumbnail info (without storing all thumbnails)
            return response()->json([
                'result' => true,
                'message' => 'Video uploaded successfully',
                'file_path' => url('storage/' . $mediaPath), // Return file path instead of video_id
                'thumbnails' => $thumbnails, // Return the generated thumbnails (correct URL)
            ], 201);
        }
    
        // Step 2: Move video to permanent storage and store metadata
        if ($request->has('file_path') && $request->has('title') && $request->has('description') && $request->temp_upload == false) {
            // Get video path and validate the temporary video storage
            $filePath = $request->file_path;
            $userId = $request->user()->id;
            $permanentFolder = 'uploads/videos/' . $userId . '/permanent';
    
            // Ensure video exists in temporary storage
            if (!Storage::disk('public')->exists($filePath)) {
                return response()->json([
                    'result' => false,
                    'message' => 'Video file not found in temporary storage',
                ], 404);
            }
    
            // Create the permanent folder if it doesn't exist
            if (!Storage::disk('public')->exists($permanentFolder)) {
                Storage::disk('public')->makeDirectory($permanentFolder);
            }
    
            // Move video from temporary to permanent storage
            $fileName = basename($filePath);
            $newFilePath = $permanentFolder . '/' . $fileName;
            Storage::disk('public')->move($filePath, $newFilePath);
    
            // Delete temporary folder and its contents
            $tempFolder = 'uploads/videos/' . $userId . '/temp';
            Storage::disk('public')->deleteDirectory($tempFolder);
    
            // Handle the default thumbnail upload or use generated one
            $defaultThumbnailPath = $request->hasFile('defaultthumbnail') 
                ? $request->file('defaultthumbnail')->store('uploads/thumbnails', 'public')
                : $request->defaultthumbnail;
    
            // Store the video metadata in the database, only saving the defaultthumbnail
            $video = M_Videos::create([
                'user_id' => $userId,
                'title' => $request->title,
                'description' => $request->description,
                'file_path' => url('storage/' . $newFilePath),
                'category_id' => $request->category_id,
                'type' => $request->type,
                'title_size' => $request->title_size,
                'title_colour' => $request->title_colour,
                'defaultthumbnail' => url('storage/' . $defaultThumbnailPath),
                'country_code' => $request->country_code,
                'temp_upload' => false, // Mark as permanent upload
            ]);
    
            // Return successful response with video ID
            return response()->json([
                'result' => true,
                'message' => 'Video uploaded successfully',
                'video_id' => $video->id,
            ], 201);
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
            $thumbnailFolder = public_path('storage/uploads/thumbnails');
            if (!file_exists($thumbnailFolder)) {
                mkdir($thumbnailFolder, 0775, true);
            }
    
            foreach ($timestamps as $timestamp) {
                $thumbnailPath = 'uploads/thumbnails/' . basename($filePath) . '-' . $timestamp . '.jpg';
                $video->frame(TimeCode::fromSeconds($timestamp))
                      ->save(public_path('storage/' . $thumbnailPath));
    
                $thumbnails[] = url('storage/' . $thumbnailPath); // Ensure this is correct URL
            }
    
            return $thumbnails;
        } catch (\Exception $e) {
            return [];
        }
    }
    
    public function getVideosByCategory($category_id)
    {
        // Fetch videos with the specified category_id and include category name
        $videos = M_Videos::where('category_id', $category_id)  // Use category_id instead of category
                    ->with('category')  // Eager load the category relationship
                    ->get();
    
        // If no videos are found
        if ($videos->isEmpty()) {
            return response()->json([
                'result' => false,
                'message' => 'No videos found for this category',
            ], 404);
        }
    
        // Return the list of videos along with category name
        return response()->json([
            'result' => true,
            'message' => 'Videos fetched successfully',
            'videos' => $videos->map(function ($video) {
                return [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'file_path' => url('storage/' . $video->file_path),
                    'category' => [
                        'id' => $video->category->id,
                        'name' => $video->category->name,
                    ],
                    'type' => $video->type,
                    'defaultthumbnail' => url('storage/' . $video->defaultthumbnail),
                    'country_code' => $video->country_code,
                ];
            }),
        ], 200);
    }
    
    public function index()
    {
        $videos = M_Videos::all()->map(function ($video) {
            return [
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
            ];
        });
    
        return response()->json([
            'result' => true,
            'message' => 'Videos fetched successfully',
            'data' => $videos
        ]);
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
