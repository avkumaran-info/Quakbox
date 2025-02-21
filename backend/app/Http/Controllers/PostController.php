<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Post;
use App\Models\Like;
use App\Models\Comment;
use App\Models\Share;

class PostController extends Controller
{
	// Controller Method to Fetch Posts
    public function getAllPosts($cc)
    {
        try {

            $posts = Post::with(['user', 'likes', 'comments'])
                ->latest()
                ->where('country_code', $cc)
                ->get()
                ->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'created_time' => $post->created_at->toIso8601String(),
                        'message' => $post->message,
                        'from' => [
                            'user_id' => $post->user->id,
                            'name' => $post->user->username,
                            'profile_image' => env('APP_URL') . '/api/images/' . $post->user->profile_image,
                        ],
                        'attachments' => [
                            'data' => $this->getPostAttachments($post),
                        ],
                        'likes' => [
                            'count' => $post->likes->count(),
                            'liked_users' => $post->likes->map(function ($like) {
                                return [
                                    'user_id' => $like->user->id,
                                    'name' => $like->user->username,
                                ];
                            }),
                        ],
                        'comments' => [
                            'count' => $post->comments->count(),
                        ],
                    ];
                });

            return response()->json(["status" => true, 'posts' => $posts], 200);
        } catch (\Exception $e) {
            return response()->json(["status" => false, 'error' => $e->getMessage()], 500);
        }
    }

    // Helper Method to Fetch Post Attachments
    private function getPostAttachments($post)
    {
        if ($post->media_path) {
            return [[
                'type' => $post->media_type,
                'media' => [[
                    'url' => env('APP_URL') . '/api/images/' . $post->media_path,
                    'alt_text' => $post->media_type === 'image' ? 'Post image' : 'Post video',
                ]],
            ]];
        }

        return [];
    }

    // Create a new post
    public function postStore(Request $request)
    {
        $request->validate([
            'message' => 'required',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov', // Max 20 MB
        ]);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $mediaType = in_array($file->getMimeType(), ['video/mp4', 'video/quicktime']) ? 'video' : 'image';
            $mediaPath = $file->store('uploads/posts', 'public');
        }

        $post = Post::create([
            'user_id' => $request->user()->id,
            'country_code' => $request->country_code,
            'message' => $request->message,
            'media_path' => $mediaPath,
            'media_type' => $mediaType,
        ]);

        return response()->json(["status" => true, 'message' => 'Post created successfully', 'post' => $post], 201);
    }

    // Update a post
    public function postUpdate(Request $request, $id)
    {
        $post = Post::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'message' => 'nullable|string|max:255',
        ]);

        if ($request->message) {
            $post->update(['message' => $request->message]);
        }

        return response()->json(["status" => true, 'message' => 'Post updated successfully', 'post' => $post]);
    }

    // Delete a post
    public function postDestroy(Request $request, $id)
    {
        $post = Post::where('user_id', $request->user()->id)->findOrFail($id);

        // Delete media
        if ($post->media_path) {
            Storage::disk('public')->delete($post->media_path);
        }

        $post->delete();

        return response()->json(["status" => true, 'message' => 'Post deleted successfully']);
    }

    // Like/Dislike a post
    public function postLike(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $isLike = $request->input('is_like', true);

        $like = Like::updateOrCreate(
            ['user_id' => $request->user()->id, 'post_id' => $id],
            ['is_like' => $isLike]
        );
        $likeCount = $post->likes()->where('is_like', true)->count();
        return response()->json(["status" => true,
        'message' => $isLike ? 'Liked' : 'Disliked', 'like' => $like,
        'like_count' => $likeCount]);
    }
    public function postDislike(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $userId = $request->user()->id;
    
        // Check if user already disliked the post
        $existingLike = Like::where('post_id', $id)->where('user_id', $userId)->first();
    
        if ($existingLike) {
            if ($existingLike->is_like == false) {
                // If already disliked, remove it (toggle off)
                $existingLike->delete();
                $message = "Dislike removed";
            } else {
                // If liked, switch to dislike
                $existingLike->update(['is_like' => false]);
                $message = "Switched from Like to Dislike";
            }
        } else {
            // Add new dislike
            Like::create([
                'user_id' => $userId,
                'post_id' => $id,
                'is_like' => false
            ]);
            $message = "Disliked";
        }
    
        // Refresh like count after the update
        $likeCount = $post->likes()->where('is_like', true)->count();
    
        return response()->json([
            "status" => true,
            "message" => $message,
            "like_count" => $likeCount
        ]);
    }    

    public function getComment(Request $request, $pid)
    {
        $post = Post::findOrFail($pid);
        $postComment = $post->Comments()->with('user')->latest()->get();
        $formattedcomments = $postComment->map(function ($comment) {
            return [
                        'comment_id' => $comment->id,
                        'comment_post_id' => $comment->post_id,
                        'comment_content' => $comment->comment,
                        'comment_user_id' => $comment->user_id,
                        'comment_user_name' => $comment->user->username,
                        'comment_user_profile_picture' => env('APP_URL') . '/api/images/' . $comment->user->profile_image,
                        'comment_updated_datetime' => $comment->updated_at
                    ];
        });

        return response()->json(["status" => true, 
                                    'message' => 'Post Comment Fetched', 
                                    'data' => $formattedcomments
                                ]);
    }

    // Comment on a post
    public function postComment(Request $request, $id)
    {
        $request->validate([
            'comment' => 'required|string|max:255',
        ]);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'post_id' => $id,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'result' => true,
            'message' => 'Comment Added Successfully',
            'data' => [
                'comment_id' => $comment->id,
                'post_id' => $comment->post_id,
                'comment' => $comment->comment,
                'user_id' => $comment->user_id
            ]
        ]);
    }

    // Share a post
    public function postShare(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $share = Share::create([
            'user_id' => $request->user()->id,
            'post_id' => $id,
        ]);

        return response()->json(["status" => true, 'message' => 'Post shared successfully', 'share' => $share]);
    }
    public function commentDestroy(Request $request, $postId, $commentId)
    {
        // Find the post by ID
        $post = Post::find($postId);
    
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }
    
        // Find the comment by ID within the post
        $comment = $post->comments()->find($commentId);
    
        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }
    
        // Get the authenticated user's ID from the token
        $userId = $request->user()->id;
    
        // Check if the logged-in user is the owner of the comment
        if ($comment->user_id !== $userId) {
            return response()->json(['message' => 'You can only delete your own comment'], 403);
        }
    
        // Delete the comment
        $comment->delete();
    
        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }    
    // Get list of users who liked a post
    public function getLikedUsers($postId)
    {
        try {
            $post = Post::findOrFail($postId);

            $likedUsers = $post->likes()->where('is_like', true)->with('user')->get()->map(function ($like) {
                return [
                    'user_id' => $like->user->id,
                    'name' => $like->user->username,
                    'profile_image' => env('APP_URL') . '/api/images/' . $like->user->profile_image,
                ];
            });

            return response()->json(["status" => true, "liked_users" => $likedUsers]);
        } catch (\Exception $e) {
            return response()->json(["status" => false, "error" => $e->getMessage()], 500);
        }
    }

}
