<?php 

namespace App\Http\Controllers;

use App\Models\M_Videos;
use App\Models\M_Video_Interactions;
use Illuminate\Http\Request;

class VideoInteractionController extends Controller
{
    public function like(Request $request, $videoId)
    {
        $video = M_Videos::findOrFail($videoId);
        $user = $request->user();

        // Check if the user already has a "like" or "dislike" interaction
        $interaction = M_Video_Interactions::where('video_id', $videoId)
            ->where('user_id', $user->id)
            ->whereIn('type', ['like', 'dislike'])
            ->first();

        if ($interaction) {
            if ($interaction->type === 'like') {
                return response()->json(['result' => false, 'message' => 'You already liked this video'], 400);
            }
            $interaction->update(['type' => 'like']);
        } else {
            M_Video_Interactions::create([
                'video_id' => $videoId,
                'user_id' => $user->id,
                'type' => 'like'
            ]);
        }

        return response()->json(['result' => true, 'message' => 'Video liked!']);
    }

    public function dislike(Request $request, $videoId)
    {
        $video = M_Videos::findOrFail($videoId);
        $user = $request->user();

        // Check if the user already has a "like" or "dislike" interaction
        $interaction = M_Video_Interactions::where('video_id', $videoId)
            ->where('user_id', $user->id)
            ->whereIn('type', ['like', 'dislike'])
            ->first();

        if ($interaction) {
            if ($interaction->type === 'dislike') {
                return response()->json(['result' => false, 'message' => 'You already disliked this video'], 400);
            }
            $interaction->update(['type' => 'dislike']);
        } else {
            M_Video_Interactions::create([
                'video_id' => $videoId,
                'user_id' => $user->id,
                'type' => 'dislike'
            ]);
        }

        return response()->json(['result' => true, 'message' => 'Video disliked!']);
    }

    public function view(Request $request, $videoId)
    {
        $video = M_Videos::findOrFail($videoId);
        $user = $request->user();

        // Check if the user already viewed the video
        $viewInteraction = M_Video_Interactions::where('video_id', $videoId)
            ->where('user_id', $user->id)
            ->where('type', 'view')
            ->first();

        if (!$viewInteraction) {
            M_Video_Interactions::create([
                'video_id' => $videoId,
                'user_id' => $user->id,
                'type' => 'view'
            ]);
        }

        return response()->json(['result' => true, 'message' => 'View recorded']);
    }

    public function stats($videoId)
    {
        $likes = M_Video_Interactions::where('video_id', $videoId)->where('type', 'like')->count();
        $dislikes = M_Video_Interactions::where('video_id', $videoId)->where('type', 'dislike')->count();
        $views = M_Video_Interactions::where('video_id', $videoId)->where('type', 'view')->count();

        return response()->json([
            'result' => true,
            'likes' => $likes,
            'dislikes' => $dislikes,
            'views' => $views,
        ]);
    }

    public function removeInteraction(Request $request, $videoId)
    {
        $user = $request->user();

        M_Video_Interactions::where('video_id', $videoId)
            ->where('user_id', $user->id)
            ->whereIn('type', ['like', 'dislike'])
            ->delete();

        return response()->json(['result' => true, 'message' => 'Like/Dislike interaction removed']);
    }
}
