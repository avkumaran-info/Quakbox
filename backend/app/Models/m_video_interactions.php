<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class M_Video_Interactions extends Model
{
    protected $table = 'm_video_interactions'; 
    protected $fillable = ['video_id', 'user_id', 'type'];

    public function video()
    {
        return $this->belongsTo(M_Videos::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
