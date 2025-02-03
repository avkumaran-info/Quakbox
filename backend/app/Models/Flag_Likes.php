<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flag_Likes extends Model
{
    use HasFactory;

    protected $table = 'flag_likes';
    public $timestamps = true;

    protected $fillable = ['country_code', 'user_id', 'is_like'];

    public function GeoCountry() {
        return $this->belongsTo(GeoCountry::class);
    }
}
