<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Subscription;
use Illuminate\Http\Request;

class VideoSubscriptionController extends Controller
{
    public function subscribe(Request $request, $channelId)
    {
        $channel = Channel::findOrFail($channelId);

        // Check if already subscribed
        $subscription = Subscription::firstOrCreate([
            'user_id' => $request->user()->id,
            'channel_id' => $channel->id,
        ]);

        return response()->json(['message' => 'Subscribed successfully!', 'subscription' => $subscription]);
    }

    public function unsubscribe(Request $request, $channelId)
    {
        $subscription = Subscription::where('user_id', $request->user()->id)
            ->where('channel_id', $channelId)
            ->first();

        if (!$subscription) {
            return response()->json(['message' => 'You are not subscribed to this channel.'], 404);
        }

        $subscription->delete();

        return response()->json(['message' => 'Unsubscribed successfully!']);
    }

    public function mySubscriptions(Request $request)
    {
        $subscriptions = $request->user()->subscriptions()->with('channel')->get();

        return response()->json(['subscriptions' => $subscriptions]);
    }

    public function channelSubscribers($channelId)
    {
        $channel = Channel::with('subscribers')->findOrFail($channelId);

        return response()->json([
            'channel' => $channel->name,
            'subscribers' => $channel->subscribers,
        ]);
    }
}
