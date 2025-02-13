<?php

namespace App\Http\Controllers; 

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\LiveStreamEnded;
use App\Events\LiveStreamStarted;

class LiveStreamController extends Controller
{
    public function startStreaming(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // ✅ Broadcast event correctly
        broadcast(new LiveStreamStarted($user));

        return response()->json(['message' => 'Live stream event triggered']);
    }

    public function endStreaming(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // ✅ Broadcast event to indicate the stream has ended
        broadcast(new LiveStreamEnded($user));

        return response()->json(['message' => 'Live stream ended successfully']);
    }
}
