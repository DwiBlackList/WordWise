<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'class_name',
        'token',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function levels()
    {
        return $this->hasMany(Levels::class);
    }

    public function joinedclass()
    {
        return $this->hasMany(Joinedclass::class);
    }
}
