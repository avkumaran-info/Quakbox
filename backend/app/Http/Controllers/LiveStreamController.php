<?php

namespace App\Http\Controllers; 

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Events\LiveStreamEnded;
use App\Events\LiveStreamStarted;
use App\Models\LiveStream;

class LiveStreamController extends Controller
{
    public function startStreaming(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        $streamKey = Str::uuid()->toString(); // Generate a unique stream key
    
        // Store in database
        $liveStream = LiveStream::create([
            'user_id' => $user->id,
            'stream_key' => $streamKey,
        ]);
    
        // ✅ Broadcast WebSocket event to notify viewers that a new stream has started
        broadcast(new LiveStreamStarted($liveStream))->toOthers();
    
        return response()->json([
            'message' => 'Live stream started',
            'stream_key' => $streamKey, // Send the key to frontend
            'watch_url' => "https://develop.quakbox.com/live/$streamKey",
        ]);
    }
    
    public function endStreaming(Request $request)
    {
        $user = Auth::user();
    if (!$user) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // Get the active stream of the user
    $liveStream = LiveStream::where('user_id', $user->id)->latest()->first();

    if ($liveStream) {
        // ✅ Broadcast WebSocket event to inform viewers that the stream has ended
        broadcast(new LiveStreamEnded($liveStream))->toOthers();

        // ✅ Delete the stream entry (optional)
        $liveStream->delete();
    }

    return response()->json(['message' => 'Live stream ended successfully']);
   }

   public function watchLiveStream($streamKey)
    {
        $stream = LiveStream::where('stream_key', $streamKey)->first();

        if (!$stream) {
            return abort(404, 'Live stream not found');
        }

        return view('live-stream', compact('streamKey'));
    }

}
