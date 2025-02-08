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

        // Check if user already interacted with the video
        $interaction = M_Video_Interactions::where('video_id', $videoId)->where('user_id', $user->id)->first();

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

        // Check if user already interacted with the video
        $interaction = M_Video_Interactions::where('video_id', $videoId)->where('user_id', $user->id)->first();

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

        // Check if user already interacted with the video
        $interaction = M_Video_Interactions::where('video_id', $videoId)->where('user_id', $user->id)->first();

        if ($interaction) {
            if ($interaction->type === 'view') {
                return response()->json(['result' => false, 'message' => 'You already disliked this video'], 400);
            }
            $interaction->update(['type' => 'view']);
        } else {
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
        $video = M_Videos::withCount(['likes', 'dislikes', 'views'])->findOrFail($videoId);

        return response()->json([
            'result' => true,
            'likes' => $video->likes_count,
            'dislikes' => $video->dislikes_count,
            'views' => $video->views_count,
        ]);
    }

    public function removeInteraction(Request $request, $videoId)
    {
        $user = $request->user();

        M_Video_Interactions::where('video_id', $videoId)->where('user_id', $user->id)->delete();

        return response()->json(['result' => true, 'message' => 'Interaction removed']);
    }

}
