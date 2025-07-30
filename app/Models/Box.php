<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class Box extends Model
{
    use HasFactory;

    protected $table = 'boxes';

    protected $fillable = [
        'box_code',
        'status',
        'office_id',
        'priority_level',
        'disposal_date',
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
            ->withPivot([
                'storage_remarks',
                'withdrawal_remarks',
                'return_remarks',
                'disposal_remarks',
                'storage_completion_remarks',
                'withdrawal_completion_remarks',
                'return_completion_remarks',
                'disposal_completion_remarks',
            ])
            ->withTimestamps();
    }

    public function getCompletedRequest(string $type)
    {
        return $this->requests()
            ->when($type, fn($query) => $query->where('request_type', $type))
            ->whereNotNull('completed_at')
            ->orderByDesc('completed_at') // or use orderBy('completed_at') if you want the earliest
            ->first();
    }

    public function scopeDisposable(Builder $query): Builder
    {
        return $query->where('status', 'stored')
            ->whereDate('disposal_date', '<', Carbon::today()->subMonth());
    }
}
