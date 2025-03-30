<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'floor',
        'rack',
        'bay',
        'level',
        'position',
        'capacity',
        'current_boxes',
        'office_id',
    ];

    public $timestamps = false;

    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id');
    }
}
