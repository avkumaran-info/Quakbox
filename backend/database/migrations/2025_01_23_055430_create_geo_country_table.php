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
        Schema::create('geo_country', function (Blueprint $table) {
            $table->id('country_id'); // Auto-incrementing primary key
            $table->string('country_name'); // Country name
            $table->string('code', 100); // Country code (e.g., ISO alpha-2 or alpha-3)
            $table->string('country_image'); // Country image
            $table->timestamps(); // Created at & Updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('geo_country');
    }
};
