<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Office extends Model
{
    use HasFactory, Notifiable;
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'address',
        'type',
        'acronym',
        'parent_id',
    ];

    public function parent()
    {
        return $this->belongsTo(Office::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Office::class, 'parent_id');
    }
}
