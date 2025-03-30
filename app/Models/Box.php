<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Box extends Model
{
    use HasFactory;

    protected $table = 'boxes';

    protected $fillable = [
        'box_code',
        'description',
        'status',
        'office_id',
        'priority_level',
        'disposal_date',
    ];

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function boxLocations()
    {
        return $this->morphMany(BoxLocation::class, 'boxable');
    }
}
