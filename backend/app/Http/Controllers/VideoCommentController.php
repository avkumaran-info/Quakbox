<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Video;
use Illuminate\Http\Request;

class VideoCommentController extends Controller
{
    public function index($videoId)
    {
        $video = Video::findOrFail($videoId);
        $comments = $video->comments()->with('user')->get();

        return response()->json($comments);
    }

    public function store(Request $request, $videoId)
    {
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $video = Video::findOrFail($videoId);

        $comment = $video->comments()->create([
            'content' => $request->content,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($comment, 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $comment = Comment::findOrFail($id);

        // Ensure the logged-in user owns the comment
        if ($request->user()->id !== $comment->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->update([
            'content' => $request->content,
        ]);

        return response()->json($comment);
    }

    public function destroy(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        // Ensure the logged-in user owns the comment
        if ($request->user()->id !== $comment->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully.']);
    }
}
