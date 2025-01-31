<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class m_video_channel extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'description', 'logo'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    public function subscribers()
    {
        return $this->belongsToMany(User::class, 'm_video_Subscription', 'channel_id', 'user_id');
    }
}
