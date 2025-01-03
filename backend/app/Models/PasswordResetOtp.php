<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasswordResetOtp extends Model
{
    use HasFactory;

    protected $table = 'password_resets_otp';

    protected $fillable = [
        'email',
        'otp',
        'expires_at',
    ];

    public $timestamps = true;
}
