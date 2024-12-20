<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static findOrFail(int $id)
 */
class Dialogue extends Model
{
    use HasFactory;

    // Specify the table name if it doesn't follow Laravel's naming convention
    protected $table = 'dialogues';

    // Specify the primary key if it's different from 'id'
    protected $primaryKey = 'dialogue_id';

    // Specify the fields that are mass assignable
    protected $fillable = ['dialogue_data'];
}
