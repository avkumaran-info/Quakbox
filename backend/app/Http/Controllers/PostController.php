<?
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
                        'name' => $post->user->username,
                        'profile_image' => $post->user->profile_image,
                    ],
                    'attachments' => [
                        'data' => $this->getPostAttachments($post),
                    ],
                    'likes' => [
                        'count' => $post->likes->count(),
                    ],
                    'comments' => [
                        'count' => $post->comments->count(),
                    ],
                ];
            });

        return response()->json(['posts' => $posts], 200);
    }

    // Helper Method to Fetch Post Attachments
    private function getPostAttachments($post)
    {
        if ($post->media_path) {
            return [[
                'type' => $post->media_type,
                'media' => [[
                    'url' => asset($post->media_path),
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
            'message' => 'nullable|string|max:255',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov|max:20480', // Max 20 MB
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

        return response()->json(['message' => 'Post created successfully', 'post' => $post], 201);
    }

    // Update a post
    public function postUpdate(Request $request, $id)
    {
        $post = Post::where('user_id', $request->user()->id)->findOrFail($id);

        $request->validate([
            'message' => 'nullable|string|max:255',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov|max:20480',
        ]);

        if ($request->hasFile('media')) {
            // Delete old media
            if ($post->media_path) {
                Storage::disk('public')->delete($post->media_path);
            }

            $file = $request->file('media');
            $mediaType = in_array($file->getMimeType(), ['video/mp4', 'video/quicktime']) ? 'video' : 'image';
            $mediaPath = $file->store('uploads/posts', 'public');

            $post->update(['media_path' => $mediaPath, 'media_type' => $mediaType]);
        }

        if ($request->message) {
            $post->update(['message' => $request->message]);
        }

        return response()->json(['message' => 'Post updated successfully', 'post' => $post]);
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

        return response()->json(['message' => 'Post deleted successfully']);
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

        return response()->json(['message' => $isLike ? 'Liked' : 'Disliked', 'like' => $like]);
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

        return response()->json(['message' => 'Comment added successfully', 'comment' => $comment]);
    }

    // Share a post
    public function postShare(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $share = Share::create([
            'user_id' => $request->user()->id,
            'post_id' => $id,
        ]);

        return response()->json(['message' => 'Post shared successfully', 'share' => $share]);
    }
}
