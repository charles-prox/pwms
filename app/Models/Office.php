<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'acronym',
        'type',
        'pro_code',
        'parent_id',
    ];

    protected $attributes = [
        'pro_code' => 15, // Default value for pro_code
    ];

    /**
     * Relationship: Offices can have multiple sub-offices.
     */
    public function subOffices()
    {
        return $this->hasMany(Office::class, 'parent_id');
    }

    /**
     * Relationship: An office can have a parent office.
     */
    public function parentOffice()
    {
        return $this->belongsTo(Office::class, 'parent_id');
    }

    /**
     * Relationship: An office is linked to a region via pro_code.
     */
    public function region()
    {
        return $this->belongsTo(Region::class, 'pro_code', 'pro_code');
    }

    /**
     * Relationship: An office can have multiple locations (racks).
     */
    public function locations()
    {
        return $this->hasMany(Location::class, 'office_id');
    }
}
