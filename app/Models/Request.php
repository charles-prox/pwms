<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $fillable = [
        'form_number',
        'request_type',
        'status',
        'is_draft',
        'request_date',
        'office_id',
        'created_by',
        'updated_by',
        'completed_by',
        'approved_by',
        'created_at',
        'updated_at',
        'completed_at',
        'approved_at',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function completer()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function office()
    {
        return $this->belongsTo(Office::class, 'office_id');
    }
}
