<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class M_Video_Comment extends Model
{
    protected $table = 'm_video_comments';
    protected $fillable = ['user_id','video_id','content'];

    public function video()
    {
        return $this->belongsTo(M_Videos::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
