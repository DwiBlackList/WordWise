<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Levels extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id', 
        'level_name', 
        'chapter_name', 
        'dialogue_data', 
    ];

    public function classes()
    {
        return $this->belongsTo(Classes::class);
    }

    public function results()
    {
        return $this->hasMany(Results::class , 'level_id');
    }
}
