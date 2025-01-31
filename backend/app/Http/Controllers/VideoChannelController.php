<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VideoChannelController extends Controller
{
    public function create(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = $path;
        }

        $validated['user_id'] = Auth::id();

        $channel = Channel::create($validated);

        return response()->json($channel, 201);
    }

    public function show($id)
    {
        $channel = Channel::with('videos')->findOrFail($id);

        return response()->json($channel);
    }

    public function update(Request $request, $id)
    {
        $channel = Channel::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = $path;
        }

        $channel->update($validated);

        return response()->json($channel);
    }

    public function delete($id)
    {
        $channel = Channel::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $channel->delete();

        return response()->json(['message' => 'Channel deleted successfully']);
    }

    public function getVideos($id)
    {
        $channel = Channel::with('videos')->findOrFail($id);

        return response()->json($channel->videos);
    }

    public function addVideo(Request $request, $id, $videoId)
    {
        $channel = Channel::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $channel->videos()->attach($videoId);

        return response()->json(['message' => 'Video added to the channel']);
    }

    public function removeVideo(Request $request, $id, $videoId)
    {
        $channel = Channel::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $channel->videos()->detach($videoId);

        return response()->json(['message' => 'Video removed from the channel']);
    }
}
