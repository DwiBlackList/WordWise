<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->unsignedBigInteger('student_id')->autoIncrement(); // Primary key
            $table->unsignedBigInteger('user_id');
            $table->string('name');
            $table->unsignedSmallInteger('sprite');
            $table->unsignedBigInteger('teacher_id')->nullable(); // Foreign key column
            $table->integer('level')->default(1);
            $table->integer('total_points')->default(0);
            $table->timestamps(); // created_at and updated_at timestamps

            // Define the foreign key relationship
            $table->foreign('teacher_id')
                ->references('teacher_id')
                ->on('teachers')
                ->onDelete('set null');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('students');
    }
};
