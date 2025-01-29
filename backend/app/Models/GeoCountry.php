<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeoCountry extends Model
{
    use HasFactory;

    protected $table = 'geo_country'; // Specify the exact table name
    protected $primaryKey = 'country_id'; // Specify the primary key column

    protected $fillable = [
        'country_id',
        'code',
        'country_name',
        'country_image',
    ];

    public $timestamps = true; // Enable timestamps if your table has `created_at` and `updated_at`
}
