<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('m_video_channels', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Owner of the channel
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('logo')->nullable(); // Channel logo URL
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_video_channels');
    }
};
