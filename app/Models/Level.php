<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    use HasFactory;

    // Specify the table name if it doesn't follow Laravel's naming convention
    protected $table = 'levels';

    // Specify the primary key if it's different from 'id'
    protected $primaryKey = 'level_id';

    // Specify the fields that are mass assignable
    protected $fillable = [
        'title',
        'description',
        'level_data',
        'created_by',
        'is_default'
    ];

    // Additional attributes can go here
}
