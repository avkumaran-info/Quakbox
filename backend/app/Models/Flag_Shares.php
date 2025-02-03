<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flag_Shares extends Model
{
    use HasFactory;

    protected $table = 'flag_shares'; 
    public $timestamps = true;

    protected $fillable = ['country_code', 'user_id', 'platform'];

    public function GeoCountry() {
        return $this->belongsTo(GeoCountry::class);
    }
}
