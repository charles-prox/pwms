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
        'remarks',
        'status',
        'office_id',
        'priority_level',
        'disposal_date',
        'request_id', // Make sure this is fillable if creating/updating
        'is_permanent',
    ];

    protected $casts = [
        'disposal_date' => 'date',
    ];

    // Relationship: Each box belongs to an office
    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    // Relationship: Each box can have many documents
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    // Optional: if you're using polymorphic locations
    public function boxLocations()
    {
        return $this->morphMany(BoxLocation::class, 'boxable');
    }
}
