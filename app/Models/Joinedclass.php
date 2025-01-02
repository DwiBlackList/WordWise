<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Joinedclass extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'class_id', 
    ];

    public function classes()
    {
        return $this->belongsTo(Classes::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
