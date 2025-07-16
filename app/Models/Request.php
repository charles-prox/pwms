<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

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
        'approved_at',
        'pdf_path',
        'form_year',
        'form_sequence',
        'submitted_at',
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

    public function statusLogs()
    {
        return $this->hasMany(RequestStatusLog::class)->latest('created_at');
    }

    // Pivoted relationship for boxes with remarks
    public function boxes()
    {
        return $this->belongsToMany(Box::class, 'request_box')
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

    public function getBoxRemarks(Box $box, string $requestType, string $remarksType = 'creation'): ?string
    {
        $pivot = $this->boxes()->where('box_id', $box->id)->first()?->pivot;

        if (!$pivot) {
            return null;
        }

        $column = match (strtolower($remarksType)) {
            'creation' => match (strtolower($requestType)) {
                'storage' => 'storage_remarks',
                'withdrawal' => 'withdrawal_remarks',
                'return' => 'return_remarks',
                'disposal' => 'disposal_remarks',
                default => null,
            },
            'completion' => match (strtolower($requestType)) {
                'storage' => 'storage_completion_remarks',
                'withdrawal' => 'withdrawal_completion_remarks',
                'return' => 'return_completion_remarks',
                'disposal' => 'disposal_completion_remarks',
                default => null,
            },
            default => null,
        };

        return $column ? $pivot->{$column} : null;
    }


    // Logs a status change and updates the current status
    public function logStatus(string $status, ?int $userId = null, ?string $remarks = null): void
    {
        $this->update(['status' => $status]);

        $this->statusLogs()->create([
            'status' => $status,
            'updated_by' => $userId ?? Auth::id(),
            'remarks' => $remarks,
        ]);
    }
}
