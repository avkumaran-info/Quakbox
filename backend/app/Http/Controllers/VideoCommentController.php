<?php

namespace App\Http\Controllers;

use App\Models\M_Video_Comment;
use App\Models\M_Videos;
use Illuminate\Http\Request;

class VideoCommentController extends Controller
{
    public function index($videoId)
    {
        $video = M_Videos::findOrFail($videoId);
        $comments = $video->comments()->with('user')->latest()->get();

        $formattedcomments = $comments->map(function ($comment) {
            return [
                        'comment_id' => $comment->id,
                        'comment_video_id' => $comment->video_id,
                        'comment_content' => $comment->content,
                        'comment_user_id' => $comment->user_id,
                        'comment_user_name' => $comment->user->username,
                        'comment_user_profile_picture' => env('APP_URL') . '/api/images/' . $comment->user->profile_image,
                        'comment_updated_datetime' => $comment->updated_at
                    ];
        });

        // Return response
        return response()->json([
            'result' => true,
            'message' => 'Video Comments Fetched Successfully',
            'data' => $formattedcomments,
        ], 200);
    }

    public function store(Request $request, $videoId)
    {
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $video = M_Videos::findOrFail($videoId);

        $comment = M_Video_Comment::create([
            'content' => $request->content,
            'user_id' => $request->user()->id,
            'video_id' => $video->id,
        ]);

        return response()->json([
            'result' => true,
            'message' => 'Video Comment Registered successfully',
            'data' => [
                'comment_id' => $comment->id,
                'comment_content' => $comment->content,
                'comment_video_id' => $comment->video_id,
                'comment_user_id' => $comment->user_id,
            ]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $comment = M_Video_Comment::findOrFail($id);

        // Ensure the logged-in user owns the comment
        if ($request->user()->id !== $comment->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json([
            'result' => true,
            'message' => 'Video Comment Updated successfully',
            'data' => [
                'comment_id' => $comment->id,
                'comment_content' => $comment->content,
                'comment_video_id' => $comment->video_id,
                'comment_user_id' => $comment->user_id,
            ]
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $comment = M_Video_Comment::findOrFail($id);

        // Ensure the logged-in user owns the comment
        if ($request->user()->id !== $comment->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(["status" => true, 'message' => 'Video Comment Deleted successfully']);
    }
}
