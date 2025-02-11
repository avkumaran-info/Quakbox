<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class M_Videos extends Model
{
    use HasFactory;

    protected $table = 'm_videos'; 
    protected $primaryKey = 'id';
    protected $casts = [
        'tags' => 'array',
    ];  
    public $timestamps = true;

    protected $fillable = [
        'title', 'file_path', 'description', 'user_id',
        'category_id', 'type', 'title_size', 'title_colour',
        'defaultthumbnail', 'country_code', 'tags', 'video_type',
    ];    
    
    public function category()
    {
        return $this->belongsTo(M_VideoCategory::class, 'category_id', 'category_id');
    }           

    public function comments()
    {
        return $this->hasMany(M_Video_Comment::class, 'video_id');
    }

    public function interactions()
    {
        return $this->hasMany(M_Video_Interactions::class);
    }

    public function likes()
    {
        return $this->hasMany(M_Video_Interactions::class, 'video_id')->where('type', 'like');
    }

    public function dislikes()
    {
        return $this->hasMany(M_Video_Interactions::class, 'video_id')->where('type', 'dislike');
    }

    public function views()
    {
        return $this->hasMany(M_Video_Interactions::class, 'video_id')->where('type', 'view');
    }
}

