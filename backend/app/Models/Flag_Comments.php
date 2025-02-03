<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flag_Comments extends Model
{
    use HasFactory;

    protected $table = 'flag_comments'; 
    public $timestamps = true;

    protected $fillable = ['country_code', 'user_id', 'comment'];

    public function GeoCountry() {
        return $this->belongsTo(GeoCountry::class);
    }
}
