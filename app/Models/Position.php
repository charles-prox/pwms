<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'name', 'abbreviation'];

    public function officers()
    {
        return $this->belongsToMany(Officer::class, 'officer_position');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
