<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('favourite_country', function (Blueprint $table) {
            $table->id('favourite_country_id');
            $table->unsignedBigInteger('member_id'); 
            $table->string('code')->nullable(); 
            $table->string('favourite_country');
            $table->timestamps();
    
            // Foreign key constraint linking to users table
            $table->foreign('member_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favourite_country');
    }
};
