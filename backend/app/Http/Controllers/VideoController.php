<?php

namespace App\Http\Controllers;
ini_set('memory_limit', '2G');
use Illuminate\Http\Request;
use App\Models\M_Videos;
use FFMpeg;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class VideoController extends Controller
{
    public function videoUpload(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'video_file' => 'required|file|mimes:mp4,mov|max:20480', // 20MB max
        ]);
    
        // If validation fails, return a JSON response with the errors
        if ($validator->fails()) {
            return response()->json([
                'result' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422); // 422 Unprocessable Entity
        }
    
        if ($request->hasFile('video_file')) {
            $file = $request->file('video_file');
            $mediaPath = $file->store('uploads/videos', 'public');
    
            // Generate Thumbnails
            $videoPath = storage_path('app/public/' . $mediaPath);
            $thumbnails = $this->generateThumbnails($videoPath);
    
            // Store Video
            $video = M_Videos::create([
                'title' => $request->title,
                'description' => $request->description,
                'file_path' => url('storage/' . $mediaPath), // Fixed File Path
                'thumbnails' => json_encode(array_map(fn($thumb) => url('storage/' . $thumb), $thumbnails)), // Fixed Thumbnails Path
                'user_id' => $request->user()->id,
            ]);
    
            return response()->json([
                'result' => true,
                'message' => 'Video uploaded successfully',
                'video_id' => $video->id // Only returning the video ID
            ], 201);
        }
    
        return response()->json([
            'result' => false,
            'message' => 'Video upload failed'
        ], 422);
    }
    
    public function index()
    {
        $videos = M_Videos::all()->map(function ($video) {
            return [
                'video_id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'file_path' => url('storage/' . $video->file_path), // Fixed File Path
                'thumbnails' => array_map(fn($thumb) => url('storage/' . $thumb), json_decode($video->thumbnails, true)), // Fixed Thumbnails Path
                'user_id' => $video->user_id,
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
                'thumbnails' => array_map(fn($thumb) => url('storage/' . $thumb), json_decode($video->thumbnails, true)), // Fixed Thumbnails Path
                'user_id' => $video->user_id,
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
                'id' => $video->id,
                'title' => $video->title,
                'description' => $video->description,
                'file_path' => url('storage/' . $video->file_path), // Full URL for file_path
                'thumbnails' => array_map(fn($thumb) => url('storage/' . $thumb), json_decode($video->thumbnails, true)), // Full URLs for thumbnails
                'user_id' => $video->user_id,
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

    private function generateThumbnails($videoPath)
    {
        $ffmpeg = FFMpeg\FFMpeg::create();
        $video = $ffmpeg->open($videoPath);

        $thumbnails = [];
        $timeFrames = [5, 15, 30]; // Time frames in seconds
        foreach ($timeFrames as $key => $time) {
            $thumbnailPath = 'uploads/videos/thumbnails/' . uniqid() . '.png';
            $absolutePath = Storage::disk('public')->path($thumbnailPath);
            $video->frame(FFMpeg\Coordinate\TimeCode::fromSeconds($time))
                  ->save($absolutePath);

            $thumbnails[$key] = $thumbnailPath;
        }

        return $thumbnails;
    }
}
