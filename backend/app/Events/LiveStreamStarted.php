<?php
namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Queue\SerializesModels;

class LiveStreamStarted implements ShouldBroadcastNow
{
    use InteractsWithSockets, SerializesModels;

    public $user;

    public function __construct($user)
    {
        $this->user = $user;
    }

    // Define broadcast channel
    public function broadcastOn()
    {
        return new Channel('livestream');
    }

    // Optional: Define event name
    public function broadcastAs()
    {
        return 'live.stream.started';
    }

    public function broadcastWith()
    {
        return [
            'user_id' => $this->user->id,
            'username' => $this->user->username,
            'message' => 'Live stream started!',
        ];
    }
}
