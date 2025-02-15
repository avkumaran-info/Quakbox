<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Pusher\Pusher;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class LiveStreamController extends Controller
{
    public function startStream(Request $request)
    {
        $streamKey = uniqid(); // Generate unique stream key
        $streamUrl = "https://develop.quakbox.com/watchlive/" . $streamKey;

        // Notify frontend using Pusher
        $pusher = new Pusher(env('PUSHER_APP_KEY'), env('PUSHER_APP_SECRET'), env('PUSHER_APP_ID'), [
            'cluster' => env('PUSHER_APP_CLUSTER'),
            'useTLS' => true
        ]);
        $pusher->trigger('live-stream', 'LiveStreamStarted', ['streamUrl' => $streamUrl]);

        return response()->json([
            'success' => true,
            'stream_key' => $streamKey,
            'stream_url' => $streamUrl,
        ]);
    }

    public function generateHLS(Request $request)
    {
        $streamKey = $request->stream_key;
        $outputPath = storage_path("app/public/hls/{$streamKey}");

        if (!file_exists($outputPath)) {
            mkdir($outputPath, 0777, true);
        }

        // Command to capture webcam input and stream as HLS
        $command = [
            'ffmpeg', '-f', 'v4l2', '-i', '/dev/video0', // Capture from webcam
            '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
            '-f', 'hls', '-hls_time', '2', '-hls_list_size', '3',
            '-hls_flags', 'delete_segments',
            $outputPath . '/index.m3u8'
        ];

        $process = new Process($command);
        $process->start();

        return response()->json([
            'message' => 'Streaming started',
            'hls_url' => "https://develop.quakbox.com/admin/api/images/hls/{$streamKey}/index.m3u8"
        ]);
    }

    public function uploadChunk(Request $request)
    {
        $streamKey = $request->stream_key;
        $chunk = $request->file('video_chunk');

        if (!$chunk || !$streamKey) {
            return response()->json(["error" => "Invalid request"], 400);
        }

        $outputPath = storage_path("app/public/hls/{$streamKey}");

        if (!file_exists($outputPath)) {
            mkdir($outputPath, 0777, true);
        }

        // Save the video chunk
        $chunk->move($outputPath, uniqid() . ".webm");

        return response()->json(["success" => true]);
    }

}
