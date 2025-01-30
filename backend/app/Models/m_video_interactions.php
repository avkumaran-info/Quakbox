<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class m_video_interactions extends Model
{
    protected $fillable = ['video_id', 'user_id', 'type'];

    public function video()
    {
        return $this->belongsTo(Video::class);
    }
}
