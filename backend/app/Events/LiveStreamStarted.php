<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;  // ✅ Correct Import
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class LiveStreamStarted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;  // ✅ Include Trait

    public $user;
    public $streamUrl;

    public function __construct($user, $streamUrl)
    {
        $this->user = $user;
        $this->streamUrl = $streamUrl;
    }

    public function broadcastOn()
    {
        return new Channel('live-streams');
    }

    public function broadcastAs()
    {
        return 'LiveStreamStarted';
    }
}
