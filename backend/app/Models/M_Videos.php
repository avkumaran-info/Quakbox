<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class M_Videos extends Model
{
    protected $table = 'm_videos';
    protected $fillable = ['title', 'file_path', 'description', 'user_id', 'thumbnails'];

    public function comments()
    {
        return $this->hasMany(m_video_Comment::class);
    }

    public function interactions()
    {
        return $this->hasMany(m_video_interactions::class);
    }

    public function likes()
    {
        return $this->interactions()->where('type', 'like');
    }

    public function dislikes()
    {
        return $this->interactions()->where('type', 'dislike');
    }

    public function views()
    {
        return $this->interactions()->where('type', 'view');
    }
}
