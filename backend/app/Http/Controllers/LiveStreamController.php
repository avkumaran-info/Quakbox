<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Events\LiveStreamStarted;

class LiveStreamController extends Controller
{
	// Controller Method to Fetch Posts
    public function startStreming(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        broadcast(new LiveStreamStarted($user));
        
        return response()->json(['message' => 'Live stream event triggered']);
    }
}
