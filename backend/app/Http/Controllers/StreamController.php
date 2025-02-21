<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class StreamController extends Controller
{
    public function generateStreamKey(Request $request)
    {
        $streamKey = Str::random(16);
        //$stream = Stream::updateOrCreate(
        //    ['user_id' => auth()->id()],
        //    ['stream_key' => $streamKey]
        //);

        return response()->json(['stream_key' => $stream->stream_key]);
    }

    public function getStreamKey(Request $request)
    {
        //$stream = Stream::where('user_id', auth()->id())->first();
        //return response()->json(['stream_key' => $stream->stream_key]);
    }
    
    public function uploadChunk(Request $request)
    {
        $chunk = $request->file('video_chunk');

        if (!$chunk) {
            return response()->json(['error' => 'No file detected in request'], 400);
        }

        $filename = uniqid() . '.webm';
        $filePath = 'webcam/' . $filename;

        // Save the video chunk
        Storage::disk('public')->put($filePath, file_get_contents($chunk->getRealPath()));

        // Log the details
        Log::info('Uploaded file path: ' . $filePath);
        Log::info('Uploaded file size: ' . Storage::disk('public')->size($filePath));
        Log::info('Uploaded file type: ' . Storage::disk('public')->mimeType($filePath));

        return response()->json(['message' => 'Chunk uploaded successfully']);
    }

}
