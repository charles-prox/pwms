<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OldDocument extends Model
{
    use HasFactory;

    protected $table = 'old_documents';

    protected $fillable = [
        'box_id',
        'rds_id',
        'document_code',
        'description',
        'document_date',
        'disposal_date',
        'status',
        'added_at',
        'added_by',
    ];

    public $timestamps = false; // Since you're using `added_at` instead of Laravel's default timestamps

    protected $casts = [
        'document_date' => 'date',
        'disposal_date' => 'date',
        'added_at' => 'datetime',
    ];

    public function box()
    {
        return $this->belongsTo(OldBox::class, 'box_id');
    }

    public function rds()
    {
        return $this->belongsTo(Rds::class, 'rds_id');
    }

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'added_by', 'hris_id');
    }
}
