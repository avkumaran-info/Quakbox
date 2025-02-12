<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('mobile_number')->unique();
            $table->string('otp');
            $table->timestamp('expires_at');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('otp_verifications');
    }
};
