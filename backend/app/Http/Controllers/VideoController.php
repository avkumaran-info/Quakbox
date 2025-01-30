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
                'errors' => $validator->errors()
            ], 422); // 422 Unprocessable Entity
        }

        if ($request->hasFile('video_file')) {
            $file = $request->file('video_file');
            $mediaType = 'video';
            $mediaPath = $file->store('uploads/videos', 'public');

            // Generate Thumbnails
            $videoPath = Storage::disk('public')->path($mediaPath);
            $thumbnails = $this->generateThumbnails($videoPath);

            $video = M_Videos::create([
                'title' => $request->title,
                'description' => $request->description,
                'file_path' => $mediaPath,
                'thumbnails' => json_encode($thumbnails),
                'user_id' => $request->user()->id,
            ]);
            
            return response()->json($video, 201);
        }

        return response()->json("error", 422);
    }

    public function index()
    {
        return M_video::all();
    }

    public function show($id)
    {
        return M_video::findOrFail($id);
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
