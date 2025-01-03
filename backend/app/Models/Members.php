<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Members extends Model
{
    use HasFactory;

    protected $fillable = ['member_id', 'birthdate', 'country']; // Add the fields you want to fill

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function getMemberDetail($userId)
    {
        return DB::table('members')->where('member_id', $userId)->get();
    }
}
