<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class GeoCountry extends Model
{
    use HasFactory;

    protected $table = 'geo_country'; // Specify the exact table name
    protected $primaryKey = 'country_id'; // Specify the primary key column

    protected $fillable = [
        'country_id',
        'code',
        'phone_code',
        'country_name',
        'country_image',
    ];

    public $timestamps = true; // Enable timestamps if your table has `created_at` and `updated_at`

    public function flagLikes() {
        return $this->hasMany(Flag_Likes::class);
    }

    public function flagComments() {
        return $this->hasMany(Flag_Comments::class);
    }

    public function flagShares() {
        return $this->hasMany(Flag_Shares::class);
    }

    public static function getCountryActivity($cc) {
        $flag_likes = GeoCountry::leftJoin('flag_likes', 'geo_country.code', '=', 'flag_likes.country_code')
                                    ->leftJoin('flag_comments', 'geo_country.code', '=', 'flag_comments.country_code')
                                    ->leftJoin('flag_shares', 'geo_country.code', '=', 'flag_shares.country_code')
                                    ->select(
                                        DB::raw('COUNT(DISTINCT CASE WHEN flag_likes.is_like = 1 THEN flag_likes.id END) as likes_count'),
                                        DB::raw('COUNT(DISTINCT CASE WHEN flag_likes.is_like = 0 THEN flag_likes.id END) as dislikes_count'),
                                        DB::raw('COUNT(DISTINCT flag_comments.id) as comments_count'),
                                        DB::raw('COUNT(DISTINCT flag_shares.id) as shares_count')
                                        )
                                    ->where('geo_country.code', $cc)
                                    ->groupBy('geo_country.code')
                                    ->first();
        return $flag_likes;
    }

    public static function getCountryComment($cc) {
        return GeoCountry::leftJoin('flag_comments', 'geo_country.code', '=', 'flag_comments.country_code')
            ->leftJoin('users', 'flag_comments.user_id', '=', 'users.id')
            ->select(
                DB::raw('flag_comments.id as comment_id'),
                DB::raw('users.username as userName'),
                DB::raw('users.id as userID'),
                DB::raw('flag_comments.country_code as country_code'),
                DB::raw('flag_comments.comment as comment'),
                DB::raw('flag_comments.created_at as created_at')
            )
            ->where('geo_country.code', $cc)
            ->orderBy('flag_comments.created_at', 'DESC') // Order comments by latest first
            ->get();    
    }
}