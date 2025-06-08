<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'box_id',
        'rds_id',
        'document_code',
        'description',
        'document_date_from',
        'document_date_to',
        'disposal_date',
        'status',
        'added_at',
        'added_by',
        'is_permanent',
    ];

    protected $casts = [
        'document_date_from' => 'date',
        'document_date_to' => 'date',
        'disposal_date' => 'date',
        'added_at' => 'datetime',
    ];

    // Relationships
    public function box()
    {
        return $this->belongsTo(Box::class);
    }

    public function rds()
    {
        return $this->belongsTo(RDS::class);
    }

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'added_by', 'hris_id');
    }
}
