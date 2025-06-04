<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Officer extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_initial',
        'last_name',
        'extension',
        'office_id',
    ];

    public function positions()
    {
        return $this->belongsToMany(Position::class, 'officer_position');
    }
}
