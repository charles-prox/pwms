<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoxLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'box_id',
        'location_id',
        'position',
    ];

    public function box()
    {
        return $this->belongsTo(OldBox::class, 'box_id');
    }

    public function location()
    {
        return $this->belongsTo(Location::class, 'location_id');
    }
}
