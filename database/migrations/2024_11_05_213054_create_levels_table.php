<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('levels', function (Blueprint $table) {
            $table->id('level_id'); // Primary key
            $table->string('title', 100); // Level title
            $table->text('description')->nullable(); // Level description
            $table->text('level_data')->nullable(); // Level data
            $table->unsignedBigInteger('created_by')->nullable(); // ID of the creator
            $table->timestamps(); // Created and updated timestamps
            $table->boolean('is_default')->default(1); // Default value is 1

            // Optional: Add foreign key for `created_by` if it references a `users` table
             $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('levels');
    }
}
