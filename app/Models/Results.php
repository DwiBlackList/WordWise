<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Levels;

class Results extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 
        'level_id', 
        'score', 
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function level()
    {
        return $this->belongsTo(Levels::class);
    }
}
