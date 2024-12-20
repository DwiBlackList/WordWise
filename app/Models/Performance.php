<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Performance extends Model
{
    use HasFactory;

    // Define the table name (optional if it matches the model name in plural form)
    protected $table = 'performances';

    // Define the primary key column name if it's different from 'id'
    protected $primaryKey = 'performance_id';

    // Specify the attributes that are mass assignable
    protected $fillable = ['student_id', 'level_id', 'score', 'error_percentage', 'completed_at'];

    // Define relationships
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function level()
    {
        return $this->belongsTo(Level::class, 'level_id');
    }
}
