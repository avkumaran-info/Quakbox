<?php

namespace App\Http\Controllers;

use App\Models\Video;
use App\Models\VideoInteraction;
use Illuminate\Http\Request;

class VideoInteractionController extends Controller
{
    public function like(Request $request, $videoId)
    {
        $video = Video::findOrFail($videoId);

        $interaction = VideoInteraction::updateOrCreate(
            ['video_id' => $videoId, 'user_id' => $request->user()->id, 'type' => 'like'],
            ['type' => 'like']
        );

        return response()->json(['message' => 'Video liked!', 'interaction' => $interaction]);
    }

    public function dislike(Request $request, $videoId)
    {
        $video = Video::findOrFail($videoId);

        $interaction = VideoInteraction::updateOrCreate(
            ['video_id' => $videoId, 'user_id' => $request->user()->id, 'type' => 'dislike'],
            ['type' => 'dislike']
        );

        return response()->json(['message' => 'Video disliked!', 'interaction' => $interaction]);
    }

    public function view(Request $request, $videoId)
    {
        $video = Video::findOrFail($videoId);

        VideoInteraction::create([
            'video_id' => $videoId,
            'user_id' => $request->user()->id ?? null,
            'type' => 'view',
        ]);

        return response()->json(['message' => 'View recorded']);
    }

    public function stats($videoId)
    {
        $video = Video::withCount(['likes', 'dislikes', 'views'])->findOrFail($videoId);

        return response()->json([
            'likes' => $video->likes_count,
            'dislikes' => $video->dislikes_count,
            'views' => $video->views_count,
        ]);
    }
}
