<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class m_video_Comment extends Model
{
    protected $fillable = ['content', 'video_id', 'user_id'];

    public function video()
    {
        return $this->belongsTo(m_video::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
