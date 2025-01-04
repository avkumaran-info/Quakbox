<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\PasswordResetOtp;
use App\Mail\QuakboxMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ForgotPasswordController extends Controller
{
    public function sendOtp(Request $request)
    {
        // Validate email
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid Input data",
                "errors" => $validator->errors()
            ], 422);
        }

        $email = $request->email;

        // Generate OTP
        $otp = rand(100000, 999999);

        // Save OTP to the database
        PasswordResetOtp::updateOrCreate(
            ['email' => $email],
            [
                'otp' => $otp,
                'expires_at' => Carbon::now()->addMinutes(10),
            ]
        );

        // Send OTP via email
        $data = [
            'subject' => 'Password Reset OTP',
            'title' => 'Password Reset Mail',
            'message' => 'Your OTP is:'. $otp
        ];

        Mail::to($email)->send(new QuakboxMail($data));

        return response()->json([
            "status" => true,
            "code" => 200,
            "message" => "OTP sent successfully"
        ], 200);
    }

    public function verifyOtp(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid Input data",
                "errors" => $validator->errors()
            ], 422);
        }

        $otpRecord = PasswordResetOtp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$otpRecord || Carbon::now()->isAfter($otpRecord->expires_at)) {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid or expired OTP",
                "errors" => $validator->errors()
            ], 422);
        }

        // OTP is valid
        return response()->json([
            "status" => true,
            "code" => 200,
            "message" => "OTP verified successfully"
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        // Validate input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|digits:6',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid Input data",
                "errors" => $validator->errors()
            ], 422);
        }

        $otpRecord = PasswordResetOtp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->first();

        if (!$otpRecord || Carbon::now()->isAfter($otpRecord->expires_at)) {
            return response()->json([
                "status" => false,
                "code" => 422,
                "message" => "Invalid or expired OTP",
                "errors" => $validator->errors()
            ], 422);
        }

        // Update password
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete OTP record
        $otpRecord->delete();

        return response()->json([
            "status" => true,
            "code" => 200,
            "message" => "Password reset successfully"
        ], 200);
    }

}
