<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDS extends Model
{
    use HasFactory;

    protected $table = 'rds';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'module',
        'item_no',
        'title_description',
        'active',
        'storage',
        'remarks',
        'department',
    ];
}
