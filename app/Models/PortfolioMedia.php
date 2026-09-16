<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioMedia extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_id',
        'media_type',
        'file_path',
        'thumbnail_path',
        'title',
        'sort_order',
        'is_cover',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_cover' => 'boolean',
    ];

    public function portfolio(): BelongsTo
    {
        return $this->belongsTo(Portfolio::class);
    }
}
