<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    use HasFactory;

    // Specify the table name if it doesn't follow Laravel's naming convention
    protected $table = 'teachers';

    // Specify the primary key if it's different from 'id'
    protected $primaryKey = 'teacher_id';

    // Specify the fields that are mass assignable
    protected $fillable = ['name', 'sprite', 'bio', 'user_id'];

    // Define the relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Define the relationship with the Student model
    public function students()
    {
        return $this->hasMany(Student::class, 'teacher_id', 'teacher_id');
    }
}
