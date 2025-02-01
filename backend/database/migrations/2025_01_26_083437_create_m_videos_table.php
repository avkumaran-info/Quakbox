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
        Schema::create('m_videos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');  // For user association
            $table->string('title');
            $table->string('description')->nullable();
            $table->string('file_path');
            $table->json('thumbnails')->nullable(); // Store paths to thumbnails as JSON
            $table->integer('views')->default(0);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_videos');
    }
};
