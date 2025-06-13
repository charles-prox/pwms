<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestStatusLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_id',
        'status',
        'updated_by',
        'remarks',
        'created_at',
    ];

    public $timestamps = false;
    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Relationships
    public function request()
    {
        return $this->belongsTo(Request::class);
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
