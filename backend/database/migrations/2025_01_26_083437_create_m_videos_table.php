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
            $table->integer('views')->default(0);
            $table->timestamps();
            $table->integer('category_id')->nullable();
            $table->string('type', 50)->nullable();
            $table->string('title_size', 50)->nullable();
            $table->string('title_colour', 50)->nullable();
            $table->string('defaultthumbnail', 255)->nullable();
            $table->string('country_code', 10)->nullable();
            $table->json('tags')->nullable();
            $table->integer('video_type')->comment('1 = Video, 2 = Live Video, 3 = Photo Slides, 4 = Audio');
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
