<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RDS extends Model
{
    use HasFactory;

    protected $table = 'rds';

    protected $fillable = [
        'module',
        'item_no',
        'title_description',
        'active',
        'storage',
        'remarks',
        'department',
    ];

    protected $casts = [
        'item_no' => 'float',
    ];

    /**
     * Get all documents associated with this RDS entry.
     */
    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
