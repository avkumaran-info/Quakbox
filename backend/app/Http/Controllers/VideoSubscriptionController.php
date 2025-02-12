<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\M_Videos;
use App\Models\M_Video_Subscription;

class VideoSubscriptionController extends Controller
{
    // Subscribe to a creator
    public function subscribe($creator_id, Request $request)
    {
        $user = $request->user();

        // Prevent self-subscription
        if ($user->id == $creator_id) {
            return response()->json(['result' => false, 'message' => 'You cannot subscribe to yourself'], 400);
        }

        // Check if already subscribed
        $existingSubscription = M_Video_Subscription::where('subscriber_id', $user->id)->where('creator_id', $creator_id)->first();
        if ($existingSubscription) {
            return response()->json(['result' => false, 'message' => 'Already subscribed'], 400);
        }

        M_Video_Subscription::create([
            'subscriber_id' => $user->id,
            'creator_id' => $creator_id
        ]);

        return response()->json(['result' => true, 'message' => 'Subscribed successfully']);
    }

    // Unsubscribe from a creator
    public function unsubscribe($creator_id, Request $request)
    {
        $user = $request->user();

        $subscription = M_Video_Subscription::where('subscriber_id', $user->id)->where('creator_id', $creator_id)->first();

        if (!$subscription) {
            return response()->json(['result' => false, 'message' => 'Not subscribed'], 400);
        }

        $subscription->delete();

        return response()->json(['result' => true, 'message' => 'Unsubscribed successfully']);
    }

    // List all subscriptions of the logged-in user
    public function listsubscriptions(Request $request)
    {
        $user = $request->user();
        $search = $request->query('search'); // Get search query
    
        // Fetch My Subscriptions with optional filtering by username
        $mySubscribers = M_Video_Subscription::where('m_video_subscriptions.subscriber_id', $user->id)
            ->join('users', 'm_video_subscriptions.creator_id', '=', 'users.id')
            ->select(
                'm_video_subscriptions.*',
                'users.username as username',
                'users.profile_image as profile_image'
            );
    
        // Apply search filter if search query is provided
        if ($search) {
            $mySubscribers->where('users.username', 'LIKE', "%{$search}%");
        }
    
        $mySubscribers = $mySubscribers->get();
    
        // Format the response data
        $formattedMySubscribers = $mySubscribers->map(function ($mySubscriber) {
            return [
                'my_subscriber_id' => $mySubscriber->id,
                'my_subscriber_user_id' => $mySubscriber->subscriber_id,
                'my_subscriber_username' => $mySubscriber->username,
                'my_subscriber_profile_image' => env('APP_URL') . '/api/images/' . $mySubscriber->profile_image,
            ];
        });
    
        // Return response
        return response()->json([
            'result' => true,
            'message' => 'MY Subscription List fetched successfully',
            'data' => $formattedMySubscribers,
        ], 200);
    }    

    public function listbrowsestations(Request $request)
    {
        $user = $request->user();
        $search = $request->query('search'); // Get search query
    
        // Fetch stations with optional filtering by name
        $browsestations = M_Video_Subscription::join('users', 'm_video_subscriptions.creator_id', '=', 'users.id')
            ->select('m_video_subscriptions.*', 'users.username as username', 'users.profile_image as profile_image');
    
        // Apply search filter if search query is provided
        if ($search) {
            $browsestations->where('users.username', 'LIKE', "%{$search}%");
        }
    
        $browsestations = $browsestations->get();
    
        // Map data to include subscribers and video count
        $stationsList = $browsestations->map(function ($station) {
            $subscribersCount = M_Video_Subscription::where('creator_id', $station->creator_id)->count();
            $videosCount = M_Videos::where('user_id', $station->creator_id)->count();
    
            return [
                'station_admin_name' => $station->username,
                'station_admin_profile_image' => env('APP_URL') . '/api/images/' . $station->profile_image,
                'station_subscribers_count' => $subscribersCount,
                'station_videos_count' => $videosCount,
            ];
        });
    
        // Return response
        return response()->json([
            'result' => true,
            'message' => 'Browse stations fetched successfully',
            'data' => $stationsList,
        ], 200);
    }
    
    // Get all subscribers of a creator
    public function getSubscribers($creator_id)
    {
        $subscribers = M_Video_Subscription::where('creator_id', $creator_id)
            ->join('users', 'm_video_subscriptions.subscriber_id', '=', 'users.id')
            ->select('m_video_subscriptions.*',
                        'users.username as username', 'users.profile_image as profile_image')
            ->get();

        $formattedsubscribers = $subscribers->map(function ($subscriber) {
            return [
                'subscriber_id' => $subscriber->id,
                'subscriber_user_id' => $subscriber->subscriber_id,
                'subscriber_profile_image' => env('APP_URL') . '/api/images/' . $subscriber->profile_image,
            ];
        });
    
        // Return response
        return response()->json([
            'result' => true,
            'message' => 'Subscribers fetched successfully',
            'data' => $formattedsubscribers,
        ], 200);
    }
}