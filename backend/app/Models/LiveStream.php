<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveStream extends Model
{
    use HasFactory;
    protected $table = 'live_streams'; // Ensure it matches your database table

    protected $fillable = [
        'user_id',
        'stream_key',
        'status',
        'started_at',
        'ended_at'
    ];
}
