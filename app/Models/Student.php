<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    // Specify the table name if it doesn't follow Laravel's naming convention
    protected $table = 'students';

    // Specify the primary key if it's different from 'id'
    protected $primaryKey = 'student_id';

    // Specify the fields that are mass assignable
    protected $fillable = ['user_id','name','sprite','level', 'total_points', 'teacher_id'];

    public function user(){
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Define the relationship with the Teacher model
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id', 'teacher_id');
    }
}
