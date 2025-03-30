<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoxLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'boxable_id',
        'boxable_type',
        'location_id',
        'position',
    ];

    public function boxable()
    {
        return $this->morphTo();
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id');
    }
}
