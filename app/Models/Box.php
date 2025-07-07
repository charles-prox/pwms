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
    public function boxLocation()
    {
        return $this->morphOne(BoxLocation::class, 'boxable');
    }

    public function getFormattedLocationAttribute(): ?string
    {
        if (!$this->relationLoaded('boxLocation') || !$this->boxLocation || !$this->boxLocation->location) {
            return null;
        }

        $loc = $this->boxLocation->location;

        $floor = strtoupper(substr($loc->floor, 0, 1)); // G or M
        $rack = str_pad($loc->rack, 2, '0', STR_PAD_LEFT);
        $bay = str_pad($loc->bay, 2, '0', STR_PAD_LEFT);
        $level = str_pad($loc->level, 2, '0', STR_PAD_LEFT);
        $position = str_pad($this->boxLocation->position, 2, '0', STR_PAD_LEFT);

        return "{$floor}{$rack}-{$bay}{$level}-{$position}";
    }

    public function requests()
    {
        return $this->belongsToMany(Request::class, 'request_box')
            ->withPivot('withdrawal_remarks', 'return_remarks', 'disposal_remarks')
            ->withTimestamps();
    }
}
