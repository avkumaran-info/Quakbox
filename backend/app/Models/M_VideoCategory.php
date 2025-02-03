<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class M_VideoCategory extends Model
{
    use HasFactory;

    protected $table = 'm_videocategory';
    protected $primaryKey = 'category_id';
    public $timestamps = true;

    protected $fillable = ['category_name'];

    // Define the relationship: One category has many videos
    public function videos()
    {
        return $this->hasMany(M_Videos::class, 'category_id', 'category_id');
    }
}
