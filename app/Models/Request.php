<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Request extends Model
{
    use HasFactory, Notifiable;

    // Mass assignable fields
    protected $fillable = [
        'form_number',
        'request_type',
        'request_date',
        'requested_by',
        'status',
        'is_draft',
        'created_by',
        'updated_by',
        'completed_by',
        'completed_at',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'request_date'  => 'datetime',
        'created_at'    => 'datetime',
        'updated_at'    => 'datetime',
        'completed_at'  => 'datetime',
        'approved_at'   => 'datetime',
        'is_draft'      => 'boolean',
    ];

    // Relationships

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function completer()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }
}
