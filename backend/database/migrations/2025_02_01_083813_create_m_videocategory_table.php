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
        Schema::create('m_videocategory', function (Blueprint $table) {
            $table->id('category_id')->comment('Unique category identifier'); // auto-increment primary key
            $table->string('category_name', 255)->comment('Category name'); // category name column
            $table->timestampsTz(); // created_at and updated_at timestamps with timezone
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('m_videocategory');
    }
};