<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OldBox extends Model
{
    use HasFactory;

    protected $table = 'old_boxes';

    protected $fillable = [
        'box_code',
        'description',
        'location_id',
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
