<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavouriteCountry extends Model
{
    use HasFactory;

    protected $table = 'favourite_country'; // Specify the exact table name
    protected $primaryKey = 'favourite_country_id'; // Specify the primary key column

    protected $fillable = [
        'member_id',
        'code',
        'favourite_country',
    ];

    public $timestamps = true; // Enable timestamps if your table has `created_at` and `updated_at`

    public function member()
    {
        return $this->belongsTo(Members::class, 'member_id', 'member_id');
    }

}
