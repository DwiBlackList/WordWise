<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePerformancesTable extends Migration
{
    public function up()
    {
        Schema::create('performances', function (Blueprint $table) {
            $table->id('performance_id'); // Auto-increment primary key
            $table->unsignedBigInteger('student_id')->nullable(); // Foreign key column, nullable
            $table->unsignedBigInteger('level_id')->nullable(); // Foreign key column, nullable
            $table->integer('score');
            $table->decimal('error_percentage', 5, 2);
            $table->timestamps(); // Defaults to current timestamp

            // Define foreign key constraints
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
//            $table->foreign('level_id')->references('id')->on('levels')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('performances');
    }
}
